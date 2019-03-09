var express = require('express');
var assert = require('assert');
var bodyParser = require('body-parser');
var history = require('connect-history-api-fallback');
const MongoClient = require('mongodb').MongoClient;
const dbURL = 'mongodb://localhost:27017';
const db_utils = require('./db_utils');
const client = new MongoClient(dbURL);
const Cookies = require('cookies');
const cookieParser = require('cookie-parser');

client.connect();

var data = [];

var fs = require('fs');
let app = express();
var info = {};

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.text());
app.use(bodyParser.json())
app.use(cookieParser());

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
        },
        {
            from: /^\/signout$/, to(context) {return context.parsedUrl.pathname}
        }
    ]
}));

app.use(express.static(__dirname + '/static'));

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    console.log(req.cookies);
    next();
})
app.get(/\/(index.html)?$/, function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream('index.html').pipe(res);
})
app.get('/article_list', async function(req, res, next) {
    const db = client.db('blog');
    data = await db_utils.findDocuments(db, 'article_infos', {}).catch(e => console.log(e));
    let login = !!req.cookies.user;
    let user = req.cookies.user;
    res.writeHead(200);
    let wrapData = {login:login, user:user, data:data};
    res.end(JSON.stringify(wrapData));
    console.log('\n \n \n')
})
app.get('/article_info/:id', async function(req, res, next) {
    const db = client.db('blog');
    let id = req.params['id'];
    let [article_data] = await db_utils.findDocuments(db, 'article', {id: parseInt(id)}).catch(e => console.log(e));
    let newC = article_data.view + 1;
    console.log(newC);
    await db_utils.updateDocument(db, 'article', {id: parseInt(id)}, {view:newC}).catch(e => console.log(e));
    let [data] = await db_utils.findDocuments(db, 'article_infos', {id: parseInt(id)}).catch(e => console.log(e));
    newC = data.view + 1;
    console.log(newC);
    await db_utils.updateDocument(db, 'article_infos', {id: parseInt(id)}, {view: newC});
    console.log(article_data);
    res.writeHead(200);
    res.end(JSON.stringify(article_data));
})
app.get('/comments/:a_id', async function(req, res, next) {
    const db = client.db('blog');
    let a_id = req.params['a_id'];
    let comment_data = await db_utils.findDocuments(db, 'comment', {article_id: parseInt(a_id)}).catch(e => console.log(e));
    console.log(comment_data);
    res.writeHead(200);
    res.end(JSON.stringify(comment_data));
})
app.get('/signout', function(req, res, next) {
    console.log('signout');
    console.log('clear cookie');
    let cookies = new Cookies(req, res);
    cookies.set('user', '', {'maxAge':1});
    res.writeHead(200);
    res.end();
}) 
app.post('/comment/:id', async function(req, res, next) {
    const db = client.db('blog');
    let comment = req.body;
    let id = req.params['id'];
    console.log(comment);
    await db_utils.insertDocuments(db, 'comment', comment);
    let [article_data] = await db_utils.findDocuments(db, 'article', {id: parseInt(id)}).catch(e => console.log(e));
    let newC = article_data.comments + 1;
    await db_utils.updateDocument(db, 'article', {id: parseInt(id)}, {comments: newC}).catch(e => console.log(e));
    let [data] = await db_utils.findDocuments(db, 'article_infos', {id: parseInt(id)}).catch(e => console.Console(e));
    console.log(data);
    newC = data.comments + 1;
    console.log(data);
    await db_utils.updateDocument(db, 'article_infos', {id: parseInt(id)}, {comments: newC});
    console.log('success');
    res.writeHead(200);
    res.end(JSON.stringify([]));
})
app.post('/signin', async function(req, res, next) {
    const db = client.db('blog');
    let {account, password} = JSON.parse(req.body);
    let [p] = await db_utils.findDocuments(db, 'account', {'account': account}).catch(e => console.log(e));
    console.log(p);
    if(!p) {
        console.log('failed');
        res.writeHead(200);
        res.end(JSON.stringify({success: false, msg: 'account not exist'}))
    } else {
        if(p.password !== password) {
            res.writeHead(200);
            res.end(JSON.stringify({success: false, msg: 'wrong password'}))
        } else {//还需要设置cookie
            var cookies = new Cookies(req, res);
            cookies.set('user', p.account, {'maxAge':600000});
            res.writeHead(200);
            res.end(JSON.stringify({success: true, msg: 'login success'}))
        }
    }
})
app.post('/signup', async function(req, res, next) {
    const db = client.db('blog');
    let {account, password} = JSON.parse(req.body);
    let p = await db_utils.findDocuments(db, 'account', {'account': account}).catch(e => console.log(e));
    if(p.length != 0) {
        res.writeHead(200);
        res.end(JSON.stringify({success: false, msg:' account already existed'}));
    } else {
        await db_utils.insertDocuments(db, 'account', {account: account, password: password}).catch(e=> console.log(e));
        res.writeHead(200),
        res.end(JSON.stringify({success: true, msg: 'sign up success'}))
    }
})
app.get('*', function(req,res, next){
    res.writeHead(404);
    res.end('404 Not Found')
})

app.listen(3000);
