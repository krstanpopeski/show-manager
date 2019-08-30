const mongoose = require('mongoose');
const ShowSchema = new mongoose.Schema({
    name: String,
    id:String
});
const bcrypt = require('bcrypt');

const saltRounds = 10;


const UserSchema = new mongoose.Schema({
    firstname:{type:String, required:true},
    lastname:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    shows:[ShowSchema]
});

UserSchema.pre('save',function(next){
    if(this.isNew || this.isModified('password')){
        const document = this;
        bcrypt.hash(document.password,saltRounds,function(err,hashedPassword){
            if(err){
                next(err);
            }
            else{
                document.password = hashedPassword;
                next();
            }
        });
    } else{
        next();
    }
});

UserSchema.methods.isCorrectPassword = function(password,callback){
    bcrypt.compare(password,this.password,function(err,same){
        if(err){
            throw err;
        }
        else{
            callback(err,same);
        }
    });
}

module.exports = mongoose.model('users', UserSchema);

