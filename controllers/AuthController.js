
// const jwt=require('jsonwebtoken');
// const util=require("util");
// const UserModel = require('../Model/UserModel');
// const promisify=util.promisify;
// const promisifiedJWTsign=promisify(jwt.sign);
// const promisifiedJWTverify=promisify(jwt.verify);
// const {JWT_SECRET_KEY} =process.env;





// async function signupHandler(req,res) {
//     try{
//         const userObject=req.body;
//         if(!userObject.email || !userObject.password){
//             return res.status(400).json({
//                 message:"Bad request :Email and Password are required",
//                 status:"error"

//             })
//         }

//         const user=await UserModel.findOne({email: userObject.email});
//         if(user){
//             return res.status(400).json({
//                 message:"Bad Request:User Already Exists",
//                 status:"error"
//             })
//         }
//         const newUser=await UserModel.create(userObject);
//         const authToken=await promisifiedJWTsign({id: newUser['id']}, JWT_SECRET_KEY);
//         res.cookie("jwt",authToken,{
//             maxAge: 1000 * 60 * 60 * 24,
//             secure: false,
//             httpOnly: true,
//             sameSite: 'lax'

//         })
//            res.status(201).json({
//             message: "User created successfully",
//             user: newUser,
//             status: "success"
//         }); 
//     }
//   catch(err) {
//         console.error("Error in signupHandler:", err);
//         res.status(500).json({
//             message: "Internal Server Error"
//         });
//     }
// }

// async function loginHandler(req,res) {
//     try{
//         const {email,password}=req.body;
//         const user=await UserModel.findOne({email});
//         if(!user){
//             return res.status(400).json({
//                 message:"user does not Exist",
//                 status:"error"
//             })
//         }
//          const areEqual = password == user.password;
//         if(!areEqual){
//             return res.status(400).json({
//                 message: "Bad Request: Password is incorrect",
//                 status: "error"
//             })
//         }
//         const authToken=await promisifiedJWTsign({id: user['_id']},JWT_SECRET_KEY);
//         res.cookie("jwt", authToken, {
//             maxAge: 1000 * 60 * 60 * 24,
//             secure:false,
//             httpOnly: true,
//             sameSite: 'lax'
//         });

//         res.status(200).json({
//             message: "Login successful",
//             status: "success",
//             user: user
//         });

// }
//     catch(err) {
//         console.error("Error in loginHandler:", err);
//         res.status(500).json({
//             message: "Internal Server Error"
//         });
//     }
// }

// const logoutController =function (req,res){
   
//     res.cookie("jwt" , "", {
//         maxAge:0,
//         httpOnly:true,
//         secure:false,
//         sameSite:'lax'
//     });
//      res.status(200).json({
//         status: "success",
//         message: "user logged out ",
//     });
// }



// async function protectRouteMiddleware(req, res, next) {
//     try {
//         const token = req.cookies.jwt;
  
        
//         if (!token) {
//             return res.status(401).json({
//                 message: "Unauthorized - no token",
//                 status: "failed"
//             });
//         }
        
//         const decryptedToken = await promisifiedJWTverify(token, JWT_SECRET_KEY);
      
        
//         req.userId = decryptedToken.id;
        
//         next();
//     } catch (err) {
//         console.error("Error in protectRouteMiddleware:", err);
//         res.status(500).json({
//             message: "Internal Server Error"
//         });
//     }
// }

// module.exports ={
//     signupHandler,
//     loginHandler,
//     logoutController,
//     protectRouteMiddleware
// }


const jwt=require('jsonwebtoken');
const util=require("util");
const UserModel = require('../Model/UserModel');
const promisify=util.promisify;
const promisifiedJWTsign=promisify(jwt.sign);
const promisifiedJWTverify=promisify(jwt.verify);

// Get JWT secret from environment (it should be loaded by now)
const {JWT_SECRET_KEY} = process.env;

