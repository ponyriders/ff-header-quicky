What the fuck?
--------------
Gives you a popup where you can choose the value for a given HTTP Header. You
can define a Domains, Name of HTTP Header, and a set of values in the Firefox
addon options.

Why the fuck?
-------------
There was this authentication reverse proxy in front of my web application that
set an HTTP-Header a username. My app authenticates the request based on this
header value only. For development my browser set this extra header. I need to
quickly switch between a set of accounts. No existing plugin got this done with
less than 5 mouse clicks.

It's damn ugly!
---------------
I know, it was done to work. Not to be stylish. Send a pull request!

Static number of options?
-------------------------
It's build using Firefox's *simple-prefs* API. As this API is limited and i'm
way to lazy to build a gui to define a dynamic number of options - Send a pull
request!