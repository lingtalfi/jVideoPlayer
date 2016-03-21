<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
    <title>Html page</title>





    <!-- MANTIS AND DEPENDENCIES-->
    <script src="/libs/jdragslider/js/jdragslider.js"></script>
    <script src="/libs/vswitch/js/vswitch.js"></script>
    <link rel="stylesheet" href="/libs/jvideoplayer/widget/remote/mantis/style.css">
    <script src="/libs/jvideoplayer/widget/remote/mantis/mantis.js"></script>

    <style>
        body {
            background: black;
        }
    </style>
</head>


<body>


<?php echo file_get_contents("templates/jvp.mantis.htpl"); ?>


<div id="specials">
    <button class="special toggle_timeline">toggle timeline</button>
    <button class="special toggle_volume">toggle_volume</button>
    <button class="special toggle_mute">toggle_mute</button>
    <button class="special toggle_bubble">toggle_bubble</button>
</div>

<script>
    (function ($) {
        $(document).ready(function () {


            var jSurface = $('.mantis_host');

            


            var duration = 1000; // 1000 seconds
            
            var mantis = new Mantis(jSurface);

            // creating a fake thumbnail preview manually
            mantis.jTimeLinePreview.append('<time>00:00:00</time>');
            mantis.jTimeLinePreview.append('<img src="/img/compute.jpg">');


            
            
            //------------------------------------------------------------------------------/
            // SPECIAL
            //------------------------------------------------------------------------------/
            $('#specials').on('click', '.special', function () {
                if ($(this).hasClass('toggle_timeline')) {
                    jSurface.toggleClass("hide_timeline");
                }
                else if ($(this).hasClass('toggle_volume')) {
                    jSurface.toggleClass("volume_panel");
                }
                else if ($(this).hasClass('toggle_mute')) {
                    var jControl = $('.control_volume');
                    if (jControl.hasClass('jvp-icon-volume-mute')) {
                        jControl
                            .addClass("jvp-icon-volume-high")
                            .removeClass("jvp-icon-volume-mute");
                    }
                    else {
                        jControl
                            .removeClass("jvp-icon-volume-high jvp-icon-volume-medium jvp-icon-volume-low")
                            .addClass("jvp-icon-volume-mute");
                    }

                }
                else if ($(this).hasClass('toggle_bubble')) {
                    jSurface.toggleClass("with_bubble");
                }
                return false;
            });
        });
    })(jQuery);
</script>
</body>
</html>