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
    
    if (requestUrl){
        console.log(requestUrl);
        const reqConfig = { 
            json: true,
        };
        if (serverUser && serverPass){
            reqConfig.auth = {
                user: serverUser,
                pass: serverPass,
            }
        }
        request(requestUrl, 
            reqConfig, 
            (perr, pres, pbody) => {
                if (perr) { return console.log(perr); }

                res.statusCode = pres.statusCode;
                if (res.statusCode < 400){
                    res.setHeader('Content-Type', 'application/json');
                    // if (getServerUrlFromCLI){
                    //     res.setHeader("Authorization", "Basic " + Buffer.from(serverUser + ":" + serverPass).toString('base64'));
                    //     console.log("Basic " + Buffer.from(serverUser + ":" + serverPass).toString('base64'));
                    // }
                res.end(JSON.stringify(pbody));    
                }
                else {
                    res.end(pbody);
                }
            }
        );        
    }
    else {
        const pathToFile = reqUrl.pathname === '/'? __dirname + '/index.html': __dirname +  reqUrl.pathname;
        const contentType = reqUrl.pathname.search(/\.css$/) >= 0 ? "text/css" : "text/html";
        console.log(contentType);
        res.writeHead(200, { 'content-type': contentType })
        fs.createReadStream(pathToFile).pipe(res)
    }
});

server.listen(port, () => {
    console.log(`Maxreader running at http://${hostname}:${port}/`);
});