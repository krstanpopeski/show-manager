const mongoose = require('mongoose');
const mongo_uri = 'mongodb://localhost:27017/kiko'

mongoose.connect(mongo_uri, function(err){
    if(err){
        throw err;
    } else{
        console.log(`Successfully connected to ${mongo_uri}`);
    }
});