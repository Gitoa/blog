var express = require('express');
var assert = require('assert');
var history = require('connect-history-api-fallback');
const MongoClient = require('mongodb').MongoClient;
const dbURL = 'mongodb://localhost:27017';
const db_utils = require('./db_utils');
const client = new MongoClient(dbURL);


var data = [];

var fs = require('fs');
let app = express();
var info = {};

app.use(history({
    rewrites: [
        {
            from: /\/article_list/, to(context) {return context.parsedUrl.pathname}
        },
        {
            from: /\/article_info\/\d+/, to(context) {return context.parsedUrl.pathname}
        }
    ]
}));

app.use(express.static(__dirname + '/static'));

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
})
app.get(/\/(index.html)?$/, function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream('index.html').pipe(res);
})
app.get('/article_list', async function(req, res, next) {
    await client.connect();
    const db = client.db('blog');
    data = await db_utils.findDocuments(db, 'article_infos', {}).catch(e => console.log(e));
    res.writeHead(200);
    res.end(JSON.stringify(data));
    console.log('\n \n \n')
})
app.get('/article_info/:id', function(req, res, next) {
    res.writeHead(200);
    let id = req.params['id'];
    res.end(JSON.stringify(id));
    console.log(id);
})
app.get('*', function(req,res, next){
    res.writeHead(404);
    res.end('404 Not Found')
})

app.listen(3000);
