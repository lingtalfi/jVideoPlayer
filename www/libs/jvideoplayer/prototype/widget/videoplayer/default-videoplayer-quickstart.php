<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    
    
    
    <!-- http://code.jquery.com/jquery-2.2.2.min.js -->
    <script src="/libs/jquery/jquery-2.2.2.min.js"></script>

    
    
    <!-- https://cdn.rawgit.com/lingtalfi/JFullScreen/master/www/libs/jfullscreen/js/jfullscreen.js -->
    <script src="/libs/jfullscreen/js/jfullscreen.js"></script>
    
    
    <script src="/libs/jvideoplayer/js/video-element/html5-video-element.js"></script>
    <script src="/libs/jvideoplayer/js/eventsqueue/eventsqueue.js"></script>
    <script src="/libs/jvideoplayer/widget/layered-manager/layered-manager.js"></script>
    <link rel="stylesheet" href="/libs/jvideoplayer/widget/layered-manager/layered-manager.css">

    <script src="/libs/jvideoplayer/widget/video-player/video-player.js"></script>


    <!--    <script src="/libs/jvideoplayer/widget/video-player/plugin/plugin.debughelper.js"></script>-->
    <script src="/libs/jvideoplayer/widget/video-player/plugin/mantis/plugin.mantis.js"></script>
    <script src="/libs/jvideoplayer/widget/video-player/plugin/mantis/plugin.mantis.timeelapsed.js"></script>
    <script src="/libs/jvideoplayer/widget/video-player/plugin/mantis/plugin.mantis.clonethumbnailpreview.js"></script>


    <script src="/libs/jvideoplayer/js/util/video-events-watcher.js"></script>


    <!-- MANTIS AND DEPENDENCIES -->
    <!-- https://cdn.rawgit.com/lingtalfi/jDragSlider/master/www/libs/jdragslider/js/jdragslider.js -->
    <script src="/libs/jdragslider/js/jdragslider.js"></script>
    <!-- https://cdn.rawgit.com/lingtalfi/VSwitch/master/www/libs/vswitch/js/vswitch.js -->
    <script src="/libs/vswitch/js/vswitch.js"></script>
    <link rel="stylesheet" href="/libs/jvideoplayer/widget/remote/mantis/style.css">
    <script src="/libs/jvideoplayer/widget/remote/mantis/mantis.js"></script>


    <title>Default video player: quickstart</title>
</head>

<body>

<?php echo file_get_contents("templates/jvp.mantis.htpl"); ?>


<script>

    (function ($) {
        $(document).ready(function () {


            var jSurface = $('.mantis_host');
            var jVideoPlayer = $('> .videoplayer', jSurface);

            var vp = new videoPlayer({
                element: jVideoPlayer,
                plugins: [
//                    new pluginDebugHelper({mode: 'triggered', blackList: ["progress", "timeupdate"]}),
                    new pluginMantis({
                        mantis: new Mantis(jSurface),
                        plugins: [
                            new pluginMantisTimeElapsed(),
                            new pluginMantisCloneThumbnailPreview(),
                        ],
                    }),
                ]
            });

            vp.load({
                // use your own mp4 file here.
                url: "/video/panda.mp4",
                title: "Kung Fu panda 2",
            }, function () {
                vp.resume();
            });

        });
    })(jQuery);

</script>


</body>
</html>