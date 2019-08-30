const jwt = require('jsonwebtoken');
const secret = "thegreatestgiginthesky";

const withAuth = function(req,res,next){
    var token = req.headers['authorization'];
    if(!token){
        res.status(401).json({error: 'Unauthorized: No token provided.'});
    }
    else{
        jwt.verify(token,secret,function(err,decoded){
            if(err){
                res.status(401).json({error: 'Unauthorized: No token provided'});
            }
            else{
                jwt.verify(token,secret,function(err,decoded){
                    if(err){
                        res.status(401).json({error:'Unauthorized: Invalid token'});
                    }
                    else{
                        req.user = decoded;
                        next();
                    }
                });
            }
        });
    }
}

module.exports = withAuth;