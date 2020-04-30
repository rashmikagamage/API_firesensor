const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const Sensors = require("../models/sensors"); // get the sensor model
const RoomDetails = require("../models/roomDetails"); // get the roomdetails model

// create the endpoint(URL) for add sensor to the mongodb database

router.post("/addSensor", async (req, res, next) => {
    // pass a asynchronous function

    let {active, floorNo, roomNo, smokeLevel, co2Level} = req.body; // extract the request body data to variables(ES6)

    let count = floorNo + roomNo; // create an id for the sensor

    let data = {
        // store body request data into data variable and set id to the count value

        id: count,
        active: active,
        floorNo: floorNo,
        roomNo: roomNo,
        smokeLevel: smokeLevel,
        co2Level: co2Level,
    };

    console.log("data", data);

    try {
        const response = await Sensors.create(data); // call the mongodb create method  and wait for  the completion

        res.send(
            JSON.stringify({success: "sensor added", code: "reg", sensor: response})
        ); // send response to user
    } catch (e) {
        console.log(e); // handle errors
    }
});

// create the endpoint(URL) for update sensor details

router.patch("/updateSensor/:id", async (req, res, next) => {

    // pass a id as the request param
    const newId = req.body.floorNo + req.body.roomNo; // change id of the sensor

    try {
        const updatedSensor = await Sensors.updateOne(
            //  finds the first document that matches the filter and applies the specified update modifications.
            {id: req.params.id}, // checks the id of the sensor
            {
                $set: {
                    // set values in the sensor using request body
                    id: newId,
                    active: req.body.active,
                    floorNo: req.body.floorNo,
                    roomNo: req.body.roomNo,
                    smokeLevel: req.body.smokeLevel,
                    co2Level: req.body.co2Level,
                },
            }
        );

        res.json(updatedSensor); // send the json response
    } catch (e) {
        console.log(e); // handle errors
    }
});

// create the endpoint(URL) for update only smoke level and co2 level

router.post("/updateSensorOnlyLevels/:id", async (req, res, next) => {
    console.log("body", req.body);
    try {
        const find = await Sensors.findOne({id: req.params.id}).then((sensor) => {
            if (sensor.active) {

                // only active sensors will update
                const updatedSensor = Sensors.updateOne(
                    {id: req.params.id}, 	// querying and find the correct sensor
                    {
                        $set: {
                            smokeLevel: req.body.smokeLevel,
                            co2Level: req.body.co2Level,
                        }, // update the both levels
                    }
                ).then(() => {
                    res.send(
                        JSON.stringify({
                            err: "sensor updated",
                            code: " updated",
                        })
                    ); // send response to user
                });

                //res.json(updatedSensor); // reponse send as json object
            } else {
                res.send(
                    JSON.stringify({
                        err: "sensor NOT updated",

                        sensor: sensor,
                    })
                ); // send response to user
            }
        });
    } catch (e) {
        console.log(e);
    }
});

// create the endpoint(URL) for delete a sensor

router.delete("/deleteSensor/:id", async (req, res, next) => {
    try {
        const response = await Sensors.deleteOne({id: req.params.id}); // Remove a single document from the collection based on a query filter.

        res.json(response); // send a json response
    } catch (e) {
        console.log(e); // handle errors
    }
});

// create the endpoint(URL) for get all sensor details
router.get("/getAllSensors", async (req, res, next) => {
    try {
        const response = await Sensors.find(); // find all sensors in the db and wait for the response

        // send a json response
        res.json(response);
    } catch (e) {
        console.log(e);
    }
});

// create the endpoint(URL) for add room details

router.post("/addRoomDetails", async (req, res, next) => {
    let {floorNo, roomNo, customerPhone, customerMail} = req.body; // extract the request body data to variables(ES6)

    let count = floorNo + roomNo; // create an id for the room

    console.log("count", count);

    let data = {
        // store body request data into data variable and set id to the count value
        id: count,
        floorNo: floorNo,
        roomNo: roomNo,
        customerPhone: customerPhone,
        customerMail: customerMail,
    };

    console.log("data", data);

    try {
        const response = await RoomDetails.create(data); // create a new room in db

        res.send(
            JSON.stringify({success: "sensor added", code: "reg", room: response})
        ); // send json response
    } catch (e) {
        console.log(e);
    }
});

// create the endpoint(URL) for get room details according to id of the room

router.get("/getRoomDetails/:id", async (req, res, next) => {
    try {
        const response = await RoomDetails.findOne({id: req.params.id});

        /*
        find the room detials for given id and store it in the response variable
        */

        res.json(response); // send the json response
    } catch (e) {
        console.log(e);
    }
});

// create the endpoint(URL) for get sensor details according to id of the room

router.get("/getSensor/:id", async (req, res, next) => {
    console.log(req.body);
    console.log(res.body);
    try {
        const response = await Sensors.findOne({id: req.params.id});

        /*
        find the sensor detials for given id and store it in the response variable
        */

        res.json(response); // send sensor details as json
    } catch (e) {
        console.log(e); // handle errors
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create the endpoint(URL) for send emails for send alert messages when sensor levels up

router.post("/sendEmail", async (req, res, next) => {
    const receiverEmail = req.body.receiverEmail; // get the reciver email address from body of the  request
    const senderMail = "rashmikammg@gmail.com"; // set emailmaddress of sender
    const password = "Rashmika@123"; // set password of sender

    // allow less secure feature on in chrome
    // link - https://myaccount.google.com/lesssecureapps
    // use node mailer module for send mails
    try {
        /*
         create reusable transporter object using the default SMTP transport
        */
        let transporter = nodemailer.createTransport({
            service: "gmail", // use gmail as the email service
            port: 25, // port number
            secure: false, // true for 465, false for other ports
            auth: {
                user: senderMail,
                pass: password,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        let HelperOptions = {
            from: senderMail, // sender address
            to: receiverEmail, // list of receivers
            subject: "Warning Message", // Subject line
            text: "", // plain text body
            html: ` 
<h3>Fire Alert!!!</h3>
<p>${req.body.location} is on Fire!!!</p>
`,
        };

        // HTML version of the message
        transporter.sendMail(HelperOptions, (error, info) => {
            // send mail with defined transport object
            if (error) {
                return console.log(error);
            }
            console.log("The message was sent!");

            console.log(info);

            res.json(info); // send the json response
        });
    } catch (e) {
        console.log(e);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*create the endpoint(URL) for send sms for specified user/*

router.post("/sendSMS", async (req, res, next) => {
    /*
        for sending sms , use TeleSignSdk package (module) and use its trial account
    */

    const receiverPhoneNo = req.body.phoneNo; // get the reciever's phone no in request body to a variav

    try {
        const customerId = "67D18FB0-CB55-4314-89AE-6B5493C10B65";
        const apiKey =
            "jhskmQo+4k9Y1BQpUARdzftA8prXNDMzwXMdFMNRFFdKGbB11zP+6u172GEeyrmj3azqCoTDau/N9q98LK1TSw==";

        /*
        customerID and APIKEYS are auto generated by telesign website - credentials to use this service
        (authentication details)
    */

        const rest_endpoint = "https://rest-api.telesign.com";
        const timeout = 10 * 1000; // 10 secs

        const client = new TeleSignSDK(
            customerId, // create a object with these properties
            apiKey,
            rest_endpoint,
            timeout // optional
            // userAgent
        );

        const message = "SENSOR WARNING MESSAGE ------ TAKE A ACTION SOON "; // message
        const messageType = "ARN"; // ARN = Alerts, Reminders, and Notifications; OTP = One time password; MKT = Marketing

        console.log("## MessagingClient.message ##");

        function messageCallback(error, responseBody) {
            /*
        this callback  function  executed after clinet.sms.message() function has finished executing
        */

            if (error === null) {
                // check message sent successfully
                console.log(
                    `Messaging response for messaging phone number: ${receiverPhoneNo}` +
                    ` => code: ${responseBody["status"]["code"]}` +
                    `, description: ${responseBody["status"]["description"]}`
                );

                res.json("send sms successfully"); // send json response
            } else {
                console.error("Unable to send message. " + error); // log the errors
            }
        }

        client.sms.message(messageCallback, receiverPhoneNo, message, messageType);
        /*
    call the sms.message() method in TeleSignSDK client object with a callback
    send message to given user phone no
    */
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;


module.exports = router; // exports the module
