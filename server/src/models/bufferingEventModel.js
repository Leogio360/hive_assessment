// Load modules
const db = require('../services/db/index');

const tableName = 'buffering_events'

// Get all buffering events from database
const getBufferingEvents = () => {
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

// Get all buffering events from database given a playback_id in the specified slot of time
const getBufferingEventsByPlaybackId = (values) => {
    const query = `
        SELECT * FROM ${tableName} 
        WHERE playback_id = ?
        AND ROUND((JULIANDAY(CURRENT_TIMESTAMP) - JULIANDAY(created)) * 86400) < ? 
        AND buffering_time >= ?;
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

// Insert new buffering event
const insertBufferingEvent = (values) => {
    const query = `
        INSERT INTO ${tableName} (playback_id, buffering_time) VALUES (?, ?)
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
    getBufferingEvents,
    getBufferingEventsByPlaybackId,
    insertBufferingEvent
};