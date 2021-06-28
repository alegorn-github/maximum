const http = require('http');
const url = require('url');
const request = require('request');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3003;

const server = http.createServer((req, res) => {

    const queryObject = url.parse(req.url,true).query;

    const baseURL = 'http://' + req.headers.host + '/';
    const reqUrl = new URL(req.url,baseURL);

    let requestUrl = reqUrl.searchParams.get('url');

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
        const pathToFile = url.parse(req.url,true).path === '/'?'index.html':__dirname +  url.parse(req.url,true).path;
        res.writeHead(200, { 'content-type': 'text/html' })
        fs.createReadStream(pathToFile).pipe(res)
    }
});

server.listen(port, () => {
    console.log(`Maxreader running at http://${hostname}:${port}/`);
});