const tips= require('../controller/tips.server.controller');
const auth= require('../middleware/auth');
// Load the 'index' controller

//const auth= require('../middleware/auth');

// Define the routes module' method
module.exports = function(app) {
	
  app.post('/addTips',auth, tips.addTips );
 
};