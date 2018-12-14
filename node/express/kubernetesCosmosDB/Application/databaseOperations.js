var MongoClient = require("mongodb").MongoClient;
var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('connectionData.json', 'utf8'));

var connectionString = process.env.connectionString;
var stringSplit1 = connectionString.split("://")[1];
var stringSplit2 = stringSplit1.split('@');
var userNamePassword = stringSplit2[0];
userNamePassword = userNamePassword.split(':');
var userName = userNamePassword[0];
var password = userNamePassword[1];
var databaseName = obj.databaseName;
var collectionName = obj.collectionName;
connectionString = ("mongodb://" + encodeURIComponent(userName) + ":" + encodeURIComponent(password) + "@" + stringSplit2[1]);

module.exports = {

    insertDocument: function (db, itemBody, callback, errorCallback) {
        // Get the documents collection
        const collection = db.collection(collectionName);
        // Insert some documents
        collection.insertMany([
            itemBody
        ], function (err, result) {
            if (err != null) {
                errorCallback(err, 500)
            }
            callback();
        });
    },

    /**
     * Query the number of documents
     */
    queryCount: function (callback, errorCallback) {
        console.log(`Querying container:\n${collectionName}`);
        MongoClient.connect(connectionString, function (err, client) {
            if (err != null) {
                errorCallback(err, 500);
                return;
            }
            console.log("Connected correctly to server");
            var db = client.db(databaseName);
            // Get the documents collection
            const collection = db.collection(collectionName);
            // Find some documents
            collection.count(function (err, count) {
                if (err != null) {
                    errorCallback(err, 500)
                }
                console.log(`Found ${count} records`);
                callback(count);
                client.close();
            });
        });
    },

    addRecord: function (pageName, callback, errorCallback) {
        var milliseconds = (new Date).getTime().toString();
        var itemBody = {
            "id": milliseconds,
            "page": pageName
        };
        MongoClient.connect(connectionString, function (err, client) {
            if (err != null) {
                errorCallback(err, 500);
                return;
            }
            console.log("Connected correctly to server");
            var db = client.db(databaseName);
            // Get the documents collection
            const collection = db.collection(collectionName);
            // Insert some documents
            collection.insertMany([itemBody], function (err, result) {
                if (err != null) {
                    errorCallback(err, 500)
                }
                callback();
                client.close();
            });
        });
    }
}