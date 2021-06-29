const http = require('http');
const url = require('url');
const request = require('request');
const fs = require('fs');

const hostname = 'localhost';
const port = 3003;

const myArgs = process.argv.slice(2);
const serverUrlFromCLI = myArgs[0];

const server = http.createServer((req, res) => {

    const queryObject = url.parse(req.url,true).query;

    const baseURL = 'http://' + req.headers.host + '/';
    const reqUrl = new URL(req.url,baseURL);

    let requestUrl = reqUrl.searchParams.get('url');
    const getServerUrlFromCLI = reqUrl.searchParams.get('cli');
    if (getServerUrlFromCLI){
        let paramString = '?';
        for (const [key, value] of reqUrl.searchParams) {
            paramString += `&${key}=${value}`;
        }
        requestUrl = serverUrlFromCLI + paramString;
    }
    
    console.log(requestUrl);

    if (requestUrl){

        request(requestUrl, { json: true }, (perr, pres, pbody) => {
            if (perr) { return console.log(perr); }
            
            res.statusCode = pres.statusCode;
            if (res.statusCode < 400){
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(pbody));    
            }
            else {
                res.end(pbody);
            }
        });        
    }
    else {
        const pathToFile = url.parse(req.url,true).path === '/'?__dirname + '/index.html':__dirname +  url.parse(req.url,true).path;
        res.writeHead(200, { 'content-type': 'text/html' })
        fs.createReadStream(pathToFile).pipe(res)
    }
});

server.listen(port, () => {
    console.log(`Maxreader running at http://${hostname}:${port}/`);
});