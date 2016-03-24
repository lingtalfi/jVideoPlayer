(function () {

    /**
     * Events
     * ============
     *
     *
     * triggered
     * ------------
     - createlayer: to create the cue layer
     *
     *
     *
     * listened to
     * ----------------
     * - settime: synchronizes the (ad events) queue
     * - resume: synchronizes the (ad events) queue
     * - pause: synchronizes the (ad events) queue
     * - adinterrupt: will clear the caption screen (adinterrupt is provided by the ad plugin)
     * - setcurrentvideo: do not use subtitles if it's not the main video
     *                          Note: this fulfills my needs now, unfortunately,
     *                          it's going to be a wrong conception at some point in the future:
     *                          todo: change that conception so that subtitles could be attached on a per video basis, rather than just on the main video
     *
     *
     */

    window.pluginCue = function (options) {
        this.d = $.extend({
            /**
             * An array of cue <event>s.
             * This plugin requires an <event> to have the following extra properties:
             *
             * - start: the number of milliseconds after which the cue should be displayed (relative to the beginning of the current video)
             * - duration: number, the number of milliseconds that the cue should last on the screen
             * - text: string, the text of the cue. Carriage returns will be automatically converted to brs
             */
            events: [],
        }, options);
        this.vp = null;
        this.cuesQueue = null;
    };

    pluginCue.prototype = {
        prepare: function (vp) {
            this.vp = vp;
            var zis = this;


            vp.createLayer('cue', 40, '');


            this.cuesQueue = new eventsQueue({
                mode: 'relative',
                events: this.d.events,
                onEventFired: function (event) {
                    vp.lm.clearLayer('cue');
                    var jCue = $('<div class="cue">' + formatText(event.text) + '</div>');
                    vp.lm.getJLayer('cue').append(jCue);
                    setTimeout(function () {
                        jCue.remove();
                    }, event.duration);
                },
            });

            vp.on('settime', function (t) {
                if (vp.mainVideoHasFocus()) {
                    zis.cuesQueue.setTime(t * 1000);
                }
            });
            vp.on('pause', function () {
                if (vp.mainVideoHasFocus()) {
                    zis.cuesQueue.pause();
                }
            });
            vp.on('resume', function () {
                if (vp.mainVideoHasFocus()) {
                    zis.cuesQueue.resume();
                }
            });
            vp.on('setcurrentvideo', function () {
                if (false === vp.mainVideoHasFocus()) {
                    zis.cuesQueue.pause();
                }
            });
            vp.on('adinterrupt', function () {
                vp.lm.clearLayer('cue');
            });


        },
    };


    //------------------------------------------------------------------------------/
    // PRIVATE
    //------------------------------------------------------------------------------/
    function formatText(text) {
        return text.replace("\n", '<br>');
    }
})();
