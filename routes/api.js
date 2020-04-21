const express = require('express');
const router = express.Router();

const Sensors = require('../models/sensors');
const RoomDetails = require('../models/roomDetails');


router.post('/addSensor',async (req,res,next)=>{

console.log(req.body);

let {active,floorNo,roomNo,smokeLevel,co2Level} = req.body;

 let count = (floorNo + roomNo);

 let data = {
    id :count,
    active:active ,
    floorNo :floorNo ,
    roomNo : roomNo,
    smokeLevel :smokeLevel,
    co2Level : co2Level
};
  
console.log('data',data);
  

  try{
    const response = await Sensors.create(data);

  res.send(JSON.stringify({success:"sensor added" , code : 'reg', sensor : response} ));
  }
  catch(e){
    console.log(e);
  }

});


router.patch('/updateSensor/:id',async (req,res,next)=>{

  console.log(req.body);

 try{
   
  const updatedSensor = await Sensors.updateOne(
{"id" :req.params.id},
  {
    $set: {"active":req.body.active,"floorNo" :req.body.floorNo,
  
    "roomNo" : req.body.roomNo,"smokeLevel":req.body.smokeLevel,"co2Level":req.body.co2Level}
  }

);

   res.json(updatedSensor);


    
  }
  catch(e){
    console.log(e);
  }

});

router.delete('/deleteSensor/:id',async (req,res,next)=>{

try{

  const response = Sensors.deleteOne({"id" : req.params.id });

  res.json(response);

}
catch(e){
  console.log(e);
}

});

router.get('/getAllSensors',async (req,res,next)=>{

  try{
  
    const response = await Sensors.find();
  
    res.json(response);
  
  }
  catch(e){
    console.log(e);
  }
  
  });
  

  router.post('/addRoomDetails',async (req,res,next)=>{


  let {floorNo,roomNo,customerPhone,customerMail} = req.body;
  
   let count = (floorNo + roomNo);
  
    console.log('count',count);
  
    let data = {
      id :count,
      floorNo :floorNo ,
      roomNo : roomNo,
      customerPhone :customerPhone,
      customerMail : customerMail
  };
    
  console.log('data',data);
    
  
    try{
      const response = await RoomDetails.create(data);
  
  
      res.send(JSON.stringify({success:"sensor added" , code : 'reg', room : response} ));
    }
    catch(e){
      console.log(e);
    }
  
  });

router.get('/getRoomDetails/:id',async (req,res,next)=>{

    try{
    
      const response = await RoomDetails.findOne({"id" : req.params.id});
    
      res.json(response);
    
    }
    catch(e){
      console.log(e);
    }
    
    });

module.exports = router;

