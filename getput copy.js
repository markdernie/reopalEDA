function printTime(message, arg1, verbose) {

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    if (verbose) {
        if (arg1) {
            arg1=typeof arg1==='string'?console.log('\t',message,'\t',arg1.substring(0,10),'\tat:',today.toISOString()):
           
            console.log('\t', message, '\t', arg1, '\tat:', today.toISOString())
        } else
            console.log('\t', message, '\t', '\tat:', today.toISOString())
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

//const verbose=

const fs = require('fs');
const { url } = require('url');
const queryString = require('querystring');

let currentDate = new Date()
//console.log('Server Starting listener', currentDate.toUTCString())

const args = getArgs();
const verbose = args.v
printTime('start', 'this is too long', verbose)
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
//console.log('Server Port:', port)



http.createServer((r, s) => {
    printTime('createServer', '', verbose)

    var querystring = params(r)
   

    file = querystring.file
    if (!file) {
        printTime('EXITTING because of no file sent', '', verbose)
        
        return
    }

    path = './data/' + file

    count++
    let returnval = 'returnval'
    printTime('method', r.method, verbose)
    console.log('querystring.action', querystring)
    printTime('action', querystring.action, verbose)
    

    if (r.method == "PUT") {

        let body = '';
        r.on('data', (chunk) => {
            body += chunk;
        });


        r.on('end', () => {


            bodyd = body
            const finddoublequote = /\"/g
            bodys = body.replaceAll(finddoublequote, "'")
            //console.log('bodys:', bodys)
            printTime('bodys:', bodys, verbose)

            if (false) {
                s.write(JSON.stringify(bodys))

            }
  
            let bodyparsed = JSON.parse(bodyd)





            fs.appendFile(path, JSON.stringify(bodys) + separator, function (err) {
                if (err) {
                    //console.log("\tappend failed")
                    printTime('append FAILED:', path, verbose)
                } else {
                    printTime('PUT body Worked:', path, verbose)
                    //console.log("\tPUT body Worked", path)
                }
            })

            let index = '{"id":"' + bodyparsed.id + '","creationdate":"' + bodyparsed.creationdate + '"}'
            console.log('index', index)

            fs.appendFile(indexfile, index + separator, function (err) {
                if (err) {
                    console.log("\tappend to index failed")
                } else {
                    console.log("\tPUT index Worked", indexfile)
                }
            })
            //s.write(JSON.stringify('{"message":9}'))
            s.write(JSON.stringify(index))

            s.end();


        });


    } else if (r.method === "GET") {
       
        if (querystring.action === 'cv') {
            
            printTime('file', file, verbose)
            
            fs.readFile('./data/' + file, function (err, data) {
                if (!data) {
                    printTime('Data is empty', '', verbose)
                    
                } else {
            //        console.log('data:',JSON.stringify(data))
                    
                    //let array = data.toString().split('<<EVENT>>\r\n');
                    
                    //printTime('array', array.length, verbose)
                    
                    //let string = JSON.stringify(data)
                    let string = JSON.stringify(data)
                    console.log('string:', string)
                   
                    s.write(string)
                    s.end();
                }

            })
        } else if (querystring.action === 'index') {
            
            fs.readFile(indexfile, function (err, data) {
                if (!data) {
                    printTime('index is empty', '', verbose)
                    
                    //console.log('index is empty')
                } else {

                    

                    
                    let array = data.toString().split('<<EVENT>>\r\n');
                    

                    //printTime('array', array, verbose)
                    printTime('array', array.length, verbose)
                    printTime('array', array, verbose)
                    //if (false) {
                        //s.write(JSON.stringify(array))
                    //}
                    //s.write({})
                    printTime('return message', JSON.stringify('{"x":"hello"}'), verbose)
                    printTime('return message', JSON.stringify({'message':9}), verbose)
                   // s.write(JSON.stringify("{'total':40}"))
                    s.write(JSON.stringify({'message':'hi'}))
                    //s.write(9)
                    s.end();
                    
                }

            })
            

        }
        printTime('sending end', '', verbose)
       
        s.end();
       


    }
    printTime('-------', '', verbose)
    
}).listen(port);