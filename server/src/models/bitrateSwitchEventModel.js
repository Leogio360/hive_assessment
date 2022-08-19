// Load modules
const db = require('../services/db/index');

const tableName = 'bitrate_switch_events'

// Get all bitrate switch events from database
const getBitrateSwitchEvents = () => {
    const query = `SELECT * FROM ${tableName}`;
    return new Promise((resolve, reject) => {
        db.all(query, [], (error, rows) => {
            if (error) {
                console.error(error.message)
                reject(error)
            } else {
                resolve(rows)
            }
        })
    })
};

// Get all bitrate switch events from database given a playback_id in the specified slot of time
const getBitrateSwitchEventsByPlaybackId = (values) => {
    const query = `
        SELECT * FROM ${tableName} 
        WHERE playback_id = ?
        AND ROUND((JULIANDAY(CURRENT_TIMESTAMP) - JULIANDAY(created)) * 86400) < ? 
    `
    return new Promise((resolve, reject) => {
        db.all(query, values, (error, rows) => {
            if (error) {
                console.error(error)
                reject(error)
            } else {
                resolve(rows)
            }
        })
    })
};

// Insert new bitrate switch event
const insertBitrateSwitchEvent = (values) => {
    const query = `
        INSERT INTO ${tableName} (playback_id) VALUES (?)
    `
    return new Promise((resolve, reject) => {
        db.run(query, values, function (error) {
            if (error) {
                console.log(error)
                reject(error)
            }
            resolve(this)
        })
    })
};


module.exports = {
    tableName,
    getBitrateSwitchEvents,
    getBitrateSwitchEventsByPlaybackId,
    insertBitrateSwitchEvent
};