const args = getArgs();


var http = require('http');
var count = 0


var port = args.port
var file = args.file
if (!args.port) {
    port = 7000
}
if (!args.file) {
    file = "dummy.txt"
}
var os = require("os");
var IP

var server = http.createServer(function (request, response) {



    
    if (request.method == "GET") {
        
        const fs = require('fs');
        
        fs.readFile(file, function (err, data) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(data);
            return response.end();
        });
        

    }
    else if (request.method == "POST") {
        count++
        console.log("going to write to file system")
        console.log("received POST request:" + count)
        response.end("received POST request.");
    }
    else if (request.method == "PUT") {
        count++
        console.log("Request:",request)
        console.log("going to write to file system")
        console.log("received PUT request:" + count)
        response.end("received PUT request.");
    }
    else {
        response.end("Undefined request .");
    }
});

server.listen(port);

'use strict';



const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

IP = results["WiFi"][0]

console.log("Server running :", IP + ":" + port);

