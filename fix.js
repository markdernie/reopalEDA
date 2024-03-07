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




var params=function(req){
    //console.log('req.url:',req.url)
    let q=req.url.split('?'),result={};
    //console.log('q:',q)
    if(q.length>=2){
        q[1].split('&').forEach((item)=>{
             try {
               result[item.split('=')[0]]=item.split('=')[1];
             } catch (e) {
               result[item.split('=')[0]]='';
             }
        })
    }
    //console.log('Params result now:',result)
    return result;
  }

var http = require('http');
//var url = require('url');
const fs = require('fs');
const { url } = require('url');
const queryString = require('querystring');

let currentDate= new Date()
console.log('Server Starting listener', currentDate.toUTCString())

const args = getArgs();
const dir = './data/'
//var file = args.file
var port = args.port
// if (!file) {
//     //file='./data/file.txt'
//     file='./data/'+currentDate.getTime()
//     console.log('setting file as not sent')
// }
if (!port) {
    port=3000
}
var count = 0
const separator = '<<EVENT>>\r\n'
//console.log('Server File:',file)
console.log('Server Port:',port)
http.createServer((r, s) => {
    //var queryData = url.parse(r.url, true).query;
    //console.log('queryData:',queryData)

    //console.log('\tRequest Url:',r.url)
    //console.log('\tRequest SET r:')
    //console.log('\tRequest method:',r.method)
    //console.log('\tRequest params', params(r))
    var querystring=params(r)
    file= querystring.file
    if(!file){
        return
    }
    //console.log('file:',file)
    path='./data/'+file
    //console.log('\tpath:',path)
    // if(!file) {
    //     file='./data/'+currentDate.getTime()
    // }
    //console.log('\tRequest path:', path)
    //console.log("created server",r.method)
    //r.params=params(r); // call the function above ;
      /**
       * http://mysite/add?name=Ahmed
       */
     //console.log('file:',r.params.file) ; // display : "Ahmed"
    //}
    count++
    let returnval = 'returnval'
    if (r.method == "PUT") {
        console.log('\tRequest put',file)
        let body = '';
        r.on('data', (chunk) => {
            body += chunk;
        });
        r.on('end', () => {
            s.write("OK");
            s.end();
            console.log('\tput writing to ',file,body)
            let processed=JSON.parse(body)
            let id=JSON.parse(body).id
            file=dir+JSON.parse(body).id
            console.log('\tput id ',id)
            console.log('\tput processed ',processed)
            console.log('\tput age ',processed.age)
            fs.appendFile(file, body, function (err) {
                if (err) {
                    console.log("\tappend failed")
                } else {
                    console.log("\tPUT Worked", count,file,body)
                }
            })
            fs.appendFile(file, separator, function (err) {})
        });


    } else if (r.method == "GET") {
        //fullfile=dir+file
        //console.log('fullfile',fullfile)
        fs.readFile(path, function (err, data) {
            s.writeHead(200, { 'Content-Type': 'text/plain' });
            //console.log("OK", count,file)
            
            function notblank(value){
                return value.length>0
            }
            if (!data){
                s.write("no file found")
                console.error("\tERROR no file found", count,file)
                
                return s.end();
            }
            let array = data.toString().split('<<EVENT>>\r\n')
            array=array.filter(notblank)
            const initialValue = 'X';
            returnval = array.reduce(
                (accumulator, currentValue) =>
                    accumulator = currentValue,
                initialValue,
            );
            s.write(returnval)
            
            return s.end();
            console.log("\tGET Worked", count,file,returnval)
        });
    }
    console.log('-------')
}).listen(port);