module.exports = Object.freeze({
    CREATE_PLAYBACKS_TABLE: `
        CREATE TABLE IF NOT EXISTS playbacks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            visitor_id text, 
            source text,
            last_analytics_data text,
            created DATETIME DEFAULT CURRENT_TIMESTAMP, 
            updated DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (source, visitor_id)
        )`
    ,
    CREATE_BUFFERING_EVENTS_TABLE: `
        CREATE TABLE IF NOT EXISTS buffering_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            playback_id int, 
            buffering_time int,
            created DATETIME DEFAULT CURRENT_TIMESTAMP, 
            updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    ,
    CREATE_BITRATE_SWITCH_EVENTS_TABLE: `
        CREATE TABLE IF NOT EXISTS bitrate_switch_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            playback_id int, 
            created DATETIME DEFAULT CURRENT_TIMESTAMP, 
            updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    ,
    UPDATE_TRIGGER: `
        CREATE TRIGGER IF NOT EXISTS [UpdateLastTime]  
            AFTER   
            UPDATE  
            ON playbacks
            FOR EACH ROW   
            WHEN NEW.updated <= OLD.updated  
        BEGIN  
            update playbacks set updated=CURRENT_TIMESTAMP where id=OLD.id;  
        END  
    `
});