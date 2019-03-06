var mongodb = require('mongodb');
var db_util = require('./db_utils');

const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'blog';
const client = new MongoClient(url);

client.connect(async function(err) {
    if(err) client.close();
    const db = client.db(dbName);
    await db.collection('article_infos').insertMany([{
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
    }]).catch(e => console.log(e));
    console.log('init finished');
    client.close();
})