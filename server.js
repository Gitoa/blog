var express = require('express');
var assert = require('assert');
var bodyParser = require('body-parser');
var history = require('connect-history-api-fallback');
const MongoClient = require('mongodb').MongoClient;
const dbURL = 'mongodb://localhost:27017';
const db_utils = require('./db_utils');
const client = new MongoClient(dbURL);
client.connect();

var data = [];

var fs = require('fs');
let app = express();
var info = {};

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.text());
app.use(bodyParser.json())

app.use(history({
    rewrites: [
        {
            from: /^\/article_list$/, to(context) {return context.parsedUrl.pathname}
        },
        {
            from: /^\/article_info\/\d+$/, to(context) {return context.parsedUrl.pathname}
        },
        {
            from: /^\/comments\/\d+$/, to(context) {return context.parsedUrl.pathname}
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
    const db = client.db('blog');
    data = await db_utils.findDocuments(db, 'article_infos', {}).catch(e => console.log(e));
    console.log(data);
    res.writeHead(200);
    res.end(JSON.stringify(data));
    console.log('\n \n \n')
})
app.get('/article_info/:id', async function(req, res, next) {
    let id = req.params['id'];
    const db = client.db('blog');
    let [article_data] = await db_utils.findDocuments(db, 'article', {id: parseInt(id)}).catch(e => console.log(e));
    console.log(article_data);
    res.writeHead(200);
    res.end(JSON.stringify(article_data));
})
app.get('/comments/:a_id', async function(req, res, next) {
    let a_id = req.params['a_id'];
    const db = client.db('blog');
    let comment_data = await db_utils.findDocuments(db, 'comment', {article_id: parseInt(a_id)}).catch(e => console.log(e));
    console.log(comment_data);
    res.writeHead(200);
    res.end(JSON.stringify(comment_data));
})
app.get('*', function(req,res, next){
    res.writeHead(404);
    res.end('404 Not Found')
})
app.post('/comment/:id', async function(req, res, next) {
    let comment = req.body;
    console.log(comment);
    const db = client.db('blog');
    await db_utils.insertDocuments(db, 'comment', comment)
    console.log('success');
    res.writeHead(200);
    res.end(JSON.stringify([]));
})

app.listen(3000);
