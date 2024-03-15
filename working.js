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
    
    let q=req.url.split('?'),result={};
    
    if(q.length>=2){
        q[1].split('&').forEach((item)=>{
             try {
               result[item.split('=')[0]]=item.split('=')[1];
             } catch (e) {
               result[item.split('=')[0]]='';
             }
        })
    }
    
    return result;
  }

var http = require('http');

const fs = require('fs');
const { url } = require('url');
const queryString = require('querystring');

let currentDate= new Date()
console.log('Server Starting listener', currentDate.toUTCString())

const args = getArgs();
const dir = './data/'

var port = args.port


if (!port) {
    port=3000
}
var count = 0
const separator = '<<EVENT>>\r\n'

console.log('Server Port:',port)



http.createServer((r, s) => {
    console.log('print method:',r.method)
    var querystring=params(r)
    console.log('parameters',querystring)
    file= querystring.file
    if(!file){
        console.log('file is not set')
        return
    }
    
   path='./data/'+file
   // path='./data/'+'2'
   console.log('new full file:',file)
   console.log('new full path:',path)
    
    count++
    let returnval = 'returnval'
    console.log('in backend',r.url,r.method)
    //console.log('in backend all',r)
    if (r.method == "PUT") {
        console.log('\tRequest put',path)
        let body = '';
        r.on('data', (chunk) => {
            body += chunk;
        });
        
        r.on('end', () => {
            //s.write("OK");
            s.end();
            console.log('\tput writing to ',path,body)
        
            fs.appendFile(path, body+separator, function (err) {
                if (err) {
                    console.log("\tappend failed")
                } else {
                    console.log("\tPUT Worked", count,path,body)
                }
            })
            
        });


    } else if (r.method == "GET") {
        
        console.log('file:',path)
        fs.readFile(path, function (err, data) {
            s.writeHead(200, { 'Content-Type': 'text/plain' });
            
            
            function notblank(value){
                return value.length>0
            }
            if (!data){
                //s.write("no file found")
                console.error("\tERROR no file found", count,file)
                let error='{"ERROR":"File not found"}'
                console.log('\tGET return:',{error})
                let jsonobj=JSON.parse(error)
                s.write(JSON.stringify(error))
                
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
            
            console.log('\tGET return:',returnval)
            
            let jsonobj=JSON.parse(returnval)
            s.write(JSON.stringify(jsonobj))
                
            return s.end();
            console.log("\tGET Worked", count,path,returnval)
        });
    }
    console.log('-------')
}).listen(port);