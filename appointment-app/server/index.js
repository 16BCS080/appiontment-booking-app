const express = require('express');
const app = express();
const cors=require("cors");
var bodyParser = require('body-parser');  
var _=require('lodash');
var html_tablify = require('html-tablify');

const appointmentslots = require("./appointmentslots.json");

var mysql = require('mysql');

var conn = mysql.createConnection({
  host: '127.0.0.1', // Replace with your host name
  user: 'root',      // Replace with your database username
  password: '16bcs080',      // Replace with your database password
  database: 'test' // // Replace with your database Name
});

conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});

module.exports = conn;

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))



app.get('/api', (req, res) =>{ 
    conn.query("SELECT  * , concat(`user_first_name`,`user_last_name`) name FROM booking_form", function (err, result) {
        if (err) throw err;
         res.send(result);
    }); 

    //res.send(result);
});
var slot = '';

app.get('/contactform', (req, res) =>{ 
    conn.query("SELECT  appointment_date , appointment_timing , concat(`user_first_name`,`user_last_name`) name FROM booking_form order by appointment_date", function (err, result) {
        if (err) throw err;
        result.map( function(a){ a.appointment_date = new Date( (a.appointment_date).split("/").reverse().join("-") ) ; })  ; 

        //var result =_.sortBy(result, function(dateObj) {  return dateObj.appointment_timing;    });

        result.map( function(a){ a.appointment_date = JSON.stringify(a.appointment_date).slice(1,11)  ;  
            a.appointment_date =  (a.appointment_date).split("-").reverse().join("/")  ; 
            slot = appointmentslots.find(item => item.id== a.appointment_timing) ;
            a.appointment_timing = slot.startTime +' to ' + slot.endTime ;
        })  ;


        var options = {  data: result,  header: [ 'name' ,  'appointment_timing' , 'appointment_date'] };
        var html_data = html_tablify.tablify(options);

         res.send(html_data);

    }); 

    //res.send(result);
});
 


 
var jsonParser =  bodyParser.json();
app.use(jsonParser);



app.post('/appointmentslots', (req, res) =>{ 
    var dummy_appointmentslots = appointmentslots ;
     dummy_appointmentslots.map(function(a) {
                a.booked = false;
            })

    var appointmentSlotDate  = req.body.appointmentSlotDate ;
    select_query = "SELECT appointment_timing FROM booking_form WHERE appointment_date ='"+appointmentSlotDate+"'" ; 
    conn.query(select_query, function (err, result) {
        if (err) throw err;
        //console.log(result);
        result.forEach( function(a) { 
            slot = a.appointment_timing ;

            dummy_appointmentslots.map(function(a) {
                if( slot == a.id){ a.booked = true; }
            })
            console.log( JSON.stringify( dummy_appointmentslots) );
        })
        res.send(dummy_appointmentslots);

/*
        json.map(function(a) {
            if(id==a.id){ a.Username = "yyy "+a.Username; }
        })*/

    }); 

});

app.post('/store-data' , (req, res) =>{ 

    user_first_name  = req.body.user_first_name ;
    user_last_name = req.body.user_last_name ;
    appointment_date = req.body.appointment_date ;
    appointment_timing = req.body.appointment_timing ;
    city = req.body.city ;
    country = req.body.country ;
    pincode = req.body.pincode ;
    state = req.body.state ;
    street_address = req.body.street_address ;
    street_address_2 = req.body.street_address_2 ;
    
    var sql = `INSERT INTO booking_form ( user_first_name,user_last_name,appointment_date,appointment_timing,city,country,pincode,state,street_address,street_address_2 ) 
    VALUES ("${user_first_name}", "${user_last_name}", "${appointment_date}", "${appointment_timing}","${city}", "${country}", "${pincode}", "${state}", "${street_address}", "${street_address_2}")`;

    conn.query(sql, function(err, result) {
        if (err) throw err;
        console.log('record inserted');
    });

    res.send( 'record inserted' );
});


app.post('/data',  function ( req, res ) {  
   // Prepare output in JSON format  
   /*response = {  
       first_name:req.body.city,  
       last_name:req.body.country  
   };*/  
    var input = (req) ;
    console.log( '##############' );

    console.log( input );

    console.log( '##############' );

    
    /*

   console.log('Got body:',  JSON.stringify( req ) );
    res.sendStatus(200);

   /*

   conn.connect(function(err) {
   if (err) throw err;
    console.log('Database is connected successfully !');
    });
    module.exports = conn;
   console.log( req.body );  
   res.write(JSON.stringify(response)); */
})  


var server = app.listen(5000, function () {  
  var host = server.address().address  
  var port = server.address().port  
  console.log("Example app listening at>>> http://%s:%s", host, port)  
}) 