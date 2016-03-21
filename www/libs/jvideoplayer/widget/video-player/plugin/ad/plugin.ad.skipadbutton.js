(function () {


    /**
     * Events
     * ==========
     *
     * Triggered
     * ------------
     *
     * - bubblesettext: set the "skip ad" text inside a remote's bubble (info pane)
     * - bubblehide: hide the bubble
     * - bubbleshow: show the bubble
     * - skipad: to skip the current ad
     *
     * 
     * 
     * 
     * listened to
     * ---------------
     *
     * - canskipad: tells the remote to display a bubble with a clickable "skip ad" button inside.
     * - resume: if the user didn't skip the ad, we remove the bubble when the main video resumes.
     *                      Note: we assume that the bubble is used only for the purpose
     *                      of displaying the "skip ad" button.
     *
     *
     *
     *
     *
     *
     */
    window.pluginAdSkipAdButton = function (options) {
        this.d = $.extend({
            text: "Skip ad",
        }, options);
        this.vp = null;
    };

    pluginAdSkipAdButton.prototype = {
        prepare: function (vp) {
            this.vp = vp;
            var zis = this;


            var jLink = $('<a href="#">' + zis.d.text + '</a>');

            //------------------------------------------------------------------------------/
            // EVENTS LISTENING
            //------------------------------------------------------------------------------/
            vp.on('canskipad', function () {
                vp.trigger('bubblehide'); // hide any already existing bubble, by precaution
                vp.trigger('bubblesettext', jLink);
                vp.trigger('bubbleshow');
                jLink.on('click', function () {
                    vp.trigger('bubblehide');
                    vp.trigger('skipad');
                    return false;
                });
            });

            vp.on('resume', function () {
                if (vp.mainVideoHasFocus()) {
                    vp.trigger('bubblehide');
                }
            });
        },
    };
})();
