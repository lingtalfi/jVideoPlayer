Mantis
==========
2016-03-21




In the jvideoplayer ecosystem, mantis is a remote.
 
By remote, I mean:
 
- the design of the remote 
- the remote api
 
 



the design of the remote: Mantis skin 
--------------

The design of the remote is defined by a bunch of files located here: [/libs/jvideoplayer/widget/remote/mantis](https://github.com/lingtalfi/jVideoPlayer/blob/master/www/libs/jvideoplayer/widget/remote/mantis).



If you are interested in playing with just the skin (no interaction with the videoplayer),
here is the demo file for you: [ mantis skin only ](https://github.com/lingtalfi/jVideoPlayer/blob/master/www/libs/jvideoplayer/prototype/widget/remote/mantis/mantis-skin-only.php).

Note that in order to make this demo work, you will need to resolve mantis's dependencies:

- [jquery](https://jquery.com/) 2.1.4 was used for the demo
- [dragslider](https://github.com/lingtalfi/jDragSlider)
- [vswitch](https://github.com/lingtalfi/VSwitch)


Jquery is used to ease dom manipulation.

Dragslider is used to ease implementation of drag behaviour.

Vswitch is used to ease change of states (for instance the play button becomes the pause button when clicked).




TODO: put a codepen here...




the remote api
------------------


mantis has its own api, which is located here: [/libs/jvideoplayer/widget/remote/mantis/mantis.js](https://github.com/lingtalfi/jVideoPlayer/blob/master/www/libs/jvideoplayer/widget/remote/mantis/mantis.js).



This api allows you to do two main things:

- manipulate the mantis remote widget (like set the volume slider to a certain level)
- listen to mantis events (for instance when you click he play button of the remote, it triggers a play event)




### The mantis widget

Let's have a look at what mantis let you manipulate.

First, let's look at the anatomy of the widget.


![mantis widget](http://s19.postimg.org/r1pmhr5nn/mantis_skin.jpg)


There are buttons, sliders, and panes.

Buttons:

- play
- pause
- fullscreen
- volume toggle (between mute and not mute state)


Sliders:

- volume slider 
- timeline slider
 
 
Panes:

- text info box, at the right of the timeline 
- bubble pane, pops from behind the remote widget, and goes above the timeline when we call it
- thumbnail preview: above the timeline
 
 
 
 


### The mantis api


Let's now look at the mantis api.
We can distinguish mantis methods into two categories:

- those who control the mantis widget (those methods have a visual impact on the mantis skin)
- the utility methods





#### Controlling the mantis widget methods

Those methods control the look of the mantis widget.


- play ( triggerEvent ): when you click the play button, it turns into the pause button.
                            By default, this method will also trigger the play event (see events section below for more details),
                            unless you set the triggerEvent flag to false.
                            
- pause ( triggerEvent ): when you click the pause button, it turns into the play (resume) button.
                            By default, this method will also trigger the pause event (see events section below for more details),
                            unless you set the triggerEvent flag to false.
                    
               
- setBufferedRanges ( bufferedRanges ): create a line representing the buffered ranges of the video.
                                        It's useful for the user as she gets a sense of what parts of the video are already downloaded. 

- setPlayHeadPositionByTime ( t, alsoMovePreview ): set the handle of the timeline slider at the given time (in seconds).

                        By default, this will also move the preview thumbnail, unless you set the alsoMovePreview flag to false.
                        The original reason for this flag is pragmatic: it allowed me to separate the fact that the user
                        could preview the video by hovering the timeline, and yet having the natural handle of the timeline
                        slider updated while the video was playing at the same time.

- setVolume ( t ): set the volume slider's handle to a certain level (see mantis skin image)
- setTitle ( t ): set the title (see mantis skin image)
- setInfoBoxText ( t ): set the text in the text info box (see mantis skin image)
- openVolumePanel ( ): open the panel which contains the volume slider (see mantis skin image)
- closeVolumePanel ( ): close the panel which contains the volume slider (see mantis skin image)
- setBubbleContent ( content ): set the content of the bubble (see mantis skin image)
- showBubble ( ): show the bubble (see mantis skin image)
- hideBubble ( ): hide the bubble (see mantis skin image)
- enterFullscreen ( ): trigger the enterfullscreen event, and update the fullscreen icon so that it represents the exit fullscreen icon.    
- exitFullscreen ( ): trigger the exitfullscreen event, and update the fullscreen icon so that it represents the enter fullscreen icon.
- toggleVolume ( ): toggle the volume button between the mute state and the non muted state
- isHoverMode ( ): returns whether or not the user is hovering the timeline, but not dragging its handle
- isPlayHeadDragging ( ): returns whether or not the user is dragging the timeline's handle
 
 
 
 
 #### Utility methods
 
 
 
 - setDuration ( d ): if you have to remember only one method of the mantis api, that should be the one.
 
                             Mantis api requires the duration to be set before you actually start to use the api.                            
                             The duration is the duration of the current video and is expressed in seconds.
                             
 - attachPlugin ( p ): mantis uses its own plugin system. This is the method to attach plugins to the mantis api.
 - on ( eventName, fn ): if you don't want to create a mantis plugin, you can still listen to the mantis events, which are 
                             explained later on this page.
 

- getSurface ( ): returns a jquery object representing the surface.
                    The surface is the html element representing the container which contains the mantis remote.
                    It turns out that in the **default videoplayer** implementation, the surface also contains 
                    the videoplayer.
                    
                    In other words, in the **default videoplayer** implementation, the surface represents the 
                    container that contains every element of the jvideoplayer ecosystem. 
 

 
 
 
 
 
 
Mantis events
-------------------- 

Mantis by itself is just a static html widget that triggers some events.
Although you can use its api to control the appearance of the widget, at some point you will want other elements
to react to the mantis controls.

Typically, when the user clicks the play button of the mantis remote, you want the videoplayer to play.

Well, that's something that needs to be implemented separately, and this is done through events.


### Triggered events

Here is the list of events triggered by mantis, that you can hook using the on method:


- play: fired when the user clicks the play button
- pause: fired when the user clicks the pause button
- volumedrag: fired when the setVolume method is used (the toggleVolume method internally also uses the setVolume method)
- enterfullscreen: fired when the enterFullscreen method is used
- exitfullscreen: fired when the exitFullscreen method is used
- timelinedrag: fired while the user is dragging the timeline's handle
- timelineupdated: fired when the user releases the mouse button after dragging the timeline's handle
- timelinehover: fired while the user hovers the timeline, but is not dragging its handle


That's it. Mantis doesn't listen to events.




