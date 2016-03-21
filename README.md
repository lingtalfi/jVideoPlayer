jVideoPlayer
==================
2016-03-19


A javascript library to help building a video player.
 
 


![jvideoplayer playing kung fu panda 2](http://s19.postimg.org/vy3rzimw3/jvideoplayer.png)
 
 
Demo video of jvideo player playing Dreamworks' kung fu panda 2: https://www.youtube.com/watch?v=GkYCZXgQLkY

 
 
Summary
------------- 

- [Features](#features) 
- [How to use](#how-to-use) 
- [Structure of the library](#structure-of-the-library) 
- [Learn how to use it](#learn-how-to-use-it) 
- [The global picture](#the-global-picture) 
- [The default videoplayer](#the-default-videoplayer) 
    
    - [The videoElement](#the-videoelement)
    - [Layered Manager](#layered-manager)
    - [Plugins](#plugins)
    
- [The default videoplayer events interaction map](#the-default-videoplayer-events-interaction-map) 
    
    - [videoplayer](#videoplayer)
    - [videoElement](#videoelement)
    - [plugin.removeloaderimage](#pluginremoveloaderimage)
    - [plugin.mantis](#pluginmantis)
    - [plugin.mantis.thumbnailpreview](#pluginmantisthumbnailpreview)
    - [plugin.mantis.clonethumbnailpreview](#pluginmantisclonethumbnailpreview)
    - [plugin.mantis.timelinemark](#pluginmantistimelinemark)
    - [plugin.mantis.timeelapsed](#pluginmantistimeelapsed)
    - [plugin.ad](#pluginad)
    - [plugin.ad.skipadbutton](#pluginadskipadbutton)
    - [plugin.cue](#plugincue)
    
    
- [Tutorial: Create a hello world plugin](#tutorial-create-a-hello-world-plugin) 

    - [Preparing the environment](#preparing-the-environment)
    - [Creating the file](#creating-the-file)
    - [Creating the plugin](#creating-the-plugin)


- [Tutorial: Create an ugly remote from scratch](#tutorial-create-an-ugly-remote-from-scratch) 
- [The eventsqueue](#the-eventsqueue) 
- [Some nomenclature](#some-nomenclature) 
- [Plugin todolist](#plugin-todolist) 
- [Related dependencies](#related-dependencies) 
- [History Log](#history-log) 
 

 
 
Features
------------

- simple and flexible approach 
- built in skin 
- built in ad management (including skip ad button plugin)
- built in subtitles management 
- built in preview thumbnail management
- focus only on modern browsers (not trying to make it compatible in all browsers)
 
 




jVideoPlayer can be installed as a [planet](https://github.com/lingtalfi/Observer/blob/master/article/article.planetReference.eng.md).



How to use
--------------

The following code was used to record the video demo (comments after the code):


```php
<?php


use VideoSubtitles\Srt\SrtToArrayTool;

require_once "bigbang.php"; // start the local universe
$f = __DIR__ . "/assets/kungfupanda2.srt";
$subtitles = SrtToArrayTool::getArrayByFile($f, [
    'startEndUnit' => 'ms',
    'defaultItem' => ['type' => 'cue'],
]);


?><!DOCTYPE html>
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


    <script src="/libs/jvideoplayer/widget/video-player/plugin/plugin.removeloaderimage.js"></script>
    <script src="/libs/jvideoplayer/widget/video-player/plugin/plugin.debughelper.js"></script>
    <script src="/libs/jvideoplayer/widget/video-player/plugin/ad/plugin.ad.js"></script>
    <script src="/libs/jvideoplayer/widget/video-player/plugin/ad/plugin.ad.skipadbutton.js"></script>
    <script src="/libs/jvideoplayer/widget/video-player/plugin/plugin.cue.js"></script>
    <script src="/libs/jvideoplayer/widget/video-player/plugin/mantis/plugin.mantis.js"></script>
    <script src="/libs/jvideoplayer/widget/video-player/plugin/mantis/plugin.mantis.timeelapsed.js"></script>
    <!--    <script src="/libs/jvideoplayer/widget/video-player/plugin/mantis/plugin.mantis.thumbnailpreview.js"></script>-->
    <script src="/libs/jvideoplayer/widget/video-player/plugin/mantis/plugin.mantis.clonethumbnailpreview.js"></script>
    <script src="/libs/jvideoplayer/widget/video-player/plugin/mantis/plugin.mantis.timelinemark.js"></script>


    <script src="/libs/jvideoplayer/js/util/video-events-watcher.js"></script>


    <!-- MANTIS AND DEPENDENCIES-->
    <!-- https://cdn.rawgit.com/lingtalfi/jDragSlider/master/www/libs/jdragslider/js/jdragslider.js -->
    <script src="/libs/jdragslider/js/jdragslider.js"></script>
    <!-- https://cdn.rawgit.com/lingtalfi/VSwitch/master/www/libs/vswitch/js/vswitch.js -->
    <script src="/libs/vswitch/js/vswitch.js"></script>
    <link rel="stylesheet" href="/libs/jvideoplayer/widget/remote/mantis/style.css">
    <script src="/libs/jvideoplayer/widget/remote/mantis/mantis.js"></script>



    <title>Default video player example</title>
</head>

<body>



<style>

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

</style>
<div class="loaderimage" style="background-image: url(/img/panda.jpg)">
    <img src="/img/default.svg">
</div>



<?php echo file_get_contents("templates/jvp.mantis.htpl"); ?>



<script>

    (function ($) {
        $(document).ready(function () {

            var loaderImage = "";


            var adsEvents = [
                {
                    start: 52 * 60 * 1000,
                    url: '/video/matrix.mp4',
                    minplay: 3,
                },
                {
                    title: "Advertising: drink some coffee",
                    start: 19 * 60 * 1000, // 19 minutes
                    url: '/video/bunny.mp4',
                    minplay: 3,
                },
            ];

            var cuesEvents = <?php echo json_encode($subtitles); ?>;


            var jSurface = $('.mantis_host');


            var jVideoPlayer = $('> .videoplayer', jSurface);

            var vp = new videoPlayer({
                element: jVideoPlayer,
                plugins: [
                    new pluginRemoveLoaderImage({
                        img: $('.loaderimage'),
                    }),
                    new pluginDebugHelper({mode: 'triggered', blackList: ["progress", "timeupdate"]}),
                    new pluginAd({
                        events: adsEvents,
                    }),
                    new pluginAdSkipAdButton({
                        text: "Skip this ad",
                    }),
                    new pluginCue({
                        events: cuesEvents,
                    }),
                    new pluginMantis({
                        mantis: new Mantis(jSurface),
                        plugins: [
                            new pluginMantisTimeElapsed(),
//                            new pluginMantisThumbnailPreview({
//                                urlFormat: '/video/screenshots/panda1s/img_{n}.png',
//                                timeInterval: 1,
//                            }),
                            new pluginMantisCloneThumbnailPreview(),
                            new pluginMantisTimelineMark({
                                marks: adsEvents,
                            }),
                        ],
                    }),
                ]
            });


            vp.load({
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
```


I will now describe the code above, without explaining too much details, and without explaining all terms.
You can learn more about those terms and details by reading the documentation in this repository.



In the above code, the first php block creates the subtitles list (the assets/kungfupanda2.srt is not included in the sources, 
you need to get your own srt file).

Then all assets are loaded (there is a lot).


Then we style the loaderimage css class and include the loaderimage html code.
This is a fullscreen overlay image with an ajax loader at its center that shows up while the video is loading in 
the background.

When the video is ready, the loaderimage is hidden, showing the application below it.

While testing in local, I found this technique useful for slow connections (3G, 4G).
With Wifi, the loader image screen appears about 1 second before it disappears.
With a regular dsl connection, the loader image screen appears for the time of a blink (less than 0.5s) and vanishes right away.

The img/default.svg was generated from this website: http://loading.io/
They provide svg and css3 (and gif) version of various ajax loaders.

In production, I would use the css3 version, but for this demo the svg version makes the code more compact, and hence readable.



Then we call the mantis template via php.
Mantis is the name of the default skin used for the video player.

Note: jvideoplayer can have any look. 


Then, we have the js code:

- first defining the adsEvents and cuesEvents variables, which hold the list of ads and subtitles respectively.
- then we declare the jSurface variable, which contains the remote controller (the widget that contains the play/pause/timeline...), and is required by the mantis plugin.
- then we declare the jVideoPlayer variable, which contains the video player (the video itself)
- then we create the videoPlayer object, with all plugins attached
- last, we load tell the video player to load the "kung fu panda" video, and play it when ready (the video/panda.mp4 is not included in this repository).


Note: I didn't include any video in the repository (too much weight), so you need to replace them by your owns.






Structure of the library
----------------------------


This is the core structure of the jvideoplayer library.


```
.
├── libs
│   └── jvideoplayer
│       ├── js
│       │   ├── eventsqueue
│       │   │   └── eventsqueue.js
│       │   ├── util
│       │   │   └── video-events-watcher.js
│       │   └── video-element
│       │       ├── html5-video-element.js
│       │       └── video-element.js
│       ├── prototype
│       │       ├── ... contains some demo/prototypes files
│       └── widget
│           ├── layered-manager
│           │   ├── layered-manager.css
│           │   ├── layered-manager.js
│           │   └── layered-manager.scss
│           ├── remote
│           │   └── mantis
│           │       ├── fonts
│           │       │   ├── icomoon.eot
│           │       │   ├── icomoon.svg
│           │       │   ├── icomoon.ttf
│           │       │   └── icomoon.woff
│           │       ├── mantis.js
│           │       ├── style.css
│           │       └── style.scss
│           └── video-player
│               ├── plugin
│               │   ├── ad
│               │   │   ├── plugin.ad.js
│               │   │   └── plugin.ad.skipadbutton.js
│               │   ├── mantis
│               │   │   ├── plugin.mantis.clonethumbnailpreview.js
│               │   │   ├── plugin.mantis.js
│               │   │   ├── plugin.mantis.thumbnailpreview.js
│               │   │   ├── plugin.mantis.timeelapsed.js
│               │   │   └── plugin.mantis.timelinemark.js
│               │   ├── plugin.cue.js
│               │   ├── plugin.debughelper.js
│               │   └── plugin.removeloaderimage.js
│               └── video-player.js
└── templates
    └── jvp.mantis.htpl
```    
    
    
    
Learn how to use it 
---------------

To use it correctly, you need to have the global picture: what elements are used, and how they interact together.
Then you also need examples of code to play with.

Let's do this.



The global picture
---------------------

The most abstract picture is perhaps that there is a **videoplayer** in the middle, and plugins around it.

The **videoplayer**'s role is to play one video.
It has typically three methods:

- load
- resume
- pause


So, a **videoplayer** alone can play a video.

Now if you want to interrupt the video and play an advertising, you would need a plugin.

Even more basic, if you want the user to click a play button, you would need to create it yourself, because the **videoplayer**
is just a js object, with no html body. 

You could simply draw an html button, and when the user clicks on it, it would call
the **videoplayer**'s resume button. 

That would work as expected. Then, you could encapsulate that code in a plugin, so that it could be reused.

The plugins provide functionality for the **videoplayer**.


Having this image in mind is a good start, but if you were to develop your own plugins, it wouldn't be enough.

Below, I will describe my implementation of the **videoplayer**, which I will call  the **default videoplayer** from now on,
but bear in mind that it's very possible to create your own **videoplayer** if necessary. 
 
 
 
 
The default videoplayer
----------------------------
 
 
File:  [/libs/jvideoplayer/widget/video-player/video-player.js](https://github.com/lingtalfi/jVideoPlayer/blob/master/www/libs/jvideoplayer/widget/video-player/video-player.js)
 

The **default videoplayer** uses two core components, and some plugins.
The two core components are:
 
- video element 
- layered manager



If you want to develop your own plugins for the **default videoplayer**, it's essential that you understand how it's conceived.

Here is an abstract representation of the **default videoplayer**:

![default videoplayer, abstract](http://s19.postimg.org/f96xhcfoj/default_videoplayer_architecture.jpg)


There is a wavy ellipsis representing the public api of the video player.

The public methods are in black color, they are meant to be used by your application, or anything else.
The methods in red are meant to be used by plugins and other jvideoplayer objects.

In the center of that ellipsis, we have the two core components (layer manager and videoElement) and their api.

Outside of the ellipsis, we have the plugins.




Note: when the **default videoplayer** was created, I was only concerned with playing .mp4 files.
This means that the **default videoplayer** might not be able to play other file formats.

Also, I was only concerned to make it work in Chrome and Firefox browsers.
So, it might not work in other browsers.



 
### The VideoElement
 
The video element is an abstraction of the technology (html5/flash/others/...) used to play the video.
It provides some basic methods that every video player technology should have:

- load
- resume
- pause
- setTime
- setVolume
- ...


All those methods are described in the file: [/libs/jvideoplayer/js/video-element/video-element.js](https://github.com/lingtalfi/jVideoPlayer/blob/master/www/libs/jvideoplayer/js/video-element/video-element.js)

The html5 video tag implementation is in the file: [/libs/jvideoplayer/js/video-element/html5-video-element.js](https://github.com/lingtalfi/jVideoPlayer/blob/master/www/libs/jvideoplayer/js/video-element/html5-video-element.js)


### Layered Manager



The layered manager uses the concept of layers, like in adobe photoshop.

We can create a layer, delete a layer, clean a layer, set the content of a layer, transfer the content of a layer to another,
show a layer, and hide a layer.

How is that useful?

The concept of layers is actually at the heart of the **default videoplayer** philosophy.

It allows us to do various things, we can:

- use a transparent layer to display subtitles on top of the main video
- use an opaque black layer to hide elements behind
- play an advertising on top of the main video, and remove that layer when the advertising ends.
- and probably many other things



### Plugins


Plugin connect the external world to the **default videoplayer**. 

Everything is/can be turned into a plugin: the remote, the ad manager, the subtitles manager, etc...


As I created the **default videoplayer**, I created some plugins for my personal needs.
Those are included in the repository and are called built-in plugins.


The image below shows an abstract view of the built-in plugins.


![default videoplayer built-in plugins]( http://s19.postimg.org/pgpgtr1wj/default_videoplayer_built_in_plugins.jpg )


Those built-in plugins, in a nutshell, are:


- plugin.removeloaderimage:  remove the loader image when the video is ready (more details below)
- plugin.mantis:  the remote controller by which the user can control the video (play/pause/volume/...)
- plugin.ad: put as many ads as you want on the timeline
- plugin.ad.skipadbutton: "dependency" of the ad plugin. Display a "skip ad button" after x seconds of played advertising.
- plugin.debughelper: tells you what events are fired, and what events are listened to (more on events later)
- plugin.cue: add subtitles to your video


Also, the mantis plugin has its own plugins:

- plugin.mantis.thumbnailpreview: display a thumbnail preview, when the user hovers the timeline, using static snapshots server side
- plugin.mantis.clonethumbnailpreview: display a thumbnail preview, when the user hovers the timeline, using a cloned video tag trick
- plugin.mantis.timelinemark: allow the developer to write marks on the timeline, useful for representing the ads position for instance
- plugin.mantis.timeelapsed: display the elapsed time at any moment



If you would like abstract but more detailed explanations on those built-in plugins, please read the [default videoplayer built-in plugins documentation](https://github.com/lingtalfi/jVideoPlayer/blob/master/doc/default-videoplayer-builtin-plugins.md).






At this point, you should have a global overview of what elements are used in the jvideoplayer system.

That's good. But my goal is to take you to the point where you can develop your own plugins, and we are not there yet.

So let's continue our exploration.




The default videoplayer events interaction map
---------------------------------------------------

At some point in the conception of the jvideoplayer, I was kind of lost: there was too much going on and I couldn't 
figure it out.

I knew that I needed some kind of map, since what is on the paper is not on my mind anymore.
 
So I came up with a simple method that helped me a lot, and hopefully can help you too: create an event interaction map (eim).
 
First distinguishing between "fired" events and "listened to" events.
Using red for fired events, and green for listened to events.
 
Then listing all events of the objects, and we get the following result:


![Default videoplayer built-in plugins events interaction map](http://s19.postimg.org/mo0ungqxv/default_videoplayer_builtin_plugins_events_inter.jpg)


Of course, this map is just a visual cheatsheet, and it is useful only if you know WHY every 
event was created in the first place.

Every event has its reason to be (i.e. it's not a theoretical map, but a concrete one),
and those reasons are explained in the source code of the elements.

Here is what happens:


### videoplayer


- fired:

    - createlayer: used for debug purposes
    - setcurrentvideo ( videoInfo ): to refresh the remote text and duration (mantis remote needs duration to start with)
                    
                    Plugins should not fire this event directly, but rather use the 
                    setCurrentVideo method, or the setMainVideoAsCurrent method.
                    Those methods help with the consistency of interactions between events:
                    in particular they keep track of whether or not the main video has the focus,
                    and they could do other things in the future...
                    
    - mainvideoready: to remove the image of the removeLoaderImage plugin
    - resume: signal that the current video resumes, possibly change the mantis remote's play/pause button appearance
    - pause: signal that the current video pauses, possibly change the mantis remote's play/pause button appearance
    - timeupdate: signal that the current video's time is changing, update remote's timeline scrubber
    - progress: signal when the browser is downloading video, update the remote's bufferedRanges
    - ended: signal that the current video has ended.
                    When ad video ends, play back the main video.
                    

- listened to:

    - resume: resume the current video 
    - pause: pause the current video
    - settime; pos=100: set the time of the current video element
    
            position is 100 so that you can use the stop propagation mechanism of the events dispatcher of this **default video player**.
            This is used by the ad plugin, which prevents you to skip the ad by moving the timeline scrubber to a not yet played part.
            
       
            
            
Note: the **default videoplayer** listens to events that it itself fires.

Note2: the events dispatcher used by the **default videoplayer** is based on the [events dispatcher with position and stop propagation model](https://github.com/lingtalfi/jsdispatchers/blob/master/dispatcher_propagation_position.js)
            
            

### videoElement

The videoElement's events should generally not be listened to directly,
because the less events we have to deal with the better.

The videoElement's events are proxied by the **default videoplayer**,
and one should listen to the corresponding **default videoplayer**'s events instead.
    
    
- fired:
    
    - timeupdate: 
            
            fired as the time flows.
            The time should be updated in interval smaller than a second.
            Intervals don't have to be constant.
            
    - progress: 
            
            fired when chunks of video are downloaded.
            This helps creating a visual representation of the buffered ranges.
            
    - ended: 
            
            fired when the video naturally ends,
            or if the time is set to a value more than or equal to the duration.



### plugin.removeloaderimage


- listened to:

    - mainvideoready: remove the loader image


### plugin.mantis


- fired:

     - settime: via vp.setTime (**default videoplayer's** setTime method), set the current video's new time when the user finishes scrubbing the time line
     - resume: via vp.resume, resume the current video when the user click the mantis play/resume button
     - pause: via vp.pause, pause the current video when the user click the mantis pause button
     - setvolume: via vp.pause, set the current video's volume when the user drags the volume slider 

    
- listened to:

     - setcurrentvideo: prepare the mantis remote to play the new video (visual appearance and texts)
     - timeupdate: update the timeline of mantis
     - progress: update buffered ranges in the timeline
     - resume: to sync the play button with the video player state, if necessary
     - pause: to sync the pause button with the video player state, if necessary
     - setvolume: to sync the volume slider with the video player state, if necessary
     - bubblehide: hide the bubble (originally designed to show the "skip ad button")
     - bubbleshow: show the bubble
     - bubblesettext: set the text of the bubble
    


### plugin.mantis.thumbnailpreview


- listened to:

    - setcurrentvideo: take and use the duration when the current video is ready (need duration for calculation of WHERE to position the preview)


Note: this mantis plugins uses mantis events (not to confound with the **default videoplayer**'s events).
If you are interested in mantis events, have a look at the end of the [mantis page](https://github.com/lingtalfi/jVideoPlayer/blob/master/doc/mantis.md).



### plugin.mantis.clonethumbnailpreview


- listened to:

    - setcurrentvideo: take and use the duration when the current video is ready (need duration for calculation of WHERE to position the preview)


Note: this mantis plugins uses mantis events (not to confound with the **default videoplayer**'s events).
If you are interested in mantis events, have a look at the end of the [mantis page](https://github.com/lingtalfi/jVideoPlayer/blob/master/doc/mantis.md).




### plugin.mantis.timelinemark


- listened to:

    - setcurrentvideo: take and use the duration when the current video is ready (need duration for calculation of WHERE to position the marks)


Note: this mantis plugins uses mantis events (not to confound with the **default videoplayer**'s events).
If you are interested in mantis events, have a look at the end of the [mantis page](https://github.com/lingtalfi/jVideoPlayer/blob/master/doc/mantis.md).




### plugin.mantis.timeelapsed


- listened to:

    - timeupdate: take the current time, and display its formatted version in the text info box (see mantis skin image)


Note: this mantis plugins uses mantis events (not to confound with the **default videoplayer**'s events).
If you are interested in mantis events, have a look at the end of the [mantis page](https://github.com/lingtalfi/jVideoPlayer/blob/master/doc/mantis.md).




### plugin.ad

- triggered:


    - setcurrentvideo: (via setCurrentVideo and setMainAsCurrentVideo methods), to switch from main video to ad and vice versa,
                           allow the remote to refresh
    - createlayer: to preload the ads in the background, and of course to create the ad layer itself (and its adground buddy, which is 
                    an opaque overlay between the main video layer and the ad layer: it ensures that we don't see the main video behind the ad 
                    when the ad has smaller dimensions than the main video)
    - pause: pause the main video before switching to an ad video                               
    - resume: resume the main video after an ad video ends       
    - canskipad: signal a third party plugin that the ad might be skipped now
    - adinterrupt: signal a third party plugin that an ad is starting.
                            The intent is to remove any caption from the screen when we switch to the ad video.
                           

- listened to:

     - timeupdate: when an ad video is playing, watch for the moment when the user can skip the ad and trigger canskipad event.
     - ended: when an ad video ends, play back the main video
     - settime; pos=50:
                          If no ad is playing, synchronizes the (ad events) queue's origin. (Look in the documentation for eventsqueue for more details).
                          If ad is playing, we forbid the user to skip the ad by scrubbing the time line,
                          unless she has waited $minplay seconds.
                               Position is 50, which is less than the default video player's position of 100.
                          This allows us to override the videoplayer's default behaviour.
                          
     - resume: synchronizes the (ad events) queue if necessary
     - pause: synchronizes the (ad events) queue if necessary
     - skipad: received from a third party plugin (like plugin.ad.skipadbutton), will skip the current ad 


### plugin.ad.skipadbutton


- triggered:

     - bubblesettext: set the "skip ad" text inside a remote's bubble (mantis has such a bubble, see mantis skin image)
     - bubblehide: hide the bubble
     - bubbleshow: show the bubble
     - skipad: to skip the current ad
     
     
- listened to:
     
     - canskipad: tells the remote to display a bubble with a clickable "skip ad" button inside.
     - resume: if the user didn't skip the ad, we remove the bubble when the main video resumes.
                          Note: we assume that the bubble is used only for the purpose
                          of displaying the "skip ad" button.     
     
     
### plugin.cue


- triggered:
 
    - createlayer: to create the cue layer 

- listened to:
 
     - settime: synchronizes the (ad events) queue (see eventsqueue somewhere in the documentation for more details)
     - resume: synchronizes the (ad events) queue
     - pause: synchronizes the (ad events) queue
     - adinterrupt: will clear the caption screen (adinterrupt is provided by the ad plugin)
     - setcurrentvideo: do not use subtitles if it's not the main video
                              Note: this fulfills my needs now, unfortunately,
                              it's going to be wrong (by conception) at some point in the future:
                              todo: change that conception so that subtitles could be attached on a per video basis, rather than just on the main video    
    


Knowing the why is important, especially if you build your own plugins, because then you know
if you should re-use existing events, or create new ones. 




Tutorial: Create a hello world plugin
-----------------------------------------------

Ok, enough theory.

When in doubt, come back to this page to ensure that you've got the what and why, but now we will focus on the how.

In this section, you will build your first plugin.

If you feel that it's too soon, you can try the "create an ugly remote from scratch" tutorial in the next section.

So what will we do here?


Sometimes, you need to communicate info to users.

The plugin that we will build will display a simple message to the screen, and the main video behind will pause.
The message will be displayed for x seconds, and then disappear. When the message disappears, the main video will resume.
 
 
 
### Preparing the environment 
 
So let's start by creating a very basic video player, just to get us started.
Paste the [quickstart](https://github.com/lingtalfi/jVideoPlayer/blob/master/www/libs/jvideoplayer/prototype/widget/videoplayer/default-videoplayer-quickstart.php) code in an html page and run it in a browser.


### Creating the file

Then we will create the plugin file first.
Create the myplugin.js file at the root of your webserver, and put this starter plugin code in it:

```js
(function () {
    window.myPlugin = function (options) {
        this.d = $.extend({
            // ...
        }, options);
    };

    myPlugin.prototype = {
        prepare: function (vp) {
            console.log("inside my plugin");
        },
    };
})();

```


Then add a link to it in your html head:

```html
<script src="/myplugin.js"></script>
```

Finally, plug your plugin into the **default videoplayer**:
 
 
```js
var vp = new videoPlayer({
    element: jVideoPlayer,
    plugins: [
        // new pluginDebugHelper({mode: 'triggered', blackList: ["progress", "timeupdate"]}),
        new pluginMantis({
            mantis: new Mantis(jSurface),
            plugins: [
                new pluginMantisTimeElapsed(),
                new pluginMantisCloneThumbnailPreview(),
            ],
        }),
        new myPlugin(),
    ]
});
``` 

Now test it in your browser, you should see the "inside my plugin" message in your console.


### Creating the plugin

Ok. Time to think about the plugin's behaviour and options.

We can start with the options. Common sense would give us the following options:

- start: the time in seconds when the message should appear
- text: the text to display
- duration: how long should the text appear, in seconds


Open your plugin file and update the options, set useful values:

```js
(function () {
    window.myPlugin = function (options) {
        this.d = $.extend({
            /**
             * I use 3 here because I don't want to wait too long while testing...
             */
            start: 3, 
            text: "Hello World", 
            duration: 4, 
        }, options);
    };

    myPlugin.prototype = {
        prepare: function (vp) {
            console.log("inside my plugin");
        },
    };
})();
```


While the plugin file is open, let's create the plugin's body.

The prepare function is called when the **default videoplayer** initializes.
The vp argument stands for **default videoplayer**.

If you forgot about which methods it has, re-read this documentation, or directly browse the 
source file: [default video player](https://github.com/lingtalfi/jVideoPlayer/blob/master/www/libs/jvideoplayer/widget/video-player/video-player.js).


We basically want to use the same strategy as the ad plugin, but we will use a simplified 
version, since it's a hello tutorial.

We will start by adding a setTimeout when the video loads.
We can use the setcurrentvideo event for that, and check that the main video is playing (if we used the ad plugin,
the current video could be an ad, and we don't want to display the message if this is an ad).


```js
(function () {
    window.myPlugin = function (options) {
        this.d = $.extend({
            /**
             * I use 3 here because I don't want to wait too long while testing...
             */
            start: 3,
            text: "Hello World",
            duration: 4,
        }, options);
    };

    myPlugin.prototype = {
        prepare: function (vp) {
            var zis = this;

            vp.on('setcurrentvideo', function () {
                if (true === vp.mainVideoHasFocus()) {
                    setTimeout(function () {
                        console.log("boom");
                    }, zis.d.start * 1000);
                }
            });
        },
    };
})();

```

Test it in your browser, wait three seconds and you should see the boom message in your console.

Cool.

Now, let's add a layer on top of the main video layer (see layer manager somewhere in this documentation if you forgot
about layers); when the text message appears, we want to pause the video.


Our plugin code now looks like this:

```js
(function () {
    window.myPlugin = function (options) {
        this.d = $.extend({
            /**
             * I use 3 here because I don't want to wait too long while testing...
             */
            start: 3,
            text: "Hello World",
            duration: 4,
        }, options);
    };

    myPlugin.prototype = {
        prepare: function (vp) {
            var zis = this;

            /**
             * We can actually create the layer before, since it's transparent.
             * We use a zIndex of 60, which is a high number, higher than any layer created by any built-in plugins
             * of the default videoplayer ecosystem. This ensure that our message will be on top of other layers.
             */
            vp.createLayer('mylayer', 60);


            vp.on('setcurrentvideo', function () {
                if (true === vp.mainVideoHasFocus()) {
                    setTimeout(function () {


                        
                        
                        vp.trigger('pause'); // pause the main video
                        
                        vp.lm.clearLayer('mylayer'); // ensure everything is clean
                        vp.lm.getJLayer('mylayer').append(zis.createLayerContent(zis.d.text)); // append our text
                        

                    }, zis.d.start * 1000);
                }
            });
        },
        createLayerContent: function (text) {
            return '<div class="mylayerstyle">' + text + '</div>';
        },
    };
})();

```


Notice that I used the lm reference of the vp object.

The default video player (vp) proxies some of the layer manager for us, but not all of them.
 
In order to access the underlying layer manager api, we can simply use the lm reference.

When in doubt, just browse the source code of the **default video player**.




Notice that we set the mylayerstyle class on our text container element.

Let's style it a little bit using css (in your html head for instance):


```html
    <style>
        .mylayerstyle {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8); /** let the main video appear slightly in the background **/
            color: white;
            font-size: 5em;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
```


Ok. We are in good shape for the final phase: remove the message after $duration seconds, and resume the main video.

Actually, we can just clear the layer instead of removing it totally.


Our final plugin code now looks like this:

```js
(function () {
    window.myPlugin = function (options) {
        this.d = $.extend({
            /**
             * I use 3 here because I don't want to wait too long while testing...
             */
            start: 3,
            text: "Hello World",
            duration: 4,
        }, options);
    };

    myPlugin.prototype = {
        prepare: function (vp) {
            var zis = this;

            /**
             * We can actually create the layer before, since it's transparent.
             * We use a zIndex of 60, which is a high number, higher than any layer created by any built-in plugins
             * of the default videoplayer ecosystem. This ensure that our message will be on top of other layers.
             */
            vp.createLayer('mylayer', 60);


            vp.on('setcurrentvideo', function () {
                if (true === vp.mainVideoHasFocus()) {
                    setTimeout(function () {


                        vp.trigger('pause'); // pause the main video

                        vp.lm.clearLayer('mylayer'); // ensure everything is clean
                        vp.lm.getJLayer('mylayer').append(zis.createLayerContent(zis.d.text)); // append our text


                        setTimeout(function () {
                            vp.lm.clearLayer('mylayer');
                            vp.trigger('resume'); // resume the main video

                        }, zis.d.duration * 1000);


                    }, zis.d.start * 1000);
                }
            });
        },
        createLayerContent: function (text) {
            return '<div class="mylayerstyle">' + text + '</div>';
        },
    };
})();

```

Test that in your browser.

Did you made it so far? Good for you then.



As I said earlier, this is a simplified version of the ad mechanism.

A potential problem that we have with this version is that if we change the time (by clicking on the timeline)
BEFORE the hello world message appears, the timeout will simply continue and fire.

But maybe we wanted the hello message to appear only if the time is exactly x seconds.

A possible solution to this problem is using the eventsqueue. I invite you to read the plugin.cue and/or the 
plugin.ad source codes to see how they tackle this problem using the eventsqueue object.

Also you will find more explanation of the eventsqueue object below.
This is somehow an advanced topic, but I believe if you need to set events at some precise points in time, 
it's worth having a look at it.
 



Tutorial: Create an ugly remote from scratch
-------------------------------------------------

The hello world tutorial focused on creating a **default videoplayer** plugin.
This is good if your intent is to extend the functionality of the **default videoplayer**.


But maybe you are tired of the mantis skin and you want to create your own remote.

While this tutorial will not tell you how to design a remote, it will give you insights about how you can
connect some buttons to the **default video player**, thus creating an effective remote.

In fact, the principles explained in this tutorial were used to create the **default videoplayer**'s plugin.mantis plugin,
which is a bridge between the dumb mantis widget and the default video player.

 

Without further ado, let's begin.


Create a file at your webserver's root and paste the following base code in it:


```html 
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
    <script src="/libs/jvideoplayer/widget/video-player/plugin/ad/plugin.ad.js"></script>
    <script src="/libs/jvideoplayer/widget/video-player/plugin/ad/plugin.ad.skipadbutton.js"></script>


    <title>Default video player example</title>
    <style>


        .layered-manager {
            width: 600px;
            height: 400px;
            border: 1px solid gray;
        }

        .layered-manager video {
            width: 100%;
            height: 100%;
        }

        /*--------------------------------------------------------------------------*
        // UGLY REMOTE
        /*--------------------------------------------------------------------------*/
        .controls {
            border: 1px solid #def;
            padding: 10px;
            background: #8AD0D0;
        }

        .title {
            border-bottom: 1px solid white;
            padding-bottom: 5px;
            margin-bottom: 10px;
            text-align: center;
        }

        .bubble {
            border: 1px solid gray;
            padding: 25px;
            margin: 30px;
            text-align: center;
            display: none;
        }

        .bubble a {
            color: #2A218A;
            font-size: 20px;
        }

        .controls header {
            display: inline-block;
        }

        .controls > header {
            font-weight: bold;
            border-bottom: 1px solid white;
            display: block;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }

        .controls section {
            margin-bottom: 10px;
        }


    </style>
</head>

<body>

<div id="videoplayer"></div>


<div id="uglyremote" class="controls">
    <header>The ugly remote</header>


    <div class="title"></div>
    <div class="bubble"></div>

    <section class="defaults">
        <header>Defaults</header>
        <button id="pause">Pause</button>
        <button id="resume">Resume</button>
        <button id="goto">Go to specific time</button>
        <input id="gotoinput" value="2000"/>
    </section>

    <section class="getters">
        <header>Getters</header>
        <button id="getcurrenttime">get current time</button>
        <button id="getduration">get duration</button>
    </section>

    <section class="ads">
        <header>Ads</header>
        <button id="addad">Add advertising</button>
    </section>
</div>

<script>

    (function ($) {
        $(document).ready(function () {

            var jVideoPlayer = $('#videoplayer');

            var adPlugin = new pluginAd();


            var vp = new videoPlayer({
                element: jVideoPlayer,
                plugins: [
                    // new pluginDebugHelper({mode: 'triggered', blackList: ["progress", "timeupdate"]}),
                    adPlugin,
                    new pluginAdSkipAdButton({
                        text: "Skip this ad",
                    }),
                ]
            });


            vp.load({
                // use your own mp4 here...
                url: "/video/panda.mp4",
                title: "Kung Fu panda 2",
            }, function () {
                vp.resume();
            });


            //------------------------------------------------------------------------------/
            // UGLY REMOTE
            //------------------------------------------------------------------------------/
            // our ugly remote code here...

        });
    })(jQuery);

</script>


</body>
</html>
```



Run it in your browser.
You should see your video running, and the ugly remote design is already taken care of.

We can guess what the ugly remote is supposed to do, but if you click on its buttons, nothing happens.

Well, that's the goal of this tutorial to complete this code and make the ugly remote alive.

We can accomplish this goal in less than 100 lines of code.


If you have any idea on how to do it, please try them all first; I believe that's the best way to exercice.

Also, at any time, feel free to use the debugHelper plugin. It is a valuable tool when debugging.


Assuming that you've tried everything you could, here is the solution, step by step.



First, when we run the script, the video is playing right away.
But now how do we pause it?

We can use the **default videoplayer**'s pause method for that.
It will trigger the pause event, which other plugins could listen to as well.

In general, it's a good idea to use the **default videoplayer**'s public methods, as they
trigger well known events used by other plugins (rather than using custom events that some plugins might not be aware of,
thus augmenting the risk of incompatibility within plugins).



```js
//------------------------------------------------------------------------------/
// UGLY REMOTE
//------------------------------------------------------------------------------/
$('#pause').on('click', function () {
    vp.pause();
    return false;
});
```


Run this above code in your browser and ensure that when you click the pause button, the video pauses.


Right away, we can do the same for the play button and the settime button, which have corresponding methods 
in the **default videoplayer** api.

Our code becomes:

```js
//------------------------------------------------------------------------------/
// UGLY REMOTE
//------------------------------------------------------------------------------/

 $('#pause').on('click', function () {
     vp.pause();
     return false;
 });
 $('#resume').on('click', function () {
     vp.resume();
     return false;
 });

 $('#goto').on('click', function () {
     var seconds = $('#gotoinput').val();
     vp.setTime(seconds);
     return false;
 });
```


Be sure to test that everything works as expected in your browser.
 
 
 
Next, we have two getters: get current time and get duration.

In this case, the vp (**default video player**) api doesn't provide us the method directly, but assuming 
you know the **default video player**'s architecture (if you don't re-read this documentation), you know that the 
**default video player** internally uses the videoElement.

The videoElement has a getTime method and a getDuration method that would be just what we need here.

To access the videoElement, we can use the getCurrentVideo method of the **default video player**.

Our getters code looks like that:

```js
//------------------------------------------------------------------------------/
// GETTERS
//------------------------------------------------------------------------------/
$('#getcurrenttime').on('click', function () {
    var seconds = vp.getCurrentVideo().getTime();
    console.log(seconds);
    return false;
});

$('#getduration').on('click', function () {
    var seconds = vp.getCurrentVideo().getDuration();
    console.log(seconds);
    return false;
});
```
 


Not bad.
But now if you look closely at the html code of the ugly remote, you will see that there are two empty divs 
with class title and class bubble.

Let's reference them now, because we will need it very soon.


```js
//------------------------------------------------------------------------------/
// UGLY REMOTE
//------------------------------------------------------------------------------/
var jUgly = $('#uglyremote');
var jTitle = $('.title', jUgly);
var jBubble = $('.bubble', jUgly);
```



Well, the first thing I would like you to do is: when a video is loaded, the title should be revealing the title 
of the video. A video could be the main video, an ad video, or any other video in fact.

We can listen to the setcurrentvideo event, which is the dedicated event to indicate a change of the video.

Here is a possible solution:

```js
vp.on('setcurrentvideo', function (videoInfo) {
    jTitle.html("Now playing: " + videoInfo['title'] + ' (' + videoInfo['duration'] + 's)');
});
```



Now I just want to pick your curiosity by using the addEvents method of the plugin.ad plugin.


Copy paste this code into your ugly remote code, and test it in your browser:


```js
$('#addad').on('click', function () {

    var dynamicAdEvents = [
        {
            start: 5000,
            url: '/video/matrix.mp4', // use your own .mp4 video here
            minplay: 3,
        },
    ];

    adPlugin.addEvents(dynamicAdEvents, 'now');
    return false;
});

```


What it should do is: when you click on the "add advertising" button is that after 5 seconds, it should play 
the advertising.

That's right, with the plugin.ad plugin, we can add advertising dynamically if we need to.

Okay, let's move on.


Notice that our code uses the plugin.ad.skipadbutton plugin. 
If you forgot what events are triggered by the plugin.ad.skipadbutton plugin, it's time to review them (look at the default videoplayer's 
built-in plugins events interaction map image), because now we will need that knowledge to build the next step.


What I want you to do is to make a bubble appear once the ad has been playing for $minplay=3 seconds.

Think about what event you should listen to.

Ok, now the solution.

We know from the events interaction map that the bubbleshow, bubble hide and bubblesettext events will be triggered by 
the plugin.ad.skipadbutton plugin.
 
We can simply use them, like that:

```js
vp.on('bubbleshow', function () {
    jBubble.show();
});
vp.on('bubblehide', function () {
    jBubble.hide();
});
vp.on('bubblesettext', function (text) {
    jBubble.empty().append(text);
});

```

That's how powerful events are.


Okay, time for wrapping it all.
Our final ugly remote code looks like this:
 
 
```js 
//------------------------------------------------------------------------------/
// UGLY REMOTE
//------------------------------------------------------------------------------/
var jUgly = $('#uglyremote');
var jTitle = $('.title', jUgly);
var jBubble = $('.bubble', jUgly);


//------------------------------------------------------------------------------/
// FIRING EVENTS    
//------------------------------------------------------------------------------/
$('#pause').on('click', function () {
    vp.pause();
    return false;
});
$('#resume').on('click', function () {
    vp.resume();
    return false;
});

$('#goto').on('click', function () {
    var seconds = $('#gotoinput').val();
    vp.setTime(seconds);
    return false;
});
$('#addad').on('click', function () {

    var dynamicAdEvents = [
        {
            start: 5000,
            url: '/video/matrix.mp4',
            minplay: 3,
        },
    ];

    adPlugin.addEvents(dynamicAdEvents, 'now');
    return false;
});


//------------------------------------------------------------------------------/
// GETTERS
//------------------------------------------------------------------------------/
$('#getcurrenttime').on('click', function () {
    var seconds = vp.getCurrentVideo().getTime();
    console.log(seconds);
    return false;
});

$('#getduration').on('click', function () {
    var seconds = vp.getCurrentVideo().getDuration();
    console.log(seconds);
    return false;
});


//------------------------------------------------------------------------------/
// LISTENING TO EVENTS
//------------------------------------------------------------------------------/
vp.on('setcurrentvideo', function (videoInfo) {
    jTitle.html("Now playing: " + videoInfo['title'] + ' (' + videoInfo['duration'] + 's)');
});
vp.on('bubbleshow', function () {
    jBubble.show();
});
vp.on('bubblehide', function () {
    jBubble.hide();
});
vp.on('bubblesettext', function (text) {
    jBubble.empty().append(text);
}); 
``` 
 


Hopefully you could learn one thing or two.



The next step is to create your own plugins.
I recommend that you read the source code of the built-in plugins, which might give your more insights/ideas
on how to tackle specific problems.



The eventsqueue
--------------------

The eventsqueue is an isolated object.
It is used by the plugin.ad and plugin.cue built-in plugins of the **default videoplayer**, but you can use it for your own
plugins if you need to.

What it does is that it allows you to represent your events as a javascript array.
Each entry of the array is then an event, which has at least a starting time, and probably other useful properties.

The eventsqueue can handle two types of times:

- absolute time
- relative time


Absolute time is a date that never changes, like for instance 2016-03-21 23:56:01.
It was created in the perspective that some day, the jvideoplayer suite will include tools that allow you to create
a programmation of videos, rather than just ONE video.


Relative time is a date expressed in seconds (or milliseconds) from a certain point called the video origin, which
is the video time when it starts (i.e. time=0).
For instance, in ms, a value of 4000 indicates that the event should be fired 4s after the video origin.


Eventsqueue make a good job at ensuring consistency of your events when the time changes.

Let's first understand that time can change, indeed, since the user can simply scrub a timeline widget, and therefore
can move forward, and backward again.

Let's now understand that if you define an event's start time, you generally assume that it has to survive the
timeline scrubbing phenomenon.

Indeed, if you say: I want my ad to play 30second after the video origin, you assume that this is independent of
how the user scrubs the timeline.
Well, actually that depends on your business logic, but the plugin.ad plugin has this approach.

So, this means that if the user goes at 40s, then goes back to 28s, then 2 seconds later the ad would be playing.

Well, the eventsqueue has a resume, pause and a setTime methods that you can synchronize with the videoplayer's 
equivalent events. And when you do so, your events magically survive the time changes.


That's the whole point of the eventsqueue.







Some nomenclature
--------------------

It might be helpful to know the meaning of the following terms:
 
 
- main video
    
    when you play ONE video using a video player, it's the main video.
    Other non main videos are the ad video.
    
    
- current video 

    This is the video currently playing.
    It could be either a main video, or an ad video, or maybe another type of video (in the future after 2016-03-20)
    
    
 

 
 
 
Plugin todolist
-------------------
 
Default videoplayer plugins todolist: 
 
- create a plugin that let us use shortcut keys:
 
        - space to toggle the play/pause button
        - up/down arrows to set the volume, with shift used to 10 increment instead of 1 increment
        - left/right arrows to move the current time backward/forward, 1s per stroke, or 10s with shift on
        - f: toggle enter/exit fullscreen
        
- create a plugin that make the mantis control disappear if the user leaves the mouse inactive outside of the remote widget
         for x seconds.
         The mantis remote reappears as soon as the user moves the mouse again
         
 
- create a plugin that summarizes the video info after XX seconds of inactivity

- create a plugin that creates a "back to app link" on the top left corner of the screen
    
    
    
    
    
    
Related dependencies
-------------

- [dragslider](https://github.com/lingtalfi/jDragSlider)
- [vswitch](https://github.com/lingtalfi/VSwitch)
- [fullscreen](https://github.com/lingtalfi/JFullScreen)
    
    
    

    
History Log
------------------
    
- 1.0.0 -- 2016-03-19

    - initial commit
    
        