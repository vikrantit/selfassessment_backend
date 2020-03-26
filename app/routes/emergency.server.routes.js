const user= require('../controller/user.server.controller');
const auth= require('../middleware/auth');

module.exports = function(app) {
	
   app.post('/emergency', auth, user.emergency);

   
};