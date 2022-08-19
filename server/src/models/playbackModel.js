// Load modules
const db = require('../services/db/index');

const tableName = 'playbacks'

// Get all playbacks from database
const getPlaybacks = () => {
    const query = `SELECT * FROM ${tableName}`;
    return new Promise((resolve, reject) => {
        db.all(query, [], (error, rows) => {
            if (error) {
                console.error(error.message)
                reject(error)
            }
            resolve(rows)
        })
    })
}

// Get all playbacks from database
const getPlayback = (values) => {
    const query = `
        SELECT * FROM ${tableName}
        WHERE visitor_id = ?
        AND source = ?
    `;
    return new Promise((resolve, reject) => {
        db.get(query, values, (error, rows) => {
            if (error) {
                console.error(error.message)
                reject(error)
            }
            resolve(rows)
        })
    })
}

// Get all playbacks from database
const insertPlayback = (values) => {
    const query = `
      INSERT INTO ${tableName} (visitor_id, source, last_analytics_data) VALUES (?, ?, ?)
      ON CONFLICT(source, visitor_id) DO UPDATE
      SET visitor_id=excluded.visitor_id, source=excluded.source, last_analytics_data=excluded.last_analytics_data
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
}

// Export models
module.exports = {
    tableName,
    getPlaybacks,
    getPlayback,
    insertPlayback
};