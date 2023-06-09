'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { logger } = require('../logger');

module.exports = (db) => { 
    app.get('/health', (req, res) => res.send('Healthy'));

    app.post('/rides', jsonParser, async (req, res) => {
       try {
        const startLatitude = Number(req.body.start_lat);
        const startLongitude = Number(req.body.start_long);
        const endLatitude = Number(req.body.end_lat);
        const endLongitude = Number(req.body.end_long);
        const riderName = req.body.rider_name;
        const driverName = req.body.driver_name;
        const driverVehicle = req.body.driver_vehicle;

        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Driver name must be a non empty string'
            });
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Driver Vehicle must be a non empty string'
            });
        }

        var values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];

        const createdRide = await createRide(db, values)
        const result = await getRidesByID(db, createdRide)
        res.send(result);
       } catch (error) {
        logger(error.message, error)
        const response = {
            error_code: 'SERVER_ERROR',
            message: 'Unknown error'
        }
        return res.send(response)
       }
    });

    app.get('/rides-list', async (req, res) => {
        try {
            const length = req.query.length ? req.query.length : 10 // here getting the length for return the no of rows.
            const start = req.query.page ? (req.query.page - 1) * length : 0 // here getting start for skip the rows
            const result = await getRides(db, length, start)
            res.send(result)
        } catch (error) {
            logger(error.message, error)
            const response = {
                error_code: 'SERVER_ERROR',
                message: 'Unknown error'
            }
            res.send(response)
        }
    });

    app.get('/rides/:id', async(req, res) => {
       try {
        const result = await getRidesByID(db, req.params.id)
        res.send(result)
       } catch (error) {
        logger(error.message, error)
        const response = {
            error_code: 'SERVER_ERROR',
            message: 'Unknown error'
        }
        res.send(response)
       } 
    });

    return app;
};


async function getRides(db, length, start) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM Rides limit ${length} offset ${start}`, function (err, rows) {
            if (err) {
                reject(err)
            }

            if (rows.length === 0) {
                const response = {
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                }
                resolve(response)
            }

            resolve(rows)
        });
    })
}

async function getRidesByID (db, id) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM Rides WHERE rideID='${id}'`, function (err, rows) {
            if (err) {
                reject(err)
            }

            if (rows.length === 0) {
                const response = {
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                }
                resolve(response)
            }

            resolve(rows)
        });
    })
}

async function createRide(db, values) {
    return new Promise((resolve, reject) => {
        const result = db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err, rows) {
            if (err) {
                reject(err)
            }
            resolve(this.lastID)
        });
    })
}