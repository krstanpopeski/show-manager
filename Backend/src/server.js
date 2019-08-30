const User = require("./User.js");
const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const withAuth = require('./middleware');
var cors = require('cors');

const secret = 'thegreatestgiginthesky';


mongoose.connect('mongodb://localhost/kiko');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors({credentials:true,origin:true}));

app.post('/api/register', function(req,res){
    const {firstname,lastname,email,password} = req.body;
    const user = new User({firstname,lastname,email,password});
    User.findOne({ email }, function(err, user2){
        if(user2){
            res.status(500).json({error:"Email already exists."});
        }
        else{
            user.save(function(err){
                if(err){
                    res.status(500).
                    json({error: "Something went wrong, please try again."});
                } else {
                    res.sendStatus(200);
                }
            });
        }
    })
    
});

app.post('/api/authenticate', function(req,res){
    const{email,password} = req.body;
    User.findOne({ email }, function(err,user){
        if(err){
            res.status(500).json({error:'Internal error please try again.'});
        }
        else if(!user){
            res.status(401).json({
                error:'Incorrect email or password!'
            });
        } 
        else{
            user.isCorrectPassword(password,function(err,same){
                if(err){
                    res.status(500).json({
                        error: 'Internal error please try again.'
                    });
                }
                else if(!same){
                    res.status(401).json({
                        error: 'Incorrect email or password.'
                    });
                }
                else{
                    const payload = { email,firstname:user.firstname,lastname:user.lastname };
                    const token = jwt.sign(payload,secret, {expiresIn: '1h'});
                    res.json({user:user,token:token});
                }
            });
        }
    });
});

app.get('/checkToken', withAuth, function(req,res){
    res.status(200).json(req.user);
});

app.get('/api/test', function(req,res){
    res.send("Response Test");
});

app.post('/api/addShow', function(req,res){
    var show = {name: req.body.name, id: req.body.id};
    const { email } = req.body;
    User.findOneAndUpdate({email}, {$push: {shows:show}}, {new:true},function(err,doc){
        if(err){
            res.sendStatus(500);
        }
        else{
            res.sendStatus(200);
        }
    });
});

app.post('/api/shows', function(req,res){
    const { email } = req.body;
    User.findOne({ email }, function(err,user){
        if(!user){
            res.status(500).json({error:"The user does not exist."});

        }
        else{
            res.status(200).json(user);
        }
    })
})

app.listen(3001, () => console.log("Server started."));