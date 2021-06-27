const http = require('http');
const url = require('url');
const request = require('request');

const hostname = '127.0.0.1';
const port = 3003;

const server = http.createServer((req, res) => {
    let myResponse = {};

    const queryObject = url.parse(req.url,true).query;

    let requestUrl = queryObject.url;

    if (requestUrl){
        console.log("OK");

        request(requestUrl, { json: true }, (perr, pres, pbody) => {
            if (perr) { return console.log(perr); }
            
             Object.assign(myResponse,pbody) ;

             res.statusCode = 200;
             res.setHeader('Content-Type', 'application/json');
             res.setHeader('Access-Control-Allow-Origin','*');
             res.end(JSON.stringify(myResponse));
        });        
    }
    else {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Parameter "url" not found');
    }
});

server.listen(port, () => {
    console.log(`Proxy running at http://${hostname}:${port}/`);
});