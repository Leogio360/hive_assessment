(function () {
    amp.plugin('telemetry', function (options) {

        // Player instance
        var player = this

        // QoE service constants
        var QOE_URL = 'http://localhost:3000'
        var QOE_ROUTES = {
            COLLECT: QOE_URL + '/collect'
        }

        // Triggers
        var TRIGGERS = {
            SCHEDULE: 'SCHEDULE',
            LOAD: 'LOAD',
            START_BUFFERING: 'START_BUFFERING',
            END_BUFFERING: 'END_BUFFERING',
            BITRATE_SWITCH: 'BITRATE_SWITCH'
        }

        // Status variables
        var bufferTimer
        var isWaiting = false

        // Analytics data blueprint
        var analyticsData = {
            source: null,
            frameSize: {},
            availableBitrates: [],
            bitrateSwitches: 0,
            bufferingEvents: 0,
            totalBufferingTime: 0,
            lastWaitingTime: 0,
            currentBitrate: undefined
        }

        // Init function
        var init = function () {
            console.log("plugin telemetry initialized with player ", player)
            player.addEventListener('loadedmetadata', onLoadedMetaData)
            player.addEventListener('playbackbitratechanged', onPlaybackBitrateChanged)
            player.addEventListener('waiting', onWaiting)
            setInterval(collectAnalytics, 10000);
        }

        // Events Handlers
        var onLoadedMetaData = function (event) {
            console.log('event', event)
            // Handler function for loadedmetadata event
            analyticsData.availableBitrates = getAvailableVideoBitrates(player)
            collectAnalytics(TRIGGERS.LOAD)
        }

        var onPlaybackBitrateChanged = function (event) {
            // Handler function for playbackbitratechanged event. 
            analyticsData.bitrateSwitches = sumOrDefault(analyticsData.bitrateSwitches)
            collectAnalytics(TRIGGERS.BITRATE_SWITCH)
        }

        var onWaiting = function (event) {
            // Handler function for playbackbitratechanged event. 
            if (!isWaiting) {
                // If it's not in waiting state, start the buffer timer, increase the number of buffering events and add the resume listener
                isWaiting = true
                resetLastWaitingTime()
                bufferTimer = setInterval(timer, 100);
                player.addEventListener('resume', onResumeAfterWaiting)
                analyticsData.bufferingEvents = sumOrDefault(analyticsData.bufferingEvents)
                collectAnalytics(TRIGGERS.START_BUFFERING)
            } else {
                console.log('Already in waiting state')
            }
        }

        var onResumeAfterWaiting = function (event) {
            // Handler function for resume event after a waiting event. 
            isWaiting = false
            analyticsData.totalBufferingTime = sumOrDefault(analyticsData.totalBufferingTime, analyticsData.lastWaitingTime, analyticsData.lastWaitingTime)
            clearInterval(bufferTimer)
            player.removeEventListener('resume', onResumeAfterWaiting)
            collectAnalytics(TRIGGERS.END_BUFFERING)
        }

        // Helpers
        var collectAnalytics = function (trigger = TRIGGERS.SCHEDULE) {

            analyticsData.frameSize = getFrameSize(player)
            analyticsData.currentBitrate = player.currentPlaybackBitrate()
            analyticsData.source = player.currentSrc()

            // Get the visitor identifier from fingerprintJS.
            return fpPromise
            .then(function (fp) {
                return fp.get()
            })
            .then(function (result){
                // This is the visitor identifier:
                var visitorId = result.visitorId

                // Send the analytics data to the QoE services
                var reqBody = {
                    visitorId,
                    trigger,
                    data: analyticsData
                }
                return fetch(QOE_ROUTES.COLLECT, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reqBody)
                })
            })
            .then(function (response) {
                return response.json()
            })
            .catch(function (error) {
                console.log(error)
            })
        }

        var getFrameSize = function (player) {
            // Get the current player height and width.
            return {
                height: player.height(),
                width: player.width()
            }
        }

        var getAvailableVideoBitrates = function (player) {
            // Get the current available video bitrates.
            var bitrates = {}
            if(player.currentVideoStreamList() && player.currentVideoStreamList().streams && player.currentVideoStreamList().streams[0] && Array.isArray(player.currentVideoStreamList().streams[0].tracks)){
                player.currentVideoStreamList().streams[0].tracks.forEach(
                    function (track) {
                        bitrates[track.bitrate] = {
                            height: track.height,
                            width: track.width
                        }
                    }
                ) 
            }
            return bitrates
        }

        var resetLastWaitingTime = function () {
            // Reset the waiting time
            analyticsData.lastWaitingTime = 0
        }

        var timer = function () {
            // Increase the current waiting time
            analyticsData.lastWaitingTime = sumOrDefault(analyticsData.lastWaitingTime, 100)
        }

        var isNumber = function (value) {
            // Check if value is a number
            return typeof value === 'number'
        }

        var sumOrDefault = function (value, unit = 1, defaultValue = 0) {
            // Check if value is a number, then return value + unit. If value is not a number return the default value
            return isNumber(value) && isNumber(unit) ? (value + unit) : defaultValue
        }

        // initialize the plugin
        init();
    });
}).call(this);