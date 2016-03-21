(function () {


    /**
     * About events of THIS implementation:
     *
     * The intents are the following.
     *
     * triggered events:
     *
     * - createlayer: to use for debug purposes
     * - setcurrentvideo ( videoInfo ): to refresh the remote text and duration (mantis remote needs duration to start with)
     *                  Plugins should not fire this event directly, but rather use the 
     *                  setCurrentVideo method, or the setMainVideoAsCurrent method.
     *                  Those methods help with the consistency of interactions between events:
     *                  in particular to track whether or not the main video has the focus,
     *                  but maybe other things in the future...
     *                      
     *                      
     * - mainvideoready: to remove the image of the removeLoaderImage plugin
     * - resume: signal that the current video resumes
     * - pause: signal that the current video pauses
     * - timeupdate: signal that the current video's time is changing,
     *                          update the remote timeline
     * - progress: signal when the browser is downloading video,
     *                          update the remote's bufferedRanges
     * - ended: signal that the current video has ended
     *                  when ad video ends, play back the main video
     *
     *
     * listened to events:
     *
     *
     * - resume: resume the current video element
     * - pause: pause the current video element
     * - settime; pos=100: set the time of the current video element
     *                      position is 100 so that you can use the stop propagation mechanism of the events dispatcher
     *                      of this video player.
     *                      This is used by the ad plugin, which prevents you to set the time past the current time
     *                      (basically meaning: you cannot skip the ad without the ad plugin's permission).
     *
     *
     *
     */

    window.videoPlayer = function (options) {

        this.d = $.extend({
            /**
             * The jquery element representing the video player
             */
            element: null,
            /**
             *
             * Default=false.
             *
             * ads are preloaded before they are played (to ensure instant transition
             * between the video and the ad).
             *
             * The preloaded ad is in a layer (called buffer, see LayeredManager object).
             *
             * If this option is set to true, the buffer layer remains in the dom (like a ghost)
             * when the ad is "transferred" from the buffer layer to the ad layer.
             * This might be useful for debugging.
             *
             * If this option is false, then the buffer layers holding the ads are removed as soon
             * as the ad goes live (i.e. is transferred to the ad layer).
             *
             */
            preserveUnusedBuffersAfterTransfer: false,
            plugins: [],
        }, options);


        this.lm = null;
        this.currentVideo = null;
        this.listeners = {};
        this.listenerIndex = 0;
        this.plugins = this.d.plugins;


        /**
         * Usually, the player only plays one video (called the main video).
         * However, it is possible to play another video (in case of ad videos for instance).
         * Although there is one videoElement per video played, you might want to use the same remote for
         * playing both videos.
         *
         * So, the videoInfo is primarily intended to reset the remote's info when you switch from a video to another.
         * It can also be used by plugins that need to sync with the main video only, and not other video types like ads.
         *
         *
         * It contains:
         * - duration: in seconds (automatically set)
         * - title: the title of the video to display in remote with "digital display".
         *
         *
         * The mainVideoInfo property keeps track of the main video info.
         */
        this.mainVideoInfo = {};
        this.mainVideoElement = null;
        /**
         * Helps third party plugins to know whether or not the main video has currently the focus (playing or pausing).
         */
        this._mainVideoHasFocus = false;

        this._init();
    };

    videoPlayer.prototype = {
        /**
         * videoInfo: array
         *      url: string, the url of the video to load
         *      ?title: the title of the video to display in the remote or wherever it seems adequate
         */
        load: function (videoInfo, onReady) {
            var zis = this;
            if (false === ('title' in videoInfo)) {
                videoInfo.title = "";
            }
            var title = videoInfo.title;
            this.loadVideo(videoInfo.url, function (videoElement) {
                zis.mainVideoElement = videoElement;
                zis.mainVideoInfo = zis.createVideoInfo(videoElement, title);
                zis.setCurrentVideo(videoElement, zis.mainVideoInfo);
                zis._mainVideoHasFocus = true;
                zis.trigger("mainvideoready");
                onReady();
            }, 'video');
        },
        resume: function () {
            if (false === this.getCurrentVideo().isPlaying()) {
                this.trigger('resume');
            }
        },
        pause: function () {
            if (true === this.getCurrentVideo().isPlaying()) {
                this.trigger('pause');
            }
        },
        /**
         * Time in seconds
         */
        setTime: function (t) {
            this.trigger('settime', t);
        },
        /**
         * Volume: a value between 0 and 1 (both included)
         */
        setVolume: function (v) {
            this.trigger('setvolume', v);
        },
        //------------------------------------------------------------------------------/
        // PROTECTED API
        //------------------------------------------------------------------------------/
        /**
         * Goal of this method is to help ensure consistency of
         * the videoInfo map structure.
         */
        createVideoInfo: function (videoElement, title = "") {
            return {
                duration: videoElement.getDuration(),
                title: title,
            };
        },
        setCurrentVideo: function (videoElement, videoInfo) {
            if (videoElement === this.mainVideoElement) {
                this._mainVideoHasFocus = true;
            }
            else {
                this._mainVideoHasFocus = false;
            }
            this.currentVideo = videoElement;
            this.trigger("setcurrentvideo", videoInfo);
        },
        mainVideoHasFocus: function(){
            return this._mainVideoHasFocus;
        },
        setMainAsCurrentVideo: function () {
            this.currentVideo = this.mainVideoElement;
            this._mainVideoHasFocus = true;
            this.trigger("setcurrentvideo", this.mainVideoInfo);
        },
        getCurrentVideo: function () {
            return this.currentVideo;
        },
        /**
         * Loads a video in the background,
         * and if the layer argument is set, transfers it to that layer.
         *
         * Then, execute the given function, passing it the new loaded videoElement.
         *
         */
        getLayerNameByUrl: function (url) {
            return url;
        },
        transferLayerContent: function (sourceLayer, destLayer) {
            this.lm.transfer(sourceLayer, destLayer, this.d.preserveUnusedBuffersAfterTransfer);
        },
        loadVideo: function (url, fn, layer = '') {
            /**
             * Note: THIS particular method uses html5 video element only, for now.
             */
            var zis = this;
            var layerName = this.getLayerNameByUrl(url);
            this.createLayer(layerName, -1, '<video src="' + url + '"></video>');
            var videoTag = zis.lm.getJLayer(layerName).find('video')[0];
            var videoElement = new jvpVideoElement();
            videoElement.load(videoTag, function () {
                if ('' !== layer) {
                    zis.transferLayerContent(layerName, layer);
                }
                videoElement.on('timeupdate', function () {
                    zis.trigger('timeupdate');
                });
                videoElement.on('progress', function () {
                    zis.trigger('progress');
                });
                videoElement.on('ended', function () {
                    zis.trigger('ended');
                });
                fn(videoElement);
            });
        },
        on: function (eventName, fn, position = 0) {
            if (false === (eventName in this.listeners)) {
                this.listeners[eventName] = {};
            }

            if (false === (position in this.listeners[eventName])) {
                this.listeners[eventName][position] = {};
            }
            this.listeners[eventName][position][this.listenerIndex++] = fn;
            return this;
        },
        once: function (eventName, fn, position = 0) {
            var zis = this;
            var _fn = function () {
                fn();
                zis.off(eventName, position, _fn);
            };
            this.on(eventName, _fn, position);
            return this;
        },
        off: function (eventName, position, fn = '') {
            if (eventName in this.listeners) {
                if (position in this.listeners[eventName]) {
                    if ('' === fn) {
                        delete this.listeners[eventName][position];
                    }
                    else {
                        for (var i in this.listeners[eventName][position]) {
                            if (fn === this.listeners[eventName][position][i]) {
                                delete this.listeners[eventName][position][i];
                            }
                        }
                    }
                }
            }
        },
        trigger: function (eventName, ...args) {
            this.watchTriggeredEvent(eventName, ...args);
            if (eventName in this.listeners) {
                for (var pos in this.listeners[eventName]) {
                    for (var i in this.listeners[eventName][pos]) {
                        var info = {
                            stopPropagation: false,
                            position: pos,
                            index: i,
                        };
                        this._doTrigger(this.listeners[eventName][pos][i], info, eventName, ...args);
                        if (true === info.stopPropagation) {
                            return;
                        }
                    }
                }
            }
        },
        createLayer: function (name, zIndex, appearance = "") {
            this.trigger('createlayer', name, zIndex, appearance);
            this.lm.createLayer(name, zIndex, appearance);
        },
        watchTriggeredEvent: function (eventName, ...args) {

        },
        //------------------------------------------------------------------------------/
        // PRIVATE
        //------------------------------------------------------------------------------/
        _init: function () {

            var zis = this;


            //------------------------------------------------------------------------------/
            // LAYERED MANAGER
            //------------------------------------------------------------------------------/
            var jLayerManager = this.d.element;
            this.lm = new layeredManager({
                element: jLayerManager,
            });


            //------------------------------------------------------------------------------/
            // BUILD THE WIDGET. We use layer manager internally.
            //------------------------------------------------------------------------------/
            /**
             * Our layers look like this:
             *
             * - video (20)
             * - ground (10)
             * - buffer (-1)
             *
             *
             *
             *
             * This object handles one layer called video, on which the main video (the one that the user
             * is looking at) should be displayed.
             */
            this.createLayer('ground', 10, '<div style="background: black; width: 100%; height: 100%"></div>');
            this.createLayer('video', 20, '');


            //------------------------------------------------------------------------------/
            // AUTO-REGISTERING INTERNAL EVENTS
            //------------------------------------------------------------------------------/
            this.on('resume', function () {
                zis.getCurrentVideo().resume();
            });
            this.on('pause', function () {
                zis.getCurrentVideo().pause();
            });
            this.on('settime', function (t) {
                zis.getCurrentVideo().setTime(t);
            }, 100); 
            this.on('setvolume', function (v) {
                zis.getCurrentVideo().setVolume(v);
            }); 


            //------------------------------------------------------------------------------/
            // INIT PLUGINS
            //------------------------------------------------------------------------------/
            for (var i in this.plugins) {
                this.plugins[i].prepare(this);
            }


        },
        _doTrigger: function (fn, info, eventName, ...args) {
            fn.call(info, ...args);
        },


    };


})();