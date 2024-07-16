function printTime(message, arg1, verbose) {

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const dt = DateTime.local(2017, 5, 15, 8, 30);
    const now = DateTime.now();
    const format1 = "DATETIME_MED_WITH_SECONDS"
    const format2 = 'TIME_WITH_SECONDS'


    //if (verbose) {
    //if (arg1) {
    if (false) {
        //arg1=typeof arg1==='string'?console.log('\t',message,'\t',arg1.substring(0,10),'\tat:',now.year:

        //console.log('\t', message, '\t', arg1, '\tat:', now.year,now.month,now.day,now.hour,now.minute)
        console.log('\t', message, '\t', arg1, '\tat:', now.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS))
    } else {
        console.log('\t', message, '\t', '\tat:', now.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS))
    }
}
function getArgs() {
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach(arg => {

            if (arg.slice(0, 2) === '--') {
                const longArg = arg.split('=');
                const longArgFlag = longArg[0].slice(2, longArg[0].length);
                const longArgValue = longArg.length > 1 ? longArg[1] : true;
                args[longArgFlag] = longArgValue;
            }
            // flags
            else if (arg[0] === '-') {
                const flags = arg.slice(1, arg.length).split('');
                flags.forEach(flag => {
                    args[flag] = true;
                });
            }
        });
    return args;
}




var params = function (req) {

    let q = req.url.split('?'), result = {};

    if (q.length >= 2) {
        q[1].split('&').forEach((item) => {
            try {
                result[item.split('=')[0]] = item.split('=')[1];
            } catch (e) {
                result[item.split('=')[0]] = '';
            }
        })
    }

    return result;
}

// var express = require('express'),
//     app = express(),
//     server  = require('http').createServer(app);

// server.listen(3001, function(err) {
//         console.log(err, server.address());
// });
// console.log('leaving')

// return
// exit

var http = require('http');

//const verbose=

const fs = require('fs');
const { url } = require('url');
const queryString = require('querystring');
const { DateTime } = require("luxon")
const { isMapIterator } = require('util/types');

let currentDate = new Date()
const dt = DateTime.local(2017, 5, 15, 8, 30);

//console.log('Server Starting listener', currentDate.toUTCString())

const args = getArgs();
const verbose = args.v
//printTime('DateTime', dt, verbose)
printTime('start', '', verbose)
if (verbose) { printTime('Verbose', verbose, verbose) }
//console.log('args',args)
//console.log('verbose',verbose)

const dir = './data/';
const indexfile = dir + 'index.dat'

var port = args.port


if (!port) {
    port = 3000
}
var count = 0
const separator = '<<EVENT>>\r\n'
printTime('port', port, verbose)




    //http.createServer((r, s) => {
    http.createServer((req, res) => {
        printTime('createServer', '', verbose)

        var querystring = params(req)
        //printTime('querystring', querystring, verbose)


        file = querystring.file
        if (!file) {
            printTime('EXITTING because of no file sent', '', verbose)

            return
        }

        path = './data/' + file

        count++
        let returnval = 'returnval'
        printTime('method', req.method, verbose)
        //console.log('querystring.action 2', querystring)
        printTime('action', querystring.action, verbose)

        //console.log('method',req.method)
        //printTime('method',req.method,verbose)
        if (req.method == "PUT") {

            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            let arrayjson = JSON.stringify(body)
            //res.write(arrayjson)

            //res.end();

            req.on('end', () => {


                bodyd = body
                const finddoublequote = /\"/g
                bodys = body.replaceAll(finddoublequote, "'")

                printTime('bodys:', bodys, verbose)

                //if (false) {
                //            s.write(JSON.stringify(bodys))

                //}

                let bodyparsed = JSON.parse(bodyd)





                fs.appendFile(path, JSON.stringify(bodys) + separator, function (err) {
                    if (err) {

                        printTime('append FAILED:', path, verbose)
                    } else {
                        printTime('PUT body Worked:', path, verbose)

                    }
                })

                let index = '{"id":"' + bodyparsed.id + '","creationdate":"' + bodyparsed.creationdate + '"}'
                //console.log('index', index)

                fs.appendFile(indexfile, index + separator, function (err) {
                    if (err) {
                        console.log("\tappend to index failed")
                    } else {
                        console.log("\tPUT index Worked", indexfile)
                    }
                })

                res.write(JSON.stringify(index))

                res.end();


            });


        } else if (req.method === "GET") {
            //    res.writeHead(200, {'Content-Type': 'text/plain'});
            res.writeHead(200, { 'Content-Type': 'application/json' });
            //res.write('Hello kate1 World!');
            //res.end();

            if (querystring.action === 'cv') {
                //res.write('Hello kate0 World!');

                printTime('file', file, verbose)
                //"utf8" is the encoding of the file so you get a string rather than a buffer(see stack overflow in Work/Technology/Filesystem)

                fs.readFile('./data/' + file, "utf8", function (err, data) {
                    if (!data) {
                        printTime('Data is empty', '', verbose)
                        res.write(JSON.stringify({ 'ERROR': 'the file:' + file + ' does not exists' }))
                        res.end();

                    } else {


                        let array = data.toString().split('<<EVENT>>\r\n');
                        console.log('array length',array.length)


                        let KATE0 = data.toString().split('<<EVENT>>\r\n');
                        //let KATE1=
                        array.filter((val) => val)
                        //console.log('KATE0', KATE0)
                        const KATE2 = KATE0.reduce((accumulor, item) => {
                            if (item) {
                                accumulor = JSON.parse(item)

                            }
                            return accumulor

                        }, {})
                        console.log('CV:', KATE2)


                        //console.log('KATE1', KATE1)

                        //    KATE6={'name':'x'}
                        //    KATE5=Object.keys(KATE6)
                        //      Object.keys(KATE5).forEach(function(value){
                        //         console.log('value=',value)
                        //      })
                        let go0 = data.toString().split('<<EVENT>>\r\n');
                        console.log('go0:',go0)
                        let go1 = go0.reduce((accumulor, item) => {
                            if (item) {
                                accumulor = JSON.parse(item)

                            }
                            return accumulor
                        }, {})

                        // let go2 = go1.reduce((accumulor, item) => {
                        //     if (item) {
                        //         accumulor = JSON.parse(item)

                        //     }
                        //     return accumulor

                        // }, {})

                        
                        console.log('go1:',go1)
                        //console.log('go2:',go2)



                        res.write(JSON.stringify(KATE2))

                        res.end();
                    }

                })
            } else if (querystring.action === 'index') {
                //console.log('action',querystring.action)

                fs.readFile(indexfile, "utf8", function (err, data) {
                    if (!data) {
                        console.log('data empty')
                        printTime('index is empty', '', verbose)


                    } else {


                        let array = data.toString().split('<<EVENT>>\r\n')
                            .filter((val) => { return val });


                        let arrayjson = JSON.stringify(array)

                        let arrayman = [{ 'id': 1 }, { 'id': 0 }, { 'id': 2 }]


                        res.write(arrayjson)

                        res.end();

                    }

                })


            }




        }
        printTime('-------', '', verbose)

    }).listen(port);
