const {validate, validatelogin, generateAuthToken} = require('../model/user.server.model');
const {validatereportnurse} = require('../model/reportnurse.server.model');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const User = require('mongoose').model('User');
const ReportNurse= require('mongoose').model('ReportNurse');
const ReportUser= require('mongoose').model('ReportUser');
const Emergency= require('mongoose').model('Emergency');

exports.findtoken= ( req, res) => {



  try{ 
    const token= req.cookies.token;
    console.log("to check token", token);
    res.send(token);
  }
  catch (err) {
    res.status(400).send("Something went wrong");
  }
 
};

exports.register= async(req,res) => {
  const {error} = validate(req.body);

  let user= await User.findOne( { email: req.body.email });
  if(user) return res.status(400).send('User exists');

  const user12= new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password:req.body.password,
    confirmpassword:req.body.confirmpassword,
    email: req.body.email
    });

  const salt= await bcrypt.genSalt(10);
  user12.password= await bcrypt.hash(user12.password,salt);
  user12.confirmpassword= await bcrypt.hash(user12.confirmpassword,salt);

  await user12.save();
  res.send(user12);
};

exports.login = async(req, res , next) => {
    const {error} = validatelogin(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user= await User.findOne( { email: req.body.email });
    if(!user) return res.status(400).send('Invalid Email or Password');

    const validpassword= await bcrypt.compare(req.body.password, user.password);
    if(!validpassword) return res.status(400).send('Invalid Email or Password');

    const token= user.generateAuthToken();
    console.log("token is here" ,token);

    //res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000,httpOnly: true});
    console.log("before setting cookies",req.cookies.token);
    res.cookie('token', token, { maxAge: 1000 * 60 * 15, httpOnly: true });

    console.log("cookie during login", req.cookies.token);
    res.status(200).send(token);
    //req.user= user;
    next();
};

exports.reportnurse = async(req,res) => {
  console.log("Came here");
  //const {error}= validatereportnurse(req.body);
  //if(error) return res.status(400).send(error.details[0].message);

  //console.log(req.body);

  const nurseid= req.user._id;
  console.log(nurseid);

  let nurseprofile= await User.findOne({ _id: nurseid});

  if(nurseprofile.role != 'Nurse'){
    res.status(401).send("Not Authorised");
  }
  else{ 
  console.log("nurse profile" ,nurseprofile);

  const reportNurse = new ReportNurse( {
    nurseid: req.user._id,
    nursename: nurseprofile.email,
    patientid: req.body.patientid,
    patientemail: req.body.patientemail,
    bodytemperature: req.body.bodytemperature,
    heartrate: req.body.heartrate,
    bloodpressure: req.body.bloodpressure,
    respiratoryrate: req.body.respiratoryrate,

  });

  await reportNurse.save();
  res.send(reportNurse);
}


}


exports.listallreports = async (req,res) => {
  const nurseid= req.user._id;
  console.log(nurseid);

  let nurseprofile= await User.findOne({ _id: nurseid});

  if(nurseprofile.role != 'Nurse'){
    res.status(401).send("Not Authorised");
  }
  else{


    await ReportNurse.find( {} , (err,reports)=> {
      if(err){
        return next(err);
      }

      res.send(reports);
      console.log(reports);
    })
  }
}

exports.listbyemail= async (req,res)=> {

  const nurseid= req.user._id;
  console.log(nurseid);

  let nurseprofile= await User.findOne({ _id: nurseid});

  if(nurseprofile.role != 'Nurse'){
    res.status(401).send("Not Authorised");
  }
  else{
      const patientemail= req.body.patientemail;
      console.log("Id searching for" ,patientemail)
      await ReportNurse.find( {patientemail} , (err,reports)=> {
        if(err){
          return next(err);
        }
        else{
          res.send(reports);
        }
      })

  }
}


exports.reportuser= async (req,res) => {


  const userid= req.user._id;
  console.log(userid);

  let userprofile= await User.findOne({ _id: userid});

  if(userprofile.role != 'Patient'){
    res.status(401).send("Not Authorised");
  }
  else if( userprofile.role == 'Patient'){
    const report= new ReportUser({
      patientid: userid,
      patientemail: userprofile.email,
      pulserate: req.body.pulserate,
      weight: req.body.weight,
      bloodpressure: req.body.bloodpressure,
      temperature: req.body.temperature,
      respiratoryrate: req.body.respiratoryrate
    })

    await report.save();
    res.send(report);
  }
}

exports.emergency = async(req,res)=> {
  const userid= req.user._id;
  console.log(userid);

  let userprofile= await User.findOne({ _id: userid});

  if(userprofile.role != 'Patient'){
    res.status(401).send("Not Authorised");
  }
  else if( userprofile.role == 'Patient'){
      const emergencyrep= new Emergency({
        patientid: userid,
        patientemail: userprofile.email,
        message: req.body.message,

      });
    await emergencyrep.save();
    res.send(emergencyrep);
  }
   
}