import {  Schema ,models, model } from "mongoose";

const UserSchema  = new Schema (
    {
        email : {type:"string" ,required : true , unique :true } ,
        username : {type :"string" ,required :true , unique :true } ,
        password : {type : "string" , required :true , unique :true}
    } ,
    {
        timestamps :true 
    }
)

const User = models.User || model("User" ,UserSchema)
export default User ;

//PASSWORD s4rNoJvd9uDAOJmV