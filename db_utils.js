
var assert = require('assert');

var db_utils = {
    insertDocuments(db, document, data) {//db:Database  document:documentName(String)  data(object||Array<object>)
        const collection = db.collection(document);
        if(Array.isArray(data)) {
            return collection.insertMany(data);
        } else {
            return collection.insertOne(data);
        }
    },
    findDocuments(db, document, field) {//db:Database  document:documentName(String) field({key: value});
        return new Promise((resolve, reject) => {
            let collection = db.collection(document);
            collection.find(field).toArray(function(err, docs) {
                if(err){
                    reject(err)
                } else {
                    console.log('found the following: ');
                    resolve(docs);
                }
            })
        })
    },
    updateDocument(db, document, field, data) {
        return new Promise((resolve, reject) => {
            const collection = db.collection(document);
            collection.updateOne(field, {$set: data}, function(err, result){
                if(err){
                    reject(err)
                } else {
                    console.log('update the document with the filed');
                    resolve(result);
                }
            })
        })
    },
    removeDocument(db, document, field) {
        const collection = db.collection(document);
        if(Array.isArray(field)) {
            return collection.deleteMany(field)
        } else {
            return collection.deleteOne(field);
        }
    },
    indexCollection(db, document, field) {
        const collection = db.collection(document);
        if(Array.isArray(field)) {
            return collection.createIndexes(field, null);
        } else {
            return collection.createIndex(field, null);
        }
    }
};

module.exports = db_utils


