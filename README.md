# Azure Media Player - Quality of Experience (QoE) detector
## Hive Streaming Assessment

This project contains the client-side and the server-side parts of the Assessment.

For the client-side I downloaded the sample-page provided (note, missing some CSS but the page is fully working) and added the a new AMP plugin to track relevant info. 
The plugin is located in *./client/js/telemetry.js*. The plugin sends a */collect* request when a tracked event is fired or every 10 seconds.
I also used FingerprintJS library in order to be able to have an easy way to detect the requests from the same source.

For the server-side part of the assesment, I created a small service using expressJS and a sqlite database. The code is very basic for the sake of speed.
I defined 3 models:
 - playbacks (identified by a visitor ID and a source) in order to keep track of the data of the different playbacks
 - bufferingEvents in order to keep track of the buffering events tracked for every playback
 - bitrateSwitchEvents in order to keep track of the bitrate switch events tracked for every playback


## Known Possible Improvements
- The service handles a lot of JSON data coming from the client, so sqlite DB can be replaced by a NoSQL DB that can provide better support for this data type
- If two or more player request a playback from the same source and with the same VisitorID (e.g.: same video opened and played in two browser tab), the data processed by the server can be unreliable. To overcome this problem, we can request a playerID to the server to mark each player with a unique string.