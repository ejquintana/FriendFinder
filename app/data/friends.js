const fs = require("fs");

var file = './app/data/frenemies.json';

//object passed in is the user entry
function updateJson (object) {
  //if there is no friendsList.json file create one
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[" + JSON.stringify(object) + "]");
  //else read the exisiting file
  } else {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
      }
      var arr = [];
      if (data) {
        arr = JSON.parse(data);
      }
      arr.push(object);
      //Add new Haters to the frenemies file
      fs.writeFile(file, JSON.stringify(arr, null, 5), (err) => {
          if (err) console.log(err);
        });
    });
  }
}
//Pull Current Frenemies
function getCurrentList() {

  return new Promise((resolve, reject)=>{
    //Read frenemies.json
    fs.readFile(file, 'utf-8', (err, data) => {
      //if there is an error reject
      if (err) {
        reject(err);
      }
      var arr = [];
      if (data) {
        arr = JSON.parse(data);
      }
      resolve(arr);
    });
  });
}

// Frenemy matching function
function frenemyMatch (obj) {
  return new Promise((resolve, reject) => {

    getCurrentList().then((allPeeps)=>{

      var userScores = obj.scores;
      userScores.map((e)=> parseInt(e));
      //Numeric Conversion
      var nextClosestFrenemy = {
        name: '',
        photo: '',
        scores: []
      }

      var lowestDiff = 50;
      
      allPeeps.forEach((e, i)=>{
        //Computing the difference between the user and arrayed item scores
        var diffBetween = e.scores.map((e)=> parseInt(e))
          //reduces the scores array to a single value
          .reduce((accumulator, value, index)=> {
            return accumulator + Math.abs(value - userScores[index]);
          });

        if (diffBetween < lowestDiff) {
          lowestDiff = diffBetween;
          nextClosestFrenemy = allPeeps[i];
        }
      });
      //User update
      updateJson(obj);
      resolve(nextClosestFrenemy);
    }).catch((err)=>{if(err) reject(err);});
  });
}

//export functions for use in apiRoutes.js
exports.updateJson = updateJson;
exports.frenemyMatch = frenemyMatch;
exports.getCurrentList = getCurrentList;