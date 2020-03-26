const user= require('../controller/user.server.controller');
const auth= require('../middleware/auth');

// Define the routes module' method
module.exports = function(app) {
	
  app.post('/register', user.register);

  app.post('/login', user.login);

  app.post('/reportnurse',auth, user.reportnurse);

  app.get('/listallreports', auth , user.listallreports);

  app.post('/listbyemail', auth, user.listbyemail);

  app.post('/reportuser', auth, user.reportuser );

  app.get('/read_cookie', user.findtoken);
 
};