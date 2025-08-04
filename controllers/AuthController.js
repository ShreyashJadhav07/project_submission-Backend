
const jwt=require('jsonwebtoken');
const util=require("util");
const UserModel = require('../Model/UserModel');
const promisify=util.promisify;
const promisifiedJWTsign=promisify(jwt.sign);
const promisifiedJWTverify=promisify(jwt.verify);


const {JWT_SECRET_KEY} = process.env;


const SECRET_KEY = JWT_SECRET_KEY || 'temporary-fallback-secret-key-123';

async function signupHandler(req,res) {
    try{
 
     
       const userObject=req.body;
        if(!userObject.email || !userObject.password){
            return res.status(400).json({
                message:"Bad request: Email and Password are required",
                status:"error"
            })
        }

        const user=await UserModel.findOne({email: userObject.email});
        if(user){
            return res.status(400).json({
                message:"Bad Request: User Already Exists",
                status:"error"
            })
        }
        
        const newUser=await UserModel.create(userObject);
        
      
        const authToken=await promisifiedJWTsign({id: newUser['_id']}, process.env.JWT_SECRET_KEY);
        
        res.cookie("jwt",authToken,{
            maxAge: 1000 * 60 * 60 * 24,
            secure: false,
            httpOnly: true,
            sameSite: 'lax'
        })
        
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
            status: "success"
        }); 
    }
    catch(err) {
        console.error("Error in signupHandler:", err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function loginHandler(req,res) {
    try{
        const {email,password}=req.body;
        const user=await UserModel.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"user does not Exist",
                status:"error"
            })
        }
        
        const areEqual = password == user.password;
        if(!areEqual){
            return res.status(400).json({
                message: "Bad Request: Password is incorrect",
                status: "error"
            })
        }
        
        const authToken=await promisifiedJWTsign({id: user['_id']}, process.env.JWT_SECRET_KEY);
        
        res.cookie("jwt", authToken, {
            maxAge: 1000 * 60 * 60 * 24,
            secure: false,
            httpOnly: true,
            sameSite: 'lax'
        });

        res.status(200).json({
            message: "Login successful",
            status: "success",
            user: user
        });
    }
    catch(err) {
        console.error("Error in loginHandler:", err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

const logoutController = function (req,res){
    res.cookie("jwt" , "", {
        maxAge: 0,
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });
    
    res.status(200).json({
        status: "success",
        message: "user logged out",
    });
}



async function protectRouteMiddleware(req, res, next) {
    try {
        

     
        let token = req.cookies.jwt;
       
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); 
            }
        }
        
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - no token",
                status: "failed"
            });
        }
        
        const decryptedToken = await promisifiedJWTverify(token, process.env.JWT_SECRET_KEY);
        
        req.userId = decryptedToken.id;
        next();
    } catch (err) {
        console.error("Error in protectRouteMiddleware:", err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
module.exports = {
    signupHandler,
    loginHandler,
    logoutController,
    protectRouteMiddleware
}