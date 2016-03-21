The overview
=================
2016-03-05
2016-03-09



What I'm trying to do here is 3 objects:

- a video player api
- a (video player) skin api
- a bindure (bridge) between both the player and the skin


Those objects have interface, so that we can create many different implementations of them.


Video player api
-------------------

- play
- pause
- setCurrentTime t
- t getCurrentTime

- setVolume v 
- v getVolume
 
- d getDuration
- b getBufferedRanges  ( b is an array or ranges, each range being an array with two values: start time of the buffered range, and end time )

- onReady ( fn )    triggered when the video can play (i.e. the duration is ready in traditional html5 video)
- onEnd ( fn )





Skin api
------------

Not all skins will have all capabilities, this is just a theoretical interface, with the maximum functionalities.
Note: the bridge is responsible to match a video player api with an actual skin api (i.e. the bridge knows the details of the skin instance).
        
        
(@smart/logic)        
- setDuration t   
        
(@dumb/visual)        

- setTitle t
- setPlayHeadPositionByTime t
- setInfoBoxText t
- setVolume v
- setBufferedRanges b  (b is the same as videoPlayerApi.getBufferedRanges's argument)
- setPreviewInfo (u, t)     set the url and time to display on the thumbnail preview

- attachPlugin ( p )   attach a plugin's event listeners (for now we just need the listeners, we don't care of the plugin object) to the skin (see skin plugin api)
- on ( str:eventId, fn )
        
        The function fn, when triggered can be passed arguments, depending on the event triggered.
        This is specific to the implementation.






Skin plugin api
-------------------

- void  init
  
    This method is the opportunity for a plugin to bind all the necessary events to the 
    skin api, using the on method.
    Also, plugin init themselves if necessary.
    



Mantis skin events
-----------------------

Mantis allows plugins to hook via the following events (using the "on" method):


- timelinehover  (p): triggered while the time line is hovered
- timelineupdated (p): triggered when the mouse up event is detected on the timeline.
                    So, when the user finishes scrubbing the timeline,
                    or when she clicks on it at a specific point.
- timelinedrag (p): triggered while the time line scrubber/handle is being dragged
- play (): triggered when the play button is clicked
- pause (): triggered when the pause button is clicked
- volumedrag (p): triggered when the volume scrubber is dragged




Other api
----------------

Those are more related to the gui environment.

- fullscreen
- show 
- hide
- the "go back to previous" button plugin
- "the show description text if too much inactivity" plugin









About thumbnail preview generation
-------------------------------------
2016-03-07
2016-03-10


As with everything, there are different ways to implement thumbnail previews.
The way I chose is through a mantis "video preview plugin".


### Mantis video preview plugin

This plugins goal is to display thumbnails previews of the video when the user hovers the timeline of 
the mantis player.
This particular plugin uses conventions to achieve its goal.

First, you create the thumbnails server side.

With ffmpeg, this is a one liner:

```bash
# this generates a screenshot every 3 seconds
ffmpeg -i bunny.mp4 -r .33 screenshots/bunny_%03d.png
```

Then, you tell the plugin what's the time interval between two screenshots (3s in the above example).
With this plugin, it has to be a constant time interval.

Finally, you indicate the plugin where to find those screenshots.

That's it.



Stream box
===============
2016-03-12


- start
- stop
- setEvents ( array:events )
- on ( str:eventId, fn )
- pause ( )
- resume ( )
- setTime ( number:t )


A streambox (or stream machine) is an object that takes a stream of events,
and ensures that events are triggered at the RIGHT time.



An event is a tiny object with some mandatory properties:

- type: string, the type of event (video, ad, caption, ...) 
- time: number, the time at which the event should start, relative to the current time of the stream box 
- duration: number, the number of seconds that the event should last

And some optional properties, depending of the type.

In this document, we only discuss events of type video, ad and captions, but there could be more.


Events
--------

The stream box doesn't know how to handle an event, but it knows WHEN to fire it.
When that moment occurs, the streambox notifies the "eventpop" event to any listener.

There is also an "eventprepare" event, that is triggered 30s (by default, and in theory) before 
the event fires.
Now this theoretical 30s interval is sometimes squeezed down, due to the fact that the user can
change the time arbitrarily, and therefore move the current time to a point where an event has to fire
in only 5 seconds (for instance).
The "eventprepare" event allows listeners to preload a video, for instance, as to ensure a transition
between two videos without interrupt.

The events fired by the stream box are the following:

- play (whenever the play method is called)
- stop (whenever the stop method is called)
- pause (whenever the pause method is called)
- resume (whenever the resume method is called)
- ?timechanged (whenever the setTime method is called)
- ?timeupdate (sync to the internal timeout engine of the stream box, so that one can limit the numbers of costly setTimeout in a stream box application)
- eventprepare, triggered 30s (by default) before the event is actually fired
- eventpop, triggered when the event item should fire, as defined by its time property



Time
-------------

A stream box can be seen as a machine that controls the time.
The time property of every individual event item and the current time of the stream box 
are consistent, they use the same scale.

The time scale that you use depends on your needs.

Imagine that you want to implement a "replay mode", where the user watches one video of 10 minutes, with 
one ad starting 65 seconds after the beginning of the video.
In that case, it makes sense to use a scale that starts at 0, and use an "ad event" which starts at 65.
This use case is referred to as the finite timeline.


There is another scenario where you have a semi-finite timeline.
Imagine a live programmation, like a real tv.
At some point in the future, the programmation is not yet defined, and the events stream is updated dynamically.
In that case, one could use the timestamp values for instance, to mark our 
events (and the current time of the stream box accordingly).

So, really it depends on what you want to do; you can pretty much do anything as long as the current time of the stream box
and the events time are consistent.



How methods work together
-------------------------

Start and stop work together, and pause/resume work together.

The stream box initialization synopsis would be that you first set the events.
Then you set the stream box time.
Then you start the stream box.
When you are finish, you stop the stream box.

While it's started, you can use the pause method.
If the stream box is paused, you can use the resume method to resume the processing.

While it's started, you can also jump to another time using the setTime method.
It the stream box is paused when you jump, it will remained paused after the jump.
It it was playing when you jumped, it will resume the playing after the jump.



The _loaded property
--------------------

As I said earlier, there is a default threshold of 30s, below which the stream box triggers the "eventprepare" event 
for a given event item.
Because of the way it's implemented (timers in javascript), to not re-trigger that event every subsequent second until it's fired,
the stream box marks the event as prepared by adding the _loaded=true property to it.

This is not private, it's part of the "official" stream box documentation and you can use it whenever you want.
For instance, if you preload the first video yourself, you can set the _loaded property to the event manually before sending the
events to the stream box, and the stream box will not trigger the "eventprepare" event for that event item.






















































