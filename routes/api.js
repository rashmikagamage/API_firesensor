const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");

const Sensors = require('../models/sensors');
const RoomDetails = require('../models/roomDetails');


router.post('/addSensor', async (req, res, next) => {

    console.log(req.body);
    let {active, floorNo, roomNo, smokeLevel, co2Level} = req.body;
    let count = (floorNo + roomNo);
    let data = {
        id: count,
        active: active,
        floorNo: floorNo,
        roomNo: roomNo,
        smokeLevel: smokeLevel,
        co2Level: co2Level
    };

    console.log('data', data);


    try {
        const response = await Sensors.create(data);
        res.send(JSON.stringify({success: "sensor added", code: 'reg', sensor: response}));
    } catch (e) {
        console.log(e);
    }

});


router.patch('/updateSensor/:id', async (req, res, next) => {

    const newId = req.body.floorNo + req.body.roomNo;
    try {
        const updatedSensor = await Sensors.updateOne(
            {"id": req.params.id},
            {
                $set: {
                    "id" : newId,
                    "active": req.body.active,
                    "floorNo": req.body.floorNo,
                    "roomNo": req.body.roomNo,
                    "smokeLevel": req.body.smokeLevel,
                    "co2Level": req.body.co2Level
                }
            }
        );

        res.json(updatedSensor);

    } catch (e) {
        console.log(e);
    }

});

router.delete('/deleteSensor/:id', async (req, res, next) => {

    try {

        const response = await Sensors.deleteOne({"id": req.params.id});
        res.json(response);

    } catch (e) {
        console.log(e);
    }

});

router.get('/getAllSensors', async (req, res, next) => {

    try {

        const response = await Sensors.find();

        res.json(response);

    } catch (e) {
        console.log(e);
    }

});


router.post('/addRoomDetails', async (req, res, next) => {


    let {floorNo, roomNo, customerPhone, customerMail} = req.body;

    let count = (floorNo + roomNo);

    console.log('count', count);

    let data = {
        id: count,
        floorNo: floorNo,
        roomNo: roomNo,
        customerPhone: customerPhone,
        customerMail: customerMail
    };

    console.log('data', data);


    try {
        const response = await RoomDetails.create(data);


        res.send(JSON.stringify({success: "sensor added", code: 'reg', room: response}));
    } catch (e) {
        console.log(e);
    }

});

router.get('/getRoomDetails/:id', async (req, res, next) => {

    try {

        const response = await RoomDetails.findOne({"id": req.params.id});

        res.json(response);

    } catch (e) {
        console.log(e);
    }

});

router.get('/getSensor/:id', async (req, res, next) => {
    console.log(req.body);
    console.log(res.body);
    try {

        const response = await Sensors.findOne({"id": req.params.id});

        res.json(response);

    } catch (e) {
        console.log(e);
    }

});


router.post('/sendEmail', async (req, res, next) => {

    const receiverEmail = req.body.receiverEmail;
    const senderMail = ''; // add sender email
    const password = ''; // add password

    // allow less secure feature on in chrome
    // link - https://myaccount.google.com/lesssecureapps

    try {


        let transporter = nodemailer.createTransport({
            service: "gmail",
            port: 25,
            secure: false, // true for 465, false for other ports
            auth: {
                user: senderMail,
                pass: password,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let HelperOptions = {
            from: senderMail, // sender address
            to: receiverEmail, // list of receivers
            subject: "Warning Message", // Subject line
            text: "", // plain text body
            html: `
<h3>Sensor Details</h3>
<li>location: ${req.body.location}</li>
<li>CO2 level: ${req.body.co2Level}</li>
<li>H20 level: ${req.body.h2oLevel}</li>
<h3>Message</h3>
<p>${req.body.message}</p>`
        };
        transporter.sendMail(HelperOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log("The message was sent!");
            console.log(info);

            res.json(info);
        });


    } catch (e) {
        console.log(e);
    }


});

module.exports = router;

