(function () {

    /**
     * Events
     * ===========
     *
     * triggered events
     * -------------------
     *
     * - setcurrentvideo (via setCurrentVideo and setMainAsCurrentVideo methods),
     *                      to switch from main video to ad and vice versa
     *                      allow the remote to refresh
     * - createlayer: to preload the ads in the background,
     *                      and of course the ad layer itself (and its adground buddy)
     * - pause: pause the main video before switching to an ad video
     * - resume: resume the main video after an ad video ends
     * - canskipad: signal a third party plugin that the ad might be skipped now
     * - adinterrupt: signal a third party plugin that an ad is starting.
     *                      The intent is to remove any caption from the screen when we switch to the ad video.
     *
     *
     *
     *
     * listened to events
     * -----------------------
     *
     * - timeupdate: when an ad video is playing, watch for the moment when the user can skip the
     *                      ad and trigger canskipad event.
     * - ended: when an ad video ends, play back the main video
     * - settime; pos=50:
     *                      If no ad is playing, synchronizes the (ad events) queue's origin.
     *                      If ad is playing, we forbid the user to skip the ad by scrubbing the time line,
     *                      unless she has waited $minplay seconds.
     *
     *                      Position is 50, which is less than the default video player's position of 100.
     *                      This allows us to override the videoplayer's default behaviour.
     *
     *
     * - resume: synchronizes the (ad events) queue if necessary
     * - pause: synchronizes the (ad events) queue if necessary
     * - skipad: received from a third party plugin, will skip the current ad
     *
     *
     */

    window.pluginAd = function (options) {
        this.d = $.extend({
            /**
             * An array of relative <event>s.
             * This plugin requires an <event> to have the following extra properties:
             *
             * - type: string=ad
             * - url: string, the url of the ad video
             * - start: int, the number of milliseconds after which the event should start
             * - ?minplay: int, the number of minimum seconds of video that needs to be watched before
             *          the user can skip the video.
             *          If not set, the ad video has to be watched in its entirety.
             *
             *          A canskipad event is fired when the user can skip the video.
             *          This allows you to make something happen, like a visual "skip ad" button
             *          appear for instance.
             *
             */
            events: [],
            /**
             * The number of seconds below which the ad video
             * should start being loaded (hidden) in the dom.
             *
             * The idea is to ensure that when the ad has to play,
             * it is prepared in advance so the playing is instantaneous
             * when the time comes, and the user doesn't have to wait
             * for the video to load.
             */
            preloadTime: 30,
            getTextByEvent: function (event) {
                if ('title' in event) {
                    return event.title;
                }
                return "Advertising";
            },
        }, options);


        this.vp = null;
        this.adIsPlaying = false;
        this.adsQueue = null;
        this.mainVideo = null;
        /**
         * map: url => videoElement (null|videoElement, the video element, once loaded)
         */
        this.url2VideoInfo = {};
        this.currentAdUrl = null;
        /**
         * By default, one can skip the ad by scrubbing the timeline,
         * unless the minplay property of an event tells otherwise.
         */
        this.canSkipThisAd = true;

    };

    pluginAd.prototype = {
        prepare: function (vp) {
            this.vp = vp;
            var zis = this;

            this.adsQueue = new eventsQueue({
                mode: 'relative',
                events: this.d.events,
                onEventPrepared: function (e, curTime) {


                    if (false === (e.url in zis.url2VideoInfo) || null === zis.url2VideoInfo[e.url]) {

                        zis.url2VideoInfo[e.url] = null;

                        // e.start is in ms
                        var realStartTime = (e.start - zis.d.preloadTime * 1000) - curTime;
                        if (realStartTime < 0) {
                            realStartTime = 0;
                        }
                        setTimeout(function () {
                            vp.loadVideo(e.url, function (videoElement) {
                                zis.url2VideoInfo[e.url] = videoElement;
                            });
                        }, realStartTime);
                    }
                },
                onEventFired: function (event) {


                    vp.lm.clearLayer('ad');
                    var layerName = vp.getLayerNameByUrl(event.url);
                    var adVideoElement = zis.url2VideoInfo[event.url];


                    if (null !== adVideoElement) { // sometimes, queue re-triggers the already fired event (setTimeout with 1ms delay approx problem), so we use defensive programming... 


                        var fn = function () {

                            vp.trigger('pause');
                            vp.transferLayerContent(layerName, 'ad');
                            vp.lm.showLayer('adground');

                            var title = zis.d.getTextByEvent(event);
                            zis.currentAdUrl = event.url;
                            vp.setCurrentVideo(adVideoElement, vp.createVideoInfo(adVideoElement, title));

                            zis.adIsPlaying = true;
                            zis.canSkipThisAd = true;
                            vp.trigger('resume');
                            vp.trigger('adinterrupt');
                        };

                        if (true === adVideoElement.isLoaded()) {
                            // if the video was preloaded correctly, it should be instantly ready
                            fn();
                        }
                        else {
                            /**
                             * This case might rarely occur, if, for any reason at all,
                             * the preloading of the video couldn't complete before THIS function is called.
                             */
                            var int = setInterval(function () {
                                if (true === adVideoElement.isLoaded()) {
                                    clearInterval(int);
                                    fn();
                                }
                            }, 500);
                        }


                        // take care of the minplay logic
                        if ('minplay' in event) {
                            zis.canSkipThisAd = false;
                            var minPlay = event.minplay;
                            var minPlayFn = function () {
                                if (minPlay <= adVideoElement.getTime()) {
                                    vp.trigger('canskipad');
                                    vp.off("timeupdate", 1, minPlayFn);
                                    zis.canSkipThisAd = true;
                                }
                            };
                            vp.on("timeupdate", minPlayFn, 1);
                        }
                    }


                },
            });

            vp.createLayer('adground', 29, {cssClass: 'black'});
            vp.lm.hideLayer('adground');
            vp.createLayer('ad', 30, '');


            //------------------------------------------------------------------------------/
            // EVENTS LISTENING
            //------------------------------------------------------------------------------/
            vp.on('settime', function (t) {
                console.log("change time to " + secondsToHumanTime(t));
                if (false === zis.adIsPlaying) {
                    zis.adsQueue.setTime(t * 1000);
                }
                else {
                    // ad is playing, let's ensure that the user is authorized to skip the ad.
                    if (false === zis.canSkipThisAd) {
                        this.stopPropagation = true;
                    }
                }
            }, 50);
            vp.on('resume', function () {
                if (false === zis.adIsPlaying) {
                    zis.adsQueue.resume();
                }
            });
            vp.on('pause', function () {
                if (false === zis.adIsPlaying) {
                    zis.adsQueue.pause();
                }
            });
            vp.on('skipad', function () {
                if (true === zis.adIsPlaying && true === zis.canSkipThisAd) {
                    // +100 is not necessary, but I like to ensure that we go beyond the duration 
                    var time = vp.getCurrentVideo().getDuration() + 100;
                    vp.trigger('settime', time);
                }
            });
            // when the ad video ends, we play back the main video
            vp.on('ended', function () {
                if (true === zis.adIsPlaying) {
                    zis.adIsPlaying = false;
                    vp.lm.clearLayer('ad');
                    delete zis.url2VideoInfo[zis.currentAdUrl];
                    vp.lm.hideLayer('adground');
                    vp.setMainAsCurrentVideo();
                    vp.trigger('resume');
                }
            });
        },
        /**
         * origin: now|0|number
         *
         *      specifies the origin (time=0) of the given events.
         *
         */
        addEvents: function (events, origin) {
            this.adsQueue.addEvents(events, origin);
        },
    };


    function secondsToHumanTime(d) {
        var hours = parseInt(d / 3600) % 24;
        var minutes = parseInt(d / 60) % 60;
        var seconds = d % 60;
        return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }
})();
