//hello, world
//https://myhsts.org/tutorial-develop-advance-webcam-site-using-peerjs-and-peerserver-with-express-js.php

const { CycleSpacesArray } = require('./cycleSpacesArray');

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

//getting a random chat partner
var waiting_peers = [];
app.get("/find", function(httpRequest, httpResponse, next)
{ 
    console.log("received find request: " + httpRequest.query.id);
    let id = httpRequest.query.id; 
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

app.get("/testCycleSpacesArray", function(httpRequest, httpResponse, next)
{ 
    httpResponse.send("OK! Testing now. Check the console"); 

    let spacesArray = new CycleSpacesArray(); 

    //test even
    for(let i=0; i<6; i++)
    {
        spacesArray.add(i);
    }

    //test odd
    // for(let i=0; i<5; i++)
    // {
    //     spacesArray.add(i);
    // }


    for( let i=0; i<8; i++ )
    {
        spacesArray.logArrays(); 
        spacesArray.cycle(); 
    }
    spacesArray.logArrays(); 

    spacesArray.remove(4); 

    console.log( " ***** logging pairs after removal ****** "); 
    spacesArray.logArrays(); 


    //test getting pairs
    let pairs = spacesArray.getCurrentPairs(); 
    console.log( " ***** testing pairs after removal ****** "); 
    console.log(pairs); 

    spacesArray.remove(5); 
    console.log( " ***** logging pairs after removal #2 ****** "); 
    spacesArray.logArrays(); 
    //test getting pairs
    let pairs2 = spacesArray.getCurrentPairs(); 
    console.log( " ***** testing pairs after removal ****** "); 
    console.log(pairs2); 

    spacesArray.remove(1); 
    console.log( " ***** logging pairs after removal #3 ****** "); 
    spacesArray.logArrays(); 
    //test getting pairs
    let pairs3 = spacesArray.getCurrentPairs(); 
    console.log( " ***** testing pairs after removal #3 ****** "); 
    console.log(pairs3); 

});


app.get("/testCycleSpacesArrayNewSpace", function(httpRequest, httpResponse, next)
{ 
    httpResponse.send("OK! Testing now. Check the console"); 

    let spacesArray = new CycleSpacesArray(); 

    //test even
    for(let i=0; i<6; i++)
    {
        spacesArray.add(i);
    }


    for( let i=0; i<8; i++ )
    {
        spacesArray.logArrays(); 
        spacesArray.cycle(); 
    }
    spacesArray.logArrays(); 

    let connectingID= spacesArray.connectToNewSpace(4); 
    console.log( " id 4 connects to " + connectingID );

    spacesArray.logArrays(); 
    let connectingID2= spacesArray.connectToNewSpace(4); //already connected
    console.log( " id 4 connects to " + connectingID2 );

    spacesArray.logArrays(); 

    spacesArray.cycle(); 

    let connectingID3= spacesArray.connectToNewSpace(4); //already connected
    console.log( " id 4 connects to " + connectingID3 );

    spacesArray.logArrays(); 

    spacesArray.remove(5);

    let connectingID4 = spacesArray.connectToNewSpace(4); //already connected
    console.log( " id 4 connects to " + connectingID4 );

    spacesArray.logArrays(); 

    spacesArray.cycle();

    let connectingID5 = spacesArray.connectToNewSpace(4); //already connected
    console.log( " id 4 connects to " + connectingID5 );

    spacesArray.logArrays(); 

});

/***************** NEW CYCLING SERVER CODE!!!!! ***********************/
var connectedSpacesArray = new CycleSpacesArray(); 

app.get("/connectAndCycle", function(httpRequest, httpResponse, next)
{ 
    console.log("received cycle request: " + httpRequest.query.id);
    let id = httpRequest.query.id 
    connectedSpacesArray.add( id );
    connectedSpacesArray.cycle(); 
    httpResponse.status(404).send("Not found");

    // let newPartner = connectedSpacesArray.connectToNewSpace(id); 

    // if( newPartner === -1 )
    // {
    //     httpResponse.status(404).send("Not found");
    // }
    // else 
    // {
    //     httpResponse.send(newPartner);
    // }
    // console.log( "send " +id+ " response: " + newPartner );
    connectedSpacesArray.logArrays(); 
});

app.get("/updateConnection", function(httpRequest, httpResponse, next)
{ 
    console.log("received update connection request: " + httpRequest.query.id);
    let id = httpRequest.query.id 

    let newPartner = connectedSpacesArray.connectToNewSpace(id); 

    if( newPartner === -1 )
    {
        httpResponse.status(404).send("Not found");
    }
    else 
    {
        httpResponse.send(newPartner);
    }
    console.log( "send " +id+ " response: " + newPartner );
    connectedSpacesArray.logArrays(); 

});

app.get("/disconnectId", function(httpRequest, httpResponse, next)
{ 
    let id = httpRequest.query.id ; 
    connectedSpacesArray.remove(id); 
});

app.get("/reset", function(httpRequest, httpResponse, next)
{ 
    connectedSpacesArray.reset();
    httpResponse.send("reset peers");
    console.log("reset peers");
});

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

    connectedSpacesArray.remove(id.id); 
});

/******************* */




