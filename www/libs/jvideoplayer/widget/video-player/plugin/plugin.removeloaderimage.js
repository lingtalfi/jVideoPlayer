(function () {

    /**
     * 
     * Events
     * ==========
     * 
     * listened to
     * --------------
     * 
     * - mainvideoready: remove the loader image
     * 
     * 
     * 
     * To ensure that the image is loaded as soon as possible,
     * 
     * 
     * Use this css:
     *
     
     
     .loaderimage {
            position: absolute;
            top: 0;
            z-index: 500;
            width: 100%;
            height: 100%;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            background-attachment: fixed;
            background-color: black;
            display: flex;
            justify-content: center;
            align-items: center;            
        }
     
     
     And this html:


     <div class="loaderimage" style="background-image: url(/img/panda.jpg)">
            <!-- and here put some loader of your choices. -->
            <!-- You can find good loaders on: http://loading.io/ -->
     </div>
     
     
     
     * 
     * 
     * Then this plugin will remove that image when the mainvideoready event is detected.
     * 
     * 
     * 
     */
    window.pluginRemoveLoaderImage = function (options) {
        this.d = $.extend({
            /**
             * jquery handle of the image to remove 
             */
            img: null,
        }, options);
    };

    pluginRemoveLoaderImage.prototype = {
        prepare: function (vp) {
            this.vp = vp;
            var zis = this;

            /**
             * Todo: make the image stay at least X seconds (fast connections you don't see nothing).
             */
            vp.on('mainvideoready', function () {
                zis.d.img.hide();
            });
        },
    };
    
})();
