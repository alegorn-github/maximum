const http = require('http');
const url = require('url');
const request = require('request');
const fs = require('fs');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const hostname = 'localhost';
const port = 3003;

const argv = yargs(hideBin(process.argv)).argv

const myArgs = process.argv.slice(2);
const serverUrlFromCLI = argv.server||argv.s;
const serverUser = argv.user||argv.u;
const serverPass = argv.password||argv.p;

const server = http.createServer((req, res) => {

    const baseURL = 'http://' + req.headers.host + '/';
    const reqUrl = new URL(req.url,baseURL);

    let requestUrl = reqUrl.searchParams.get('url');
    const getServerUrlFromCLI = reqUrl.searchParams.get('cli');
    if (getServerUrlFromCLI){
        let paramString = '?' + reqUrl.searchParams.toString();
        requestUrl = serverUrlFromCLI + paramString;
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