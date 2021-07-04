const MongoClient = require( 'mongodb' ).MongoClient;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.DATABASE_URL;

var _db;

const createServer = async ( callback ) => {
  await mongoose.connect( url,  { useNewUrlParser: true, useUnifiedTopology: true }, function( err, client ) {
    _db  = client.db('flowerworks');
    return callback( err );
  } );
}
const createServer1 = async ( callback ) => {
  await mongoose.connect( url,  { useNewUrlParser: true, useUnifiedTopology: true });
  _db  = mongoose.connection;
}

module.exports = {
  connectToServer: createServer1,
  getDb: function() {
    return _db;
  }
};