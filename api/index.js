const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
const bodyParser = require("body-parser");
const { Client } = require("pg");
const axios = require("axios");

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

var client = new Client({
  user: 'postgres',
  password: 'cubase2356',
  database: 'users',
  host: 'localhost',
  port: 5432
});
client.connect();

const vrsctest = axios.create({
  baseURL: "http://localhost:18299/" , //process.env.VRSCTEST_RPC_URL,
  auth: {
      username: "verusdesktop" , //process.env.VRSCTEST_RPC_USER || '',
      password: "fBMqvHKVQpDkjKSYPQbVjF7hU8FgsiaWon0TVy0TovI", // process.env.VRSCTEST_RPC_PASSWORD || '',
  }
});


const verusClient = {
  vrsctest,
  // add more verus pbaas chain clients here
}

app.get("/register", (req,res) => {
  const regObject = req.body;

  console.log("regObject", regObject);

  const date = (new Date()).toLocaleString("en-US")

  client.query(
    "INSERT INTO users (username, firstname, secondname, email, dob) VALUES ($1, $2, $3, $4, $5)",
    [regObject.username, regObject.firstname, regObject.secondname, regObject.email, regObject.dob])
    .then(() => res.send({ success: true, message: null }))
    .catch((e) => {res.send({ success: false, message: e.message.toString() });
  })
});

app.get("/login", (req,res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/userdetails", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  client.query(`SELECT * FROM users WHERE username = '${username}'`).then(result => {
    console.log("res", result.rows[0])

    res.send({ message: result.rows[0] });
  }). catch(err => {console.log(err.stack)});
});

app.post("/verifymessage", (req, res) => {

  console.log("req.query",req.query.params);
  let loginConsentResponse;
  if (req?.body?.params)
  loginConsentResponse = JSON.parse(String(req.body.params));
  else if (req.query)
  loginConsentResponse = JSON.parse(String(req.query.params));
  console.log("loginConsentResponse: ",loginConsentResponse);

  verusClient['vrsc'].post('', {
    jsonrpc: '2.0',
    method: 'verifymessage',
    params: [
        loginConsentResponse[0],
        loginConsentResponse[1],
        loginConsentResponse[2]
    ]}).then(result => { 
      res.send({ signaturevalid: result.data.result });
      }).catch((e) =>{
        console.log(e)
        res.send({ signaturevalid: false });
      }
      )

});

app.post("/wrapdocument", (req, res) => {

  // console.log("req.query",req.body.params);
   const loginConsentResponse = JSON.parse(String(req.body.params));

   let wrappedDocument = wrapDocument(loginConsentResponse);

   wrappedDocument.version = "Verus Openattestation compatible schema V1"

   res.send(wrappedDocument);
 
 });

app.post("/getidentity", (req, res) => {

 //  console.log("req.query",req.body.params);
   const identity = req.body.params;
 //  console.log("loginConsentResponse: ",loginConsentResponse);
 
   verusClient['vrsc'].post('', {
     jsonrpc: '2.0',
     method: 'getidentity',
     params: [
      identity
     ]}).then(result => { 
       res.send( result.data );
       }).catch((e) =>{
         console.log(e)
         res.send({ signaturevalid: false });
       }
       )
 
 });


app.post("/signmessage", (req, res) => {

  console.log("req.query",req.body.params);
   const loginConsentChallenge = req.body.params;
  console.log("loginConsentChallenge: ", loginConsentChallenge);
 
   verusClient['vrsc'].post('', {
     jsonrpc: '2.0',
     method: 'signmessage',
     params: [
         "yolo1@",   //ID that you hold to sign your websites outgoing messages
         loginConsentChallenge
     ]}).then(result => {
         console.log("Result from daemon signature: ",result.data.result?.signature)
       res.send({ signature: result.data.result?.signature });
       }).catch((e) =>{
        // console.log(e)
         res.send({ signature: false, error: e.message });
       }
       )
 
 });

 app.post("/obfuscatedocument", (req, res) => {

  // console.log("req.query",req.body.params);
   const doc = JSON.parse(req.body.params);
 
   const obvsDoc = obfuscateDocument(doc,["verusid","firstname","secondname","email","datecreated"]);
   console.log("obvsDoc",obvsDoc);
   res.send({message: obvsDoc});
      
 
 });

 app.get("/checkuser", (req, res) => {
  
  const arrayout = [];
  client.query("SELECT * FROM users").then(result => {

    console.log("res",result.rows);
    const data = result.rows;

    console.log('all data');
    data.forEach(row => {
      arrayout.push(row.username);
    })
    res.send(arrayout);
  }).catch(err => {
    console.log(err.stack);
  });

});

app.post("/checkout", async (req, res) => {
  /*
  req.body.items
  [
      {
          id: 1,
          quantity: 3
      }
  ]

  stripe wants
  [
      {
          price: 1,
          quantity: 3
      }
  ]
  */
  console.log(req.body);
  const items = req.body.items;
  let lineItems = [];
  items.forEach((item)=> {
      lineItems.push(
          {
              price: item.id,
              quantity: item.quantity
          }
      )
  });

  const session = await checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel"
  });

  res.send(JSON.stringify({
      url: session.url
  }));
});

app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
