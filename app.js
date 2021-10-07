//hello, world
//https://myhsts.org/tutorial-develop-advance-webcam-site-using-peerjs-and-peerserver-with-express-js.php

const express = require('express')
const app = express()
var cors = require('cors')

app.use( cors() );

const port = 9000
var server = app.listen(process.env.PORT || 9000, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
var ExpressPeerServer = require("peer").ExpressPeerServer(server); 
app.use("/signaling", ExpressPeerServer);
var connected_users = [];
var random_pool = []; 
ExpressPeerServer.on("connection", function(id){ 
    var idx = connected_users.indexOf(id.id);
    if(idx === -1) //only add id if it's not in the array yet
    {
        connected_users.push(id.id);
    }

});


app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

ExpressPeerServer.on("disconnect", function(id){ //that value was a misnomer. it is NOT the id, its this whole peer obj.

    let id1 = connected_users.indexOf(id.id);
    if(id1 !== -1)
    {
        connected_users.splice(id1, 1);
    }
    
    let id2 = waiting_peers.indexOf(id.id); 
    if(id2 !== -1)
    {
        waiting_peers.splice(id2, 1);
    } 
});

//getting a random chat partner
var waiting_peers = [];
app.get("/find", function(httpRequest, httpResponse, next)
{ 
    console.log("received find request: " + httpRequest.query.id);
    var id = httpRequest.query.id; 
    // if(connected_users.indexOf(id) !== -1)
    // {
        var idx = waiting_peers.indexOf(id); 
        if(idx === -1)
        {
            waiting_peers.push(id);
        }

        if(waiting_peers.length > 1)
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


