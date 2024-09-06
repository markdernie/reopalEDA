function printTime(message, arg1, verbose) {

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const dt = DateTime.local(2017, 5, 15, 8, 30);
    const now = DateTime.now();
    const format1 = "DATETIME_MED_WITH_SECONDS"
    const format2 = 'TIME_WITH_SECONDS'

    
    if (arg1) {
        console.log('\t', message, '\t', arg1, '\tat:', now.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS) + ':', now.millisecond)
    } else {
        console.log('\t', message, '\t', arg1, '\tat:', now.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS) + ':', now.millisecond)
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

var http = require('http');



const fs = require('fs');
const { url } = require('url');
const queryString = require('querystring');
const { DateTime } = require("luxon")
const { isMapIterator } = require('util/types');

let currentDate = new Date()
const dt = DateTime.local(2017, 5, 15, 8, 30);



const args = getArgs();
const verbose = args.v

printTime('start', '', verbose)
if (verbose) { printTime('Verbose', verbose, verbose) }


const dir = './data/';
const indexfile = dir + 'index.dat'

var port = args.port


if (!port) {
    port = 3000
}
var count = 0
const separator = '<<EVENT>>\r\n'
printTime('port', port, verbose)



http.createServer((req, res) => {
    printTime('got a request', '', verbose)

    var querystring = params(req)
    

    file = querystring.file
    if (!file) {
        printTime('EXITTING because of no file sent', '', verbose)

        return
    }

    path = './data/' + file

    count++
    
    printTime('method', req.method, verbose)
    
    if (req.method == "PUT") {
        printTime('PUT', '', verbose)

        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        
        

        req.on('end', () => {


            bodyd = body
            

            let bodyparsed = JSON.parse(bodyd)

            fs.appendFile(path, bodyd + separator, function (err) {
                if (err) {

                    printTime('append FAILED:', path, verbose)
                } else {
                    printTime('PUT body Worked:', path, verbose)

                }
            })

            let index = '{"id":"' + bodyparsed.id + '","creationdate":"' + bodyparsed.creationdate + '"}'

            fs.appendFile(indexfile, index + separator, function (err) {
                if (err) {
                    console.log("\tappend to index failed")
                } else {
                    console.log("\tPUT index Worked", indexfile)
                }
            })

            res.write(JSON.stringify({'message':'PUT SUCCESS'}))

            res.end();
        });
    }
    if (req.method === "GET" && querystring.action === 'index') {

        printTime('GET index', '', verbose)

        res.writeHead(200, { 'Content-Type': 'application/json' });

        if (querystring.action === 'index') {


            fs.readFile(indexfile, "utf8", function (err, data) {
                if (!data) {
                    console.log('data empty')
                    printTime('index is empty', '', verbose)


                } else {


                    let array = data.toString().split('<<EVENT>>\r\n')
                        .filter((val) => { return val });


                    let arrayjson = JSON.stringify(array)



                    printTime('index write back arrayjson:', arrayjson, verbose)
                    res.write(arrayjson)
                    console.log('arrayjson:', arrayjson)

                    for (const element of array) {
                        console.log('LOOPING:', element)
                        let jelement = JSON.parse(element)
                        console.log('jelement:', jelement)
                        console.log('jelement.id:', jelement.id)

                    }
                    res.write(JSON.stringify({'message':'GET index SUCCESS'}))

                    res.end();

                }

            })


        }

    }
    if (req.method === "GET" && querystring.action === 'all') {
        
        fs.readFile(indexfile, "utf8", function (err, data) {
            if (!data) {
                console.log('data empty')
                printTime('index is empty', '', verbose)
            } else {
                let alllines = data.toString().split('<<EVENT>>\r\n')
                    .filter((val) => { return val });

                for (const element of alllines) {
                    
                    let jelement = JSON.parse(element)
                    
                    fs.readFile('./data/' + jelement.id, "utf8", function (err, data2) {
                        if (!data2) {
                             printTime('index is empty', '', verbose)


                        } else {
                            let array2 = data2.toString().split('<<EVENT>>\r\n')
                                .filter((val) => { return val });
                            let data3 = JSON.stringify(data2)
                           
                            let returnval=JSON.stringify([array2.reduce((accumulor, item) => {return item},[])])
                            
                            res.write(returnval)
                            
                            res.end();
                            

                        }
                    })
                    
                }

                

            }

        })
    }


    if (req.method === "GET" && querystring.action === 'cv') {
        printTime('new code GET cv', '', verbose)
        printTime('new code action=', querystring.action, verbose)
        if (querystring.action === 'cv') {

            printTime('action=cv ', querystring.action, verbose)

            printTime('file', file, verbose)
            //"utf8" is the encoding of the file so you get a string rather than a buffer(see stack overflow in Work/Technology/Filesystem)

            fs.readFile('./data/' + file, "utf8", function (err, data) {
                if (!data) {
                    printTime('Data is empty', '', verbose)
                    res.write(JSON.stringify({ 'ERROR': 'the file:' + file + ' does not exists' }))
                    res.end();

                } else {

                    let go0 = data.toString().split('<<EVENT>>\r\n');
                    printTime('go0:', go0, verbose)

                    let go1 = go0.reduce((accumulor, item) => {
                        if (item) {
                            accumulor = JSON.parse(item)

                        }
                        return accumulor
                    }, {})

                    printTime('go1:', go1, verbose)

                    res.write(JSON.stringify(go1))

                    res.end();
                }

            })
        }
    }
    printTime('end -------', '', verbose)

}).listen(port);
