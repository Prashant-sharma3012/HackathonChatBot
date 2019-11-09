const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const passportConfig = require("./config/passport");
const Authenticated = require("./config/keys").Authenticated
const MongoClient = require('mongodb').MongoClient;
const jwt = require("jsonwebtoken")
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const projectId = 'myreactagent-bbblvp'
const cookieParser = require('cookie-parser');
const CircularJSON = require('circular-json')

const Mapping = {
  lastName: "Your Name is ",
  firstName: "Your Name is ",
  hireDate: "Your Hire date is ",
  jobTitle: "Your Job Title is ",
  practiceLead: "Your Practise Lead is ",
  reportingLead: "Your Reporting Lead is ",
  deliveryLead: "Your Delivery Lead is ",
  locationDescription: "Your Job Location is "
}
//Express middleware
const app = express();

// DB Config
// const db = require("./config/keys").mongoURI;
// Port Number
const port = process.env.PORT || 8000; // process.env.port is Heroku's port if you choose to deploy the app there

var db;
// Connect to MongoDB
MongoClient
  .connect('mongodb://localhost:27017', function (err, client) {
    // assert.equal(null, err);
    console.log("Connected successfully to server");

    db = client.db('chatApp');
  })

// Bodyparser middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
// Passport middleware
app.use(passport.initialize());
app.use(cookieParser());

// Passport config
passportConfig(passport);

// Routes

app.post("/ansMsg", Authenticated, async (req, res) => {
  // console.log("AAYA", req.body.msg, req.headers)
  const authorization = req.headers.authorization
  const token = authorization.split(" ")[1]
  const decoded = jwt.decode(token);
  // console.log("---------decoded---------", decoded.preferred_username)
  const name = decoded.preferred_username.split('@')[0]
  // console.log("===============name===========", name)
  const sessionId = uuid.v4();
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({ keyFilename: "./myreactagent-bbblvp-3ee03c6c0ae3.json" });
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // const userData = await db.collection('employeeData').findOne({ firstName: name })
  // console.log("-------userdata------", userData)
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: req.body.msg,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };


  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  // console.log('Detected intent', responses);
  const result = responses[0].queryResult;
  // console.log("****", result.fulfillmentMessages[0].text, JSON.stringify(result.fulfillmentMessages[1].payload))
  console.log(result)
  // console.log(`  Query: ${result.queryText}`);
  // console.log(`  Response: ${result.fulfillmentText}`);
  console.log(`  param: `, JSON.stringify(result.parameters.fields));
  // if (result.intent) {
  //   console.log(`  Intent: ${result.intent}`);
  // } else {
  //   console.log(`  No intent matched.`);
  // }
  if (!result.parameters.fields) {
    return res.status(200).json({
      message: result.fulfillmentText,
    })
  }
  else if (result.parameters.fields && result.parameters.fields.myEntity1 && result.parameters.fields.myEntity1.stringValue) {
    const userData = await db.collection('employeeData').findOne({ firstName: name })
    let searchParam = result.parameters.fields.myEntity1.stringValue
    searchParam = searchParam == "myName" ? "firstName" : searchParam
    // console.log(searchParam, searchParam === "jobTitleDescription", userData[searchParam])
    // console.log(userData, userData[searchParam]) jobTitileDescription
    let reply = Mapping[searchParam] ? `${Mapping[searchParam]}${userData[searchParam]}` : `Your ${searchParam} is ${userData[searchParam]}`
    // console.log(reply, typeof reply)
    return res.status(200).json({
      message: reply,
    })
  }
  else if (result.parameters.fields && result.parameters.fields.person) {
    const userData = await db.collection('employeeData').findOne({ firstName: result.queryText })
    return res.status(200).json({
      message: `${result.queryText} reporting manager is ${userData['reportingLead']}`,
    })
  }
  else if (result.parameters.fields && result.parameters.fields.name) {
    return res.status(200).json({
      message: result.fulfillmentText,
    })
  }
  else if (result.fulfillmentText) {
    res.status(200).json({
      message: result.fulfillmentText,
    })
  }
  res.status(200).json({
    message: 'Sorry can you rephrase it?',
  })
});


app.get("/teamInfo", Authenticated, async (req, res) => {
  console.log("AAYA")
  const authorization = req.headers.authorization
  const token = authorization.split(" ")[1]
  const decoded = jwt.decode(token);
  // console.log("---------decoded---------", decoded.preferred_username)
  const name = decoded.preferred_username.split('@')[0]
  console.log(name)
  const userData = await db.collection('employeeData').findOne({ firstName: name })
  console.log("userdata=========", userData)

  let teamStructure = {}


  await db.collection('employeeData').find({ account: userData.account, positionStatus: "Active" }).toArray((err, result) => {
    if (result) {
      console.log("---------result--------", result)
      result.map(data => {
        const title = data.jobTitleDescription
        if (!teamStructure[`${title}`]) {
          console.log("=========data=======", data)
          teamStructure[`${title}`] = []
          teamStructure[`${title}`].push(data)
        } else {
          teamStructure[`${title}`].push(data)
        }
        console.log("----teamStructure----------", teamStructure)

      })


      res.status(200).json({
        teamStructure,
        userData
      })
      // A doc with the same name already exists
    }
  })


});



app.get("/api/auth/mslogin", async (req, res, next) => {
  passport.authenticate('azuread-openidconnect',
    {
      response: res,                      // required
      // resourceURL: config.resourceURL,    // optional. Provide a value if you want to specify the resource.
      customState: 'my_state',            // optional. Provide a value if you want to provide custom state value.
      failureRedirect: '/'
    }
  )(req, res, next);
})

app.get("/api/auth/mslogin/cb",
  async (req, res, next) => {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,                      // required
        failureRedirect: '/'
      }
    )(req, res, next);
  },
  (req, res) => {
    console.log('--------------We received a return from AzureAD.--------------');
    // res.redirect('/');
  }
)

app.post("/api/auth/mslogin/cb",
  async (req, res, next) => {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,                      // required
        failureRedirect: '/'
      }
    )(req, res, next);
  },
  async (req, res) => {
    // console.log('-------------- POST method We received a return from AzureAD.--------------', CircularJSON.stringify(res));
    const StringifiedResponse = CircularJSON.stringify(res)
    // console.log('-------------- POST method We received a return from AzureAD.--------------');
    // console.log(StringifiedResponse)
    // console.log('-------------- POST after method We received a return from AzureAD.--------------');
    const userRawResponse = JSON.parse(StringifiedResponse).socket.parser.incoming
    // const userResponseJson = JSON.parse(userRawResponse.user._raw)
    const resBodyJson = userRawResponse.body

    // console.log("-----------userResponseJson----------", userRawResponse)
    // console.log("-----------resBodyJson----------", resBodyJson)
    const token = resBodyJson.id_token

    res.redirect(`http://localhost:3000/login?token=${token}`);
    // res.redirect(keys.destroySessionUrl)

    // res.send(result)
  }
)


app.listen(port, () => {
  console.log(`Server up and running on port ${port} !`);
});