// Fallback in case JWT_SECRET_KEY is still not loaded
const SECRET_KEY = JWT_SECRET_KEY || 'temporary-fallback-secret-key-123';

async function signupHandler(req,res) {
    try{
        // Debug inside the function to see current state
        console.log("=== SIGNUP DEBUG ===");
        console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);
        console.log("Using SECRET_KEY:", SECRET_KEY);
        console.log("===================");
        
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
        
        // Use the actual JWT_SECRET_KEY from environment
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
const otpGenerator = function () {
    return Math.floor(100000 + Math.random() * 900000);
}
async function forgetPasswordHandler(req, res) {
    try{
    
        if(req.body.email == undefined){
            return res.status(401).json({
                status: "fail",
                message: "please eneter the email for forget Password"
            });
        }
        const user= await UserModel.findOne({email:req.body.email});
        if(user == null){
            return res.status(404).json({
                status: "fail",
                message: "User not found with this email"
            });
        }

        const otp= otpGenerator();
        user.otp = otp;
        user.otpExpiry = Date.now() + 1000 * 60 * 10;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            message: "OTP sent successfully",
            status: "success",
            otp: otp, 
            resetURL: `http://localhost:3000/api/auth/resetPassword/${user["_id"]}`
        });

        const templateData = { name: user.name, otp: user.otp };
        await emailSender("./templates/otp.html", user.email, templateData);
 }
    catch(err){
      
        res.status(500).json({
            message:"Internal server error",
            error: err.message
        })
    }
}
async function resetPasswordHandler(req, res) {
    try {
       
        let resetDetails = req.body;
       
        if (!resetDetails.password || !resetDetails.confirmPassword
            || !resetDetails.otp
            || resetDetails.password != resetDetails.confirmPassword) {
           return res.status(401).json({
                status: "failure",
                message: "invalid request"
            })
        }
        const user = await UserModel.findOne({ email: req.body.email });
     
        if (user == null) {
            return res.status(404).json({
                status: "failure",
                message: "user not found"
            })
        }
       
        if (user.otp == undefined) {
            return res.status(401).json({
                status: "failure",
                message: "unauthorized acces to reset Password"
            })
        }

  
        if (Date.now() > user.otpExpiry) {
            return res.status(401).json({
                status: "failure",
                message: "otp expired"
            })
        }
   
        if (user.otp != resetDetails.otp) {
            return res.status(401).json({
                status: "failure",
                message: "otp is incorrect"
            })
        }
        user.password = resetDetails.password;
        user.confirmPassword = resetDetails.confirmPassword;
      
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        res.status(200).json({
            status: "success",
            message: "password reset successfully"
        })

    } catch (err) {
        
        res.status(500).json({
            message: err.message,
            status: "failure"
        })
    }
}

// async function protectRouteMiddleware(req, res, next) {
//     try {
//         const token = req.cookies.jwt;
        
//         if (!token) {
//             return res.status(401).json({
//                 message: "Unauthorized - no token",
//                 status: "failed"
//             });
//         }
        
//         const decryptedToken = await promisifiedJWTverify(token, process.env.JWT_SECRET_KEY);
        
//         req.userId = decryptedToken.id;
//         next();
//     } catch (err) {
//         console.error("Error in protectRouteMiddleware:", err);
//         res.status(500).json({
//             message: "Internal Server Error"
//         });
//     }
// }
async function protectRouteMiddleware(req, res, next) {
    try {
        console.log("=== PROTECT ROUTE DEBUG ===");
        console.log("req.cookies:", req.cookies);
        console.log("req.headers.authorization:", req.headers.authorization);
        console.log("req.body:", req.body); // This will help us see if body is being lost
        console.log("===========================");

        // Try to get token from cookies first, then from Authorization header
        let token = req.cookies.jwt;
        
        // If no cookie token, check Authorization header
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Remove 'Bearer ' prefix
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
    forgetPasswordHandler,
    resetPasswordHandler,
    protectRouteMiddleware
}