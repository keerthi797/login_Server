const express=require('express');
const router=express.Router();

//mongodb user model
const User = require('./../models/User');
//Password Handler
const bcrypt=require('bcrypt');
//Signup

router.post('/signup',(req,res)=>{
    let{name,email,password,dateofBirth}=req.body;
    name=name.trim();
    email=email.trim();
    password=password.trim();
    dateofBirth=dateofBirth.trim();
    
    if(name==""||email==""||password==""||dateofBirth==""){
        res.json({
            status:"FAILED",
            message:"Empty input field"
        });
    }else if (!/^[a-zA-Z]*$/.test(name)){
        res.json({
            status:"FAILED",
            message:"Invalid name is entered"
        })

    }else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status:"FAILED",
            message:"Invalid email is entered"
        })
    }else if (password.length<8){
        res.json({
            status:"FAILED",
            message:"Password is too short!"
        })
    }else{
        //checkng user already exists
        User.find({email}).then(result=>{
            if(result.length){
                //if user already exists
                res.json({
                    status:"FAILED",
                    message:"User with provided email already exists"
                })

            }else{
                //Try to create a new user

                //password handling
                const saltRounds=10;
                bcrypt.hash(password,saltRounds).then(hashPassword=>{
                    const newUser=new User({
                        name,
                        email,
                        password:hashPassword,
                        dateofBirth

                    });
                    newUser.save().then(result=>{
                        res.json({
                            status:"success",
                            message:"Signup Successful",
                            data:result,
                        })

                    })
                    .catch(err=>{
                        res.json({
                            status:"FAILED",
                            message:"An error occurred while saving user account"
                        })
                    })
                })            
                .catch(err=>{
                    res.json({
                        status:"FAILED",
                        message:"An error occurred while hashing password"
                    })    
                })             

            }

        }).catch(err=>{
            console.log("err")
            res.json({
                status:"FAILED",
                message:"An error occured while checking for existing user!"              
            })

        });       
    }
})
//signin
router.post('/signin',(req, res)=>{
    let {email,password}=req.body;    
    email=  email.trim();
    password= password.trim();

    if (email == ""||password==""){
        res.json({
            status:"FAILED",
            message:"Empty cridentials supplied"
        })
    }else{
        //check if user exists
        User.find({email})
        .then(data=>{
            if (data.length){
                //user exists
                const hashPassword=data[0].password;
                bcrypt.compare(password, hashPassword).then(result=>{
                    if (result){
                    //password match
                    res.json({
                        status:"SUCCESS",
                        message:"Signin successful",
                        data:data
                    })
                }else{
                    res.json({
                        status:"FAILED",
                        message:"Invalid password entered"
                    })
                }

                })
                .catch(err=>{
                    res.json({
                        status:"FAILED",
                        message:"An error occur while comparing password"
                    })                  
                })
            }else{
                res.json({
                    status:"FAILED",
                    message:"Invalid credentials entered"    
                })               
            }
        })
        .catch(err=> {
            res.json({
                status:"FAILED",
                message:"An error occured while checking for existing user"
            })            
        })
     }
    
})

module.exports=router;