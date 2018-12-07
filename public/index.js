const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey = fs.readFileSync('/etc/letsencrypt/live/nanachi.mine.bz/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/nanachi.mine.bz/fullchain.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };
const express = require('express');
const app = express();
const basePort = 0;

//// ^ Boilerplate ^


const static_options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: "index.html",
    maxAge: '2s',
    redirect: false,
    setHeaders: (res, path, stat) => {
        res.set('x-timestamp', Date.now())
    }
};
app.use(express.static('public', static_options));

app.get('/addScore', (req, res) => {

});


//// v Boilerplate v

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

(port => {
    httpServer.listen(port, () => console.log(`Http on port ${port}`));
})(basePort + 80);

(port => {
    httpsServer.listen(port, () => console.log(`Https on port ${port}`));
})(basePort + 443);