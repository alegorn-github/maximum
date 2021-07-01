const http = require('http');
const url = require('url');
const request = require('request');
const fs = require('fs');
const commander = require('commander');

const hostname = 'localhost';
const port = 3003;

commander.option('-s, --server <url>','Server 1S URL and port')
    .option('-u, --user <user>','Server 1S user name')
    .option('-p, --password <password>','Server 1S password')
commander.parse(process.argv);
const options = commander.opts();

const serverUrl = options.server;
const serverUser = options.user;
const serverPass = options.password;

const server = http.createServer((req, res) => {

    const baseURL = 'http://' + req.headers.host + '/';
    const reqUrl = new URL(req.url,baseURL);

    let requestUrl = reqUrl.searchParams.get('url');
    const getServerUrlFromCLI = reqUrl.searchParams.get('cli');
    if (getServerUrlFromCLI){
        let paramString = '?' + reqUrl.searchParams.toString();
        requestUrl = serverUrl + paramString;
    }
    
    console.log(requestUrl);

    if (requestUrl){

        request(requestUrl, { json: true }, (perr, pres, pbody) => {
            if (perr) { return console.log(perr); }
            
            res.statusCode = pres.statusCode;
            if (res.statusCode < 400){
                res.setHeader('Content-Type', 'application/json');
                if (getServerUrlFromCLI){
                    res.setHeader("Authorization", "Basic " + Buffer.from(serverUser + ":" + serverPass).toString('base64'));
                }
            res.end(JSON.stringify(pbody));    
            }
            else {
                res.end(pbody);
            }
        });        
    }
    else {
        const pathToFile = reqUrl.pathname === '/'? __dirname + '/index.html': __dirname +  reqUrl.pathname;
        res.writeHead(200, { 'content-type': 'text/html' })
        fs.createReadStream(pathToFile).pipe(res)
    }
});

server.listen(port, () => {
    console.log(`Maxreader running at http://${hostname}:${port}/`);
});