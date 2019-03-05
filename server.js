var express = require('express');
var fs = require('fs');

let app = express();

var data = [{
    id: 1,
    title: 'article1',
    shortcut: 'this is the shortcut of article1',
    view: 20,
    comments: 1,
    time: '2019-02-11'
},
{
    id: 2,
    title: 'article2',
    shortcut: 'this is the shortcut of article2',
    view: 18,
    comments: 2,
    time: '2019-03-05'
}];

var info = {};

app.use(express.static(__dirname + '/static'));

app.use(function(req, res, next) {
    console.log('new req', req.method, req.url);
    if(req.url == '/' && req.method.toLowerCase() == 'get') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('index_prod.html').pipe(res);
    };
    if(req.url == '/article_list' && req.method.toLowerCase() == 'get') {
        res.writeHead(200);
        res.end(JSON.stringify(data));
    };
    if(req.url == '/aritilce_info' && req.method.toLowerCase() == 'get') {
        res.writeHead(200);
        res.end(JSON.stringify(info));
    }
    next();
})

app.listen(3000);
