Default videoplayer built-in plugins
=========================================
2016-03-20



This document explains the **default videoplayer**'s built-in plugin in an abstract but somehow detailed manner.




plugin.removeloaderimage
----------------------------


A constraint that we have to deal with is that before playing a video, we need to preload it.
Depending on your internet connection speed, the loading time may vary from instantaneous to 30 seconds for slow
2G connections (at least from my personal tests).

         
Rather than letting the user just wait, 
we display a big representative image of the video, taking the whole screen, so that the user can woa while the video
is loading in the background.
         
This image take the whole page, and there is an ajax loader in its center, so that the user can understand
that the video is coming.

The removeloaderimage plugin removes the loader image when the video is ready to play.
 
 
If you use this plugin, be aware that you have to create the image by your own.
This is because it's faster if you create it yourself directly in the html, and with small connections, that 
makes a difference (the user can actually see the image BEFORE the video is loaded).




plugin.mantis
------------------

Mantis is a remote.

By default, the user can use the mantis remote to do the following:

- play/resume the video
- pause the video
- scrub the timeline, and therefore change the current time of the video
- change the volume
- enter/exit fullscreen mode


Mantis has its own plugins which are described later on this page.




plugin.ad
----------------

If you need to add some interrupt the main video with some advertising videos, then the ad plugin might be what you are looking for.

You specify an array of events, each event being an object with properties like:

- start: when should the ad start
- url: the url of the ad video
- ?minplay: the number of seconds of played ad video after which the ad could be skipped (see plugin.ad.skipadbutton for more details) 


From the developer's point of view, this plugin uses the layer system of the **default videoplayer**.

It pre-loads the ad video 30s (by default) before it's going to play in a 
background layer (i.e. a layer with a negative z-index, not visible),
and when the time comes to play the ad, it pauses the current video (called main video), transfers the background preloaded ad 
to the dedicated ad layer (which is above the main video's layer), thereby foreshadowing the main video (i.e. it gives the
illusion that the video has switched to the ad). 

When the ad video ends, the ad layer is emptied, thus revealing the main video; and the main video resumes.


If you use this plugin, you might as well have a look at two other built-in plugins described in this page: 

- plugin.mantis.timelinemark, to show a visual mark of when your ad will play on the timeline
- plugin.ad.skipadbutton, to display a skip ad button after x seconds 





plugin.ad.skipadbutton
----------------------------

This plugin was created as a dependency of the plugin.ad plugin (although it is technically NOT dependent of the ad.plugin).

Technically, this plugin reacts to an canskipad event (which is fired by the plugin.ad plugin when the 
minplay property of an event is used).

When this event is detected, this plugin will trigger some events that basically will tell the remote to display a "skip ad button".

I don't want to dive too much into the details now.

If you want more details, please look at the **default videoplayer** events interaction map, somewhere else in this documentation.




plugin.debughelper
-----------------------

If you are creating plugins, then this plugin might be handy.
It detects when events are fired and/or listened to, and console.log them (by default).

You can also black list some events (for instance the repetitive timeupdate or progress events).


Speaking of tools, I would also like to mention the [video events watcher script](https://github.com/lingtalfi/jVideoPlayer/blob/master/www/libs/jvideoplayer/js/util/video-events-watcher.js),
which tells you whant events are fired by an html5 video tag. 

This can be useful if you want to spot behaviour differences between different browsers, for instance.



plugin.cue
----------------

Subtitles are sometimes required.

If that's one of your requirement, then the good news is that the plugin.cue plugin can help you.

Like the plugin.ad plugin, it uses the **default videoplayer**'s layer system.

In fact, it creates a layer with z-index 40 (the highest z-index of all **default videoplayer** built-in plugins as of today),
so that the subtitles appear on top of the main video and/or ad video.


You just need to feed the plugin with subtitles events.

If you use an .srt file, there is a cool php library that can help you (used in the README examples): https://github.com/lingtalfi/VideoSubtitles

A subtitle event has the following properties:

- start: the time after which the subtitle should be displayed (in milliseconds)
- duration: the duration after which the subtitle should be removed (expressed in milliseconds)
- text: the text to display, accepts html 




plugin.inactivity
----------------


The goal of this plugin is to put the gui to sleep after x seconds of user's inactivity.

Visually, the gui going to sleep means that the remote (mantis remote) and other controls (if any) disappear.


In order to fulfill its goal, the inactivity plugin sends inactivityOff and inactivityOn events,
so that elements can respond to them.


Also, by default it toggles the inactivity css class on and off the gui's container element (also called host or surface).
 
Therefore, as a plugin developer, if you want to react to the gui's inactivity plugin events, you can do it via css, 
or programmatically.


Built-in plugins are aware of the inactivity plugin already, so if you plug in the inactivity plugin,
the controls (mantis remote) and the backToApp button (if you use plugin.mantis.backtoapp plugin) will react 
to the gui's inactivity.




Mantis plugins
===================

The following plugins are NOT **default videoplayer** plugins, but rather mantis plugins.

A mantis plugin is almost like a **default videoplayer**, but its prepare method receives a second argument: the mantis api.



plugin.mantis.thumbnailpreview
-----------------------------------

This was my first attempt to create a thumbnail preview, while the user was scrubbing the timeline.

The idea was to create static screen shots of the video every x seconds, and request them as the user scrubs the timeline.

To create the snapshots, we can use a tool like ffmpeg.

In bash, this command will generate a screenshot every 3 seconds for a video named panda.mp4:

```bash
ffmpeg -i panda.mp4 -r .33 screenshots/img_%03d.png
```

See my [ffmpeg notes](https://github.com/lingtalfi/ffmpeg-notes/blob/master/ffmpeg.md#video-snapshots) for more details about the ffmpeg command.


This plugin worked, but the preview was not very accurate: when I clicked on the timeline, the preview was not always showing the same image than
the one played. 

The best (accurate) results I had were obtained when I used an interval of 1 snapshot per second, and some few other settings that the plugin offers.
 
 
Although somehow accurate, I found this method costly.
To give you an idea, I converted a 630.3Mo video into png screenshots, 1 per second, and ended up with 3.72 Go of screenshots.

Plus, it took a few minutes (3-5 minutes) to generate those thumbnails using the ffmpeg command shown above.

That's why I don't personally use this plugin, but rather its alternative: the plugin.mantis.clonethumbnailpreview plugin. 



plugin.mantis.clonethumbnailpreview
-----------------------------------------

Unsatisfied with the costs of the plugin.mantis.thumbnailpreview, I created this plugin.
 
The approach is different: a video tag, clone of the current video, is injected inside the preview markup (once per video).

Then, the current time of the video is updated as the user scrubs the timeline.

This is drastically better:

- first: we have no cost server side, saving space and time 
- then, this method is more accurate (from my tests) 


So, I definitely go with this plugin to generate my thumbnail previews.



plugin.mantis.timelinemark
-------------------------------

The ad.plugin plugin is cool, but I wanted to actually SEE WHERE the ad would be playing: I wanted a visual mark on the timeline.

The timeline mark plugin can add any mark on the timeline. 

This means we can use it to display ad marks of course, but also for other things if necessary.




plugin.mantis.timeelapsed
-------------------------------

This plugin shows the elapsed time on the right of the timeline.



plugin.mantis.backtoapp
-------------------------------

This plugin displays a back to application button.
Actually, you can set the link to whatever you wish.














