const jwt= require('jsonwebtoken');

module.exports = function auth(req,res,next){
  const token= req.header('x-auth-token');
  console.log("Token here HOW?" , token);
  //const role= req.cookie.role;

  if(!token ) return res.status(401).send('Access Denied. No Token Provided');

  try{
    
    const decoded= jwt.verify(token, "jwtPrivateKey");
    req.user= decoded;
    console.log("Passed user" , decoded);
    
    next();
  }
  catch(ex){
    res.status(400).send("Invalid Token");
  }

  
}