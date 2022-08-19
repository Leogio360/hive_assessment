const sqlite3 = require('sqlite3').verbose()
const queries = require('./queries');

const DBSOURCE = "db.sqlite"

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(
            queries.CREATE_PLAYBACKS_TABLE,
            (err) => {
                if(err) {
                    console.error(err.message)
                }
                db.run(
                    queries.UPDATE_TRIGGER,
                    (err) => {
                        if(err) {
                            console.error(err.message)
                        }
                    }
                );
            }
        );  
        db.run(
            queries.CREATE_BUFFERING_EVENTS_TABLE,
            (err) => {
                if(err) {
                    console.error(err.message)
                }
            }
        );
        db.run(
            queries.CREATE_BITRATE_SWITCH_EVENTS_TABLE,
            (err) => {
                if(err) {
                    console.error(err.message)
                }
            }
        );
    }
});


module.exports = db