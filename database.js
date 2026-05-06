const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./campus_ride.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the campus_ride database.');
});

db.serialize(() => {
    // User table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_driver BOOLEAN NOT NULL DEFAULT 0
    )`);

    // Ride table
    db.run(`CREATE TABLE IF NOT EXISTS rides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        driver_id INTEGER NOT NULL,
        departure_location TEXT NOT NULL,
        destination_location TEXT NOT NULL,
        departure_time DATETIME NOT NULL,
        available_seats INTEGER NOT NULL,
        FOREIGN KEY (driver_id) REFERENCES users (id)
    )`);

    // Booking table
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ride_id INTEGER NOT NULL,
        passenger_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'confirmed',
        FOREIGN KEY (ride_id) REFERENCES rides (id),
        FOREIGN KEY (passenger_id) REFERENCES users (id)
    )`);
});

module.exports = db;
