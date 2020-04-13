const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
//to access the css and image files locally

app.get("/", function(req,res){
  res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req, res){
  const first = req.body.fname; //we use the name property of the form to acess the value
  const last = req.body.lname;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status:"subscribed",
        merge_fields:
        {
          FNAME:first,
          LNAME:last
        }
      }
    ]
  };
  //we are creating an object called data and storing the info the way mailchimp will understand
  const jsonData = JSON.stringify(data);
  //mailchimp only understands JSON stingify form
  const url = "https://us19.api.mailchimp.com/3.0/lists/b196719735";
  const options = {
    method : "POST",
    auth : "adi:e2a29fcc050039c2b6bc260dc29b6811-us19"
    //we need to authenticate our request so we typing a string followed by
    //the API key. The string can be anything according to mailchimp
  }
  const request = https.request(url, options, function(response){
    if (response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data", function (data){
      console.log(JSON.parse(data));

      //we want to make a request to mailchimp to post our data on their server
      //any data that mailchimp sends back will be console logged and in a parsed form.
    })
  });
  request.write(jsonData);
  request.end();
  //here we are sending the jsondata as an https request to mailchimp
  console.log(first, last, email);
})

app.post("/failure", function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
  console.log("server running successfully");
})


//apikey e2a29fcc050039c2b6bc260dc29b6811-us19

//listid b196719735
