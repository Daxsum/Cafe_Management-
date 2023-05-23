module.exports=function (error,req,res,next){
    //loging error will be there
    res.status(500).send("something failed");
}