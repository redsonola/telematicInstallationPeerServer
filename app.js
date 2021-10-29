//hello, world
//https://myhsts.org/tutorial-develop-advance-webcam-site-using-peerjs-and-peerserver-with-express-js.php
require('dotenv').config();

const { CycleSpacesArray } = require("./cycleSpacesArray");

const express = require("express");
const app = express();
const http = require('http');
const cors = require("cors");

app.use(cors());


const port = 9000
const server = http.createServer({
  // for https, require('https') instead of http above, and add the key & cert:
  // key: fs.readFileSync('../collabcmi/snowpack.key'),
  // cert: fs.readFileSync('../collabcmi/snowpack.crt')
}, app);

const ExpressPeerServer = require("peer").ExpressPeerServer(server);
app.use("/signaling", ExpressPeerServer);

var connected_users = [];

ExpressPeerServer.on("connection", function (id)
{
  var idx = connected_users.indexOf(id.id);
  if (idx === -1) //only add id if it's not in the array yet
  {
    connected_users.push(id.id);
  }
});


app.get('/products/:id', function (req, res, next)
{
  res.json({ msg: 'This is CORS-enabled for all origins!' })
})

//getting a random chat partner
var waiting_peers = [];
app.get("/find", function (httpRequest, httpResponse, next)
{
  console.log("received find request: " + httpRequest.query.id);
  let id = httpRequest.query.id;
  // if(connected_users.indexOf(id) !== -1)
  // {
  var idx = waiting_peers.indexOf(id);
  if (idx === -1)
  {
    waiting_peers.push(id);
  }

  if (waiting_peers.length > 1)
  {
    waiting_peers.splice(idx, 1);
    var user_found = waiting_peers[0];
    waiting_peers.splice(0, 1);
    httpResponse.send(user_found);
  }
  else
  {
    httpResponse.status(404).send("Not found");
  }
  // }
  // else
  // {
  //     httpResponse.status(404).send("Not found");
  // }
});

//not right now
// app.get("/getConnectedUsers", function(httpRequest, httpResponse, next)
// {
//     httpResponse.send(connected_users);
// });

// var waiting_calls = [];
// app.get("/requestCall", function(httpRequest, httpResponse, next)
// {
//     console.log("received waiting call request: " + httpRequest.query.id1 + "," +httpRequest.query.id2)

// });

// app.get("/waitingCallCheck", function(httpRequest, httpResponse, next)
// {
//     console.log("received waiting call check request: " + httpRequest.query.id)
// });

app.get("/testCycleSpacesArray", function (httpRequest, httpResponse, next)
{
  httpResponse.send("OK! Testing now. Check the console");

  let spacesArray = new CycleSpacesArray();

  //test even
  for (let i = 0; i < 6; i++)
  {
    spacesArray.add(i);
  }

  //test odd
  // for(let i=0; i<5; i++)
  // {
  //     spacesArray.add(i);
  // }


  for (let i = 0; i < 8; i++)
  {
    spacesArray.logArrays();
    spacesArray.cycle();
  }
  spacesArray.logArrays();

  spacesArray.remove(4);

  console.log(" ***** logging pairs after removal ****** ");
  spacesArray.logArrays();


  //test getting pairs
  let pairs = spacesArray.getCurrentPairs();
  console.log(" ***** testing pairs after removal ****** ");
  console.log(pairs);

  spacesArray.remove(5);
  console.log(" ***** logging pairs after removal #2 ****** ");
  spacesArray.logArrays();
  //test getting pairs
  let pairs2 = spacesArray.getCurrentPairs();
  console.log(" ***** testing pairs after removal ****** ");
  console.log(pairs2);

  spacesArray.remove(1);
  console.log(" ***** logging pairs after removal #3 ****** ");
  spacesArray.logArrays();
  //test getting pairs
  let pairs3 = spacesArray.getCurrentPairs();
  console.log(" ***** testing pairs after removal #3 ****** ");
  console.log(pairs3);

});


app.get("/testCycleSpacesArrayNewSpace", function (httpRequest, httpResponse, next)
{
  httpResponse.send("OK! Testing now. Check the console");

  let spacesArray = new CycleSpacesArray();

  //test even
  for (let i = 0; i < 6; i++)
  {
    spacesArray.add(i);
  }


  for (let i = 0; i < 8; i++)
  {
    spacesArray.logArrays();
    spacesArray.cycle();
  }
  spacesArray.logArrays();

  let connectingID = spacesArray.connectToNewSpace(4);
  console.log(" id 4 connects to " + connectingID);

  spacesArray.logArrays();
  let connectingID2 = spacesArray.connectToNewSpace(4); //already connected
  console.log(" id 4 connects to " + connectingID2);

  spacesArray.logArrays();

  spacesArray.cycle();

  let connectingID3 = spacesArray.connectToNewSpace(4); //already connected
  console.log(" id 4 connects to " + connectingID3);

  spacesArray.logArrays();

  spacesArray.remove(5);

  let connectingID4 = spacesArray.connectToNewSpace(4); //already connected
  console.log(" id 4 connects to " + connectingID4);

  spacesArray.logArrays();

  spacesArray.cycle();

  let connectingID5 = spacesArray.connectToNewSpace(4); //already connected
  console.log(" id 4 connects to " + connectingID5);

  spacesArray.logArrays();

});

/***************** NEW CYCLING SERVER CODE!!!!! ***********************/
var connectedSpacesArray = new CycleSpacesArray();

var updatingAndCycling = false;;
app.get("/connectAndCycle", function (httpRequest, httpResponse, next)
{
  if (updatingAndCycling)
  {
    httpResponse.send("-1");
  }
  else
  {
    updatingAndCycling = true;

    console.log("received cycle request: " + httpRequest.query.id);
    let id = httpRequest.query.id
    connectedSpacesArray.add(id);
    connectedSpacesArray.cycle();
    // httpResponse.status(404).send("Not found");
    httpResponse.send("-1");

    updatingAndCycling = false;
  }

  // let newPartner = connectedSpacesArray.connectToNewSpace(id); 

  // if( newPartner === -1 )
  // {
  //     httpResponse.send("-1");
  // }
  // else 
  // {
  //     httpResponse.send(newPartner);
  // }
  // console.log( "send " +id+ " response: " + newPartner );

  // connectedSpacesArray.logArrays(); 
});
app.get("/updateConnection", function (httpRequest, httpResponse, next)
{

  if (updatingAndCycling)
  {
    httpResponse.send("-1");
  }
  else
  {
    updatingAndCycling = true;
    // console.log("received update connection request: " + httpRequest.query.id);
    let id = httpRequest.query.id

    let newPartner = connectedSpacesArray.connectToNewSpace(id);

    if (newPartner === -1)
    {
      httpResponse.send("-1");
    }
    else{
        updatingAndCycling = true; 
        // console.log("received update connection request: " + httpRequest.query.id);
        let id = httpRequest.query.id 

        if(id === 'null' || id === null)
        {
            connectedSpacesArray.remove('null');
            httpResponse.send("-1"); 
            console.log( "RETURNED NULL!!" );

        }
        else
        {
            let newPartner = connectedSpacesArray.connectToNewSpace(id); 

            if( newPartner === -1 )
            {
                httpResponse.send("-1");
                console.log( "NO NEED FOR UPDATES: send " +id+ " response: " + newPartner );

            }
            else if( newPartner === -2 )
            {
                connectedSpacesArray.add( id ); 
                connectedSpacesArray.cycle(); 
                httpResponse.send("-1");
                console.log( "ID WAS NOT FOUND IN LIST!!!!!!: send " +id+ " response: " + newPartner );

            }
            else 
            {
                console.log( "RETURNED AN ACTUAL ID: send " +id+ " response: " + newPartner );
                httpResponse.send(newPartner);
            }
            // console.log( "send " +id+ " response: " + newPartner );
            connectedSpacesArray.logArrays(); 
        }   
    }
    // console.log("send " + id + " response: " + newPartner);
    // connectedSpacesArray.logArrays();
    updatingAndCycling = false;
  }
});

app.get("/disconnectId", function (httpRequest, httpResponse, next)
{
  let id = httpRequest.query.id;
  connectedSpacesArray.remove(id);
  httpResponse.send("-1");
});

app.get("/reset", function (httpRequest, httpResponse, next)
{
  connectedSpacesArray.reset();
  httpResponse.send("reset peers");
  console.log("reset peers");
});

ExpressPeerServer.on("disconnect", function (id)
{ //that value was a misnomer. it is NOT the id, its this whole peer obj.

  let id1 = connected_users.indexOf(id.id);
  if (id1 !== -1)
  {
    connected_users.splice(id1, 1);
  }

  let id2 = waiting_peers.indexOf(id.id);
  if (id2 !== -1)
  {
    waiting_peers.splice(id2, 1);
  }

  connectedSpacesArray.remove(id.id);
});

/******************* */




// twilio tokens from https://console.twilio.com/
const twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// // websocket server
// const { Server } = require("socket.io");
// const io = new Server(server, {
//   cors: {}
// });

// /**
//  * set up using this article:
//  * https://www.twilio.com/blog/2014/12/set-phasers-to-stunturn-getting-started-with-webrtc-using-node-js-socket-io-and-twilios-nat-traversal-service.html
//  * it had this whole fucking thing w/ websocket connections etc.
//  * but really you can just use one token and reuse it.
//  */

const oneWeek = 60 * 60 * 24 * 7;
const token = twilio.tokens.create({ ttl: oneWeek });
app.get('/ice-servers', async (req, res) => {
  // resolve the promise for token, then assign the value of token.iceServers to the iceServers const
  const { iceServers } = await token;
  // serialize & send with `Content-Type: application/json` headers
  res.json(iceServers);
});


// // websocket connection
// if you want to use this stuff again, run:
// npm i --save socket.io
// Websockets are really nice for things where you would poll for a response (the server
// can just send stuff to the client whenever it feels like it, the client doesn't
// have to keep checking) or a lot of little calls are being made (much lower latency).
//
// io.on('connection', function (socket)
// {
//   console.log('ws connection');
//   // socket.on('join', function (room)
//   // {
//   //   console.log('ws joined', room);
//   //   var clients = io.sockets.adapter.rooms[room];
//   //   var numClients = typeof clients !== "undefined" ? clients.length : 0;
//   //   console.log({ numClients })
//   //   if (numClients == 0)
//   //   {
//   //     socket.join(room);
//   //   }
//   //   else if (numClients == 1)
//   //   {
//   //     socket.join(room);
//   //     socket.emit("ready", room);
//   //     socket.broadcast.emit("ready", room);
//   //   } else
//   //   {
//   //     socket.emit("full", room);
//   //   }
//   // });

//   // this could have just been an http api call, it didn't need to be a websocket >_<
//   // the token contains the list of ICE servers.
//   socket.on('token', function ()
//   {
//     // just reuse the token
//     console.log('ws token');
//     token.then((token) => socket.emit('token', token));
//     // twilio.tokens.create(function (err, response)
//     // {
//     //   if (err)
//     //   {
//     //     console.log(err);
//     //   }
//     //   else
//     //   {
//     //     socket.emit('token', response);
//     //   }
//     // });
//   });
// });

server.listen(process.env.PORT || 9000, () =>
{
  console.log(`Example app listening at http://localhost:${port}`)
});