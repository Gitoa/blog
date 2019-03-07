var mongodb = require('mongodb');
var db_util = require('./db_utils');

const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'blog';
const client = new MongoClient(url);

client.connect(async function(err) {
    if(err) client.close();
    const db = client.db(dbName);
    /* await db.collection('article_infos').insertMany(//insert the short info of article
        [{
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
    }]).catch(e => console.log(e)); */
    await db.collection('article').insertMany(//insert the main content of article
        [{
            id: 1,
            title: 'article1',
            content: 'this is the main content of first article.Fighting tt',
            view: 20,
            comments: 1,
            comment_ids: ['1_1'],
            time: '2019-02-11',
        },
        {
            id: 2,
            title: 'article2',
            content: 'this is the second article',
            view: 18,
            comments: 3,
            comments_ids: ['2_1', '2_2', '2_3'],
            time: '2019-03-05'
        }
    ]).catch(e => console.log(e));
    await db.collection('comment').insertMany(
        [{
            id: '1_1',
            article_id: 1,
            user_id: 'admin',
            content: 'friendly comment',
            time: '2019-03-06',
            to_user: 'gg'
        },{
            id: '2_1',
            article_id: 2,
            user_id: 'gg',
            contnet: 'friendly comment',
            time: '2019-03-02',
            to_user: 'tt'
        },{
            id: '2_2',
            article_id: 2,
            user_id: 'admin',
            content: 'friendly comment',
            time: '2019-03-03',
            to_user: 'tt'
        },{
            id: '2_3',
            article_id: 2,
            user_id: 'admin',
            content: 'friendly comment',
            time: '2019-02-11',
            to_user: 'gg'
        }]
    ).catch(e => console.log(e)); 
    console.log('init finished');
    client.close();
})