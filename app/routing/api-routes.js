//JB SURVEY API Routes
const friends = require("../data/friends.js");

module.exports = function(app){

	app.get('/api/friends', function (req, res) {

		friends.getCurrentList()
			.then( (allPeeps)=> res.json(allPeeps) )
			.catch( (err)=> {if (err) console.log(err)} );
	});

	app.post('/api/friends', function (req, res){

		friends.frenemyMatch(req.body).then((friend)=>{
			res.json(friend);
		}).catch((err)=>{if (err) console.log(err);});

	});
}