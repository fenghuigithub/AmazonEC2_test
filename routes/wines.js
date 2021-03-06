var mongo = require('mongodb');

// var Server = mongo.Server,
    // Db = mongo.Db,
var BSON = mongo.BSONPure;

var server = new mongo.Server('localhost', 27017, {auto_reconnect: true});
var db = new mongo.Db('winedb', server);

db.open(function(err, db) {
	if(err){
		console.log('Connection error',err);
	}
    else {
        console.log("Connected to 'winedb' database");
        db.collection('wines', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'wines' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});




// var ObjectId = require('mongodb').ObjectID;

exports.findById = function(req, res) {
    
    
    console.log('Retrieving wine: ' + 1);
    db.collection('wines', function(err, collection) {
    	// console.log('Test findOne1');
    	// if(!id){
    	// 	console.log("..");
    	// 	return;
    	//}
    	if(err){
    		throw err;
    	}
    	else{
    		collection.findOne({'_id': new require('mongodb').ObjectID(req.params.id)}, function(err, item) {
        	
        	if(item){
        		// console.log('Test findOne3');
        		res.send(item);
        	}
        	else if(!item){
        		console.log("No item...");
        	}
            if(erro){
            	console.log("ERROT..");
            }
        });
    	}
        
    });
};

exports.findAll = function(req, res) {
    db.collection('wines', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addWine = function(req, res) {
    var wine = req.body;
    console.log('Adding wine: ' + JSON.stringify(wine));
    db.collection('wines', function(err, collection) {
        collection.insert(wine, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateWine = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    console.log('Updating wine: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('wines', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating wine: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(wine);
            }
        });
    });
}

exports.deleteWine = function(req, res) {
    var id = req.params.id;
    console.log('Deleting wine: ' + id);
    db.collection('wines', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}



/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var wines = [
    {
        name: "CHATEAU DE SAINT COSME",
        year: "2009",
        grapes: "Grenache / Syrah",
        country: "France",
        region: "Southern Rhone",
        description: "The aromas of fruit and spice...",
        picture: "saint_cosme.jpg"
    },
    {
        name: "LAN RIOJA CRIANZA",
        year: "2006",
        grapes: "Tempranillo",
        country: "Spain",
        region: "Rioja",
        description: "A resurgence of interest in boutique vineyards...",
        picture: "lan_rioja.jpg"
    }];

    db.collection('wines', function(err, collection) {
        collection.insert(wines, {safe:true}, function(err, result) {});
    });

};