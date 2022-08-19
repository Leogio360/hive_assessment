const constants = require('../utils/constants');
const analyticsService = require('../services/analytics');
const playbackModel = require('../models/playbackModel');
const bufferingEventModel = require('../models/bufferingEventModel');
const bitrateSwitchEventModel = require('../models/bitrateSwitchEventModel');

// Collect and process analytics data obtained by client
exports.collect = (request, response) => {
    let playback = null
    let trigger = request?.body?.trigger
    const processedAnalytics = {
        bufferingEvents: [],
        bitrateSwitchEvents: [],
        clientAnalytics: request?.body?.data
    }
    console.log('TRIGGER', trigger)

    return playbackModel.insertPlayback([ request?.body?.visitorId, request?.body?.data?.source, JSON.stringify(request?.body?.data) ])
    .then((res) => {
        return playbackModel.getPlayback([ request?.body?.visitorId, request?.body?.data?.source ])
        .then((res) => {
            playback = res
            return playback
        })
    })
    .then(res => {
        if(playback) {
            if(trigger === constants.TRIGGERS.END_BUFFERING) {
                return bufferingEventModel.insertBufferingEvent([ playback.id, request?.body?.data?.lastWaitingTime])
            }
            if(trigger === constants.TRIGGERS.BITRATE_SWITCH) {
                return bitrateSwitchEventModel.insertBitrateSwitchEvent([ playback.id])
            }
        }
    })
    .then(res => {
         return bufferingEventModel.getBufferingEventsByPlaybackId([ playback.id, 30, 500])
        .then(res => {
            processedAnalytics.bufferingEvents = res
        })
    })
    .then(res => {
        return bitrateSwitchEventModel.getBitrateSwitchEventsByPlaybackId([ playback.id, 10])
        .then(res => {
            processedAnalytics.bitrateSwitchEvents = res
        })
    })
    .then(res => {
        return response.send(analyticsService.buildCollectResponseObject(processedAnalytics))
    })
    .catch((error) => {
        console.error(error)
        return response.send({ status: constants.STATUS.ERROR })
    })
};