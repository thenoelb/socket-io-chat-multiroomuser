var app = require('express')();             //Express initializes 'app' (=Express App) to be function for http server
var http = require('http').Server(app);     //app is put into a server using http
var io = require('socket.io')(http);        //socket IO http server
// var path = require('path')                  //path module

app.get('/', function(req, res){                    //get(path, middleware), req = obj w/http request info, res = http response
    res.sendFile(__dirname + '/index.html');       //sendFile(__dirname + 'filename') = sends http response
});

io.on('connection', function(socket){       //occurs when a socket is opened

    //Timestamp construction
    var time = new Date();                  
    var now = ('0'+time.getMonth()+1).slice(-2)+"/"+('0'+time.getDate()).slice(-2)+"/"+time.getFullYear().toString()+" "+('0'+time.getHours()).slice(-2)+":"+('0'+time.getMinutes()).slice(-2)+":"+('0'+time.getSeconds()).slice(-2) + ":" +('00'+time.getMilliseconds()).slice(-3);

    //Room and Username Setup
    socket.on('room name', function(rmnm, user){
        socket.join(rmnm);
        socket.rooms = rmnm;
        socket.id = user;
        console.log(now +" : "+ socket.id+ " connecting to "+ socket.rooms + "...");            
        io.to(socket.rooms).emit('chat message', now +" : " +socket.id + " has connected");
        console.log(now +" : " +socket.id+ ' has connected to ' + socket.rooms);        //displays that a client has connected to the websocket chat
    });

    socket.on('chat message', function(msg){    //adds a listener to websocket to listen for 'chat message'
        console.log(now +" : "+ socket.rooms+"."+socket.id+': ' + msg);         //prints 'chat message'
        io.to(socket.rooms).emit('chat message', now +" : " +socket.id+": " + msg);           //broadcasts message 'chat message'/msg to default room/namespace 
    });

    socket.on('disconnect', function(user){
        console.log(now + " : "+ socket.id+ " has disconnected from " +socket.rooms);
        io.to(socket.rooms).emit('chat message', now +" : " +socket.id+": " + 'has disconnected.');           //broadcasts message 'chat message'/msg to default room/namespace 
        socket.leave(socket.rooms);
    });
});


http.listen(3000, function(){               //listen(port, [hostname], [backlog], callback) = binds and listens to connections on specified host and port, identical to Node's http.Server.listen()'
    console.log('listening on *:3000');     //displays action in console
});