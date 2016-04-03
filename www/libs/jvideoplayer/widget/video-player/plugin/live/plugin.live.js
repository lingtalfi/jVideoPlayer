(function () {

    window.pluginLive = function (options) {
        this.d = $.extend({
            /**
             * An array of absolute <event>s.
             * This plugin requires an <event> to have the following extra properties:
             *
             * - url: string, the url of the video
             * - start: int, the millitimestamp of when the video starts (the number of milliseconds elapsed from 1970-01-01 to the beginning of the video)
             * - ?title: string, the title of the video to be displayed in the remote, if the remote has such capabilities.
             *                  Note: the choice of the title key can be changed, look at the default getTextByEvent option to understand.
             *
             *
             */
            events: [],
            /**
             * fetcher plugin:
             *      any object that has a fetch method:
             *                  fetch ( onFetched )
             *                          onFetched ( jsonEvents )
             */
            fetcher: null,
            /**
             * Preload time in seconds for an event of type video
             */
            videoBufferDuration: 30,
        }, options);


        this.events = this.d.events;
        this.fetcher = this.d.fetcher;
        this.videoQueue = null;
        this.now = null;
        this.vp = null;
        this.firstVideoEver = true; // one time flag
    };

    pluginLive.prototype = {
        prepare: function (vp) {
            var zis = this;
            this.vp = vp;
            this.now = Date.now();

            
            
            
            
            // create the panel layer
            vp.createLayer('panel', 5, '');
            
            

            // process future absolute events
            for (var i in this.events) {
                let event = this.events[i];
                if (isAbsolute(event)) {
                    var timeout = event.start - this.now;
                    if (timeout >= 0) {
                        this._playAbsoluteEventAt(event, timeout);
                    }
                }

            }


            //this._processData(function (jsonItems) {
            //    console.log("items arrived");
            //    console.log(jsonItems);
            //});


//
//            vp.load({
//                url: "/video/panda.mp4",
//                title: "Kung Fu panda 2",
//            }, function () {
//                vp.resume();
//            });


            vp.on('ended', function () {
                /**
                 * Depending on what the current playing video is,
                 * and if it's linked or standalone or???
                 * We do a specific action
                 */
                console.log("video end detected: todo");
            });


        },
        /**
         * origin: now|0|number
         *
         *      specifies the origin (time=0) of the given events.
         *
         */
        addEvents: function (events, origin) {
            this.videoQueue.addEvents(events, origin);
        },
        //------------------------------------------------------------------------------/
        // PRIVATE
        //------------------------------------------------------------------------------/
        _playAbsoluteEventAt: function (event, timeout) {
            console.log("start event #" + event.id + " in " + (timeout / 1000) + "s");

            var fn = null;
            var zis = this;

            switch (event.type) {
                case 'ad':
                case 'video':
                    var promise = zis._preloadVideo(event, timeout);
                    fn = function () {
                        zis._playStandAloneVideo(promise);
                    };
                    break;
                case 'panel':
                    fn = function(){
                        
                    };
                    break;
                default:
                    console.log("event of type " + event.type + ", nothing to prepare");
                    fn = function () {
                    };
                    break;
            }


            setTimeout(function () {
                console.log("playing absolute event #" + event.id);
                fn();
            }, timeout);

        },
        _playStandAloneVideo: function (loadedPromise) {
            var zis = this;
            loadedPromise.then(function (event) {

                if (true === zis.firstVideoEver) {
                    zis.firstVideoEver = false;
                    zis.vp.trigger('mainvideoready');
                    
                    // should emulate vp.load to play nice with ad plugin?
                    // maybe miss a setVurrentVideoAsMain?
                    //zis.mainVideoElement = event.videoElement;
                }

                // the old videoElement is removed when removing the dom
                var layerName = zis.vp.getLayerNameByUrl(event.url);
                var videoInfo = zis.vp.createVideoInfo(event.videoElement, event.title);
                zis.vp.setCurrentVideo(event.videoElement, videoInfo);
                zis.vp.transferLayerContent(layerName, "video");
                event.videoElement.resume();

                console.log("playing the video " + event.url);
            });
        },
        _preloadVideo: function (event, playTimeout) {
            var zis = this;
            var timeout = 0;
            if (playTimeout > this.d.videoBufferDuration * 1000) {
                timeout = playTimeout - this.d.videoBufferDuration * 1000;
            }
            return new Promise(function (resolve, reject) {
                console.log("preloading event #" + event.id + " in " + (timeout / 1000) + "s");
                setTimeout(function () {
                    zis.vp.loadVideo(event.url, function (videoElement) {
                        console.log("video for event #" + event.id + " loaded");
                        event.videoElement = videoElement;
                        resolve(event);
                    });
                }, timeout);
            });
        },
        _processData: function (onDataFetched) {
            // are events provided manually? otherwise fetch them
            if (0 === this.events.length) {
                this.fetcher.fetch(onDataFetched);
            }
            else {
                onDataFetched(this.events);
            }
        },

    };


    function log(m) {
        console.log(m);
    }

    function isAbsolute(event) {
        return (true === event.absolute);
    }

})();
