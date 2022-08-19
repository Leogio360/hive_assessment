const constants = require('../../utils/constants');

const buildCollectResponseObject = (playbackData) => {
    const { bufferingEvents, bitrateSwitchEvents, clientAnalytics } = playbackData
    const warnings = []
    const currentFrameSize = clientAnalytics?.frameSize
    const recommendedBitrateFrameSize = clientAnalytics?.availableBitrates[clientAnalytics?.currentBitrate]

    if( bufferingEvents.length > constants.THRESHOLDS.SHORT_BUFFERING_EVENT_COUNT || 
        bufferingEvents.filter(event => event.buffering_time > constants.THRESHOLDS.LONG_BUFFERING_EVENT_TIME).length > constants.THRESHOLDS.LONG_BUFFERING_EVENT_COUNT
    ) {
        warnings.push(constants.QOE_INDEXES.TOO_MANY_BUFFERING)
    }

    if(bitrateSwitchEvents.length > constants.THRESHOLDS.BITRATE_SWITCH_COUNT) {
        warnings.push(constants.QOE_INDEXES.TOO_MANY_BITRATE_SWITCHES)
    }

    if(currentFrameSize?.width > recommendedBitrateFrameSize?.width || currentFrameSize?.height > recommendedBitrateFrameSize?.height) {
        warnings.push(constants.QOE_INDEXES.HIGHEST_BITRATE_POSSIBLE)
    }
    
    const hasWarnings = warnings.length

    return {
        status: hasWarnings ? constants.STATUS.WARNING : constants.STATUS.OK,
        ...(hasWarnings && { warnings }),
    }
};

module.exports = {
    buildCollectResponseObject
};