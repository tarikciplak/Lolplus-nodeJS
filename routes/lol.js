const { json } = require('express');
const express = require('express');
const router = express.Router();
const LeagueAPI = require('leagueapiwrapper');
const dotenv = require('dotenv')

const getEnv = dotenv.config()
const key = process.env.RIOT_API_KEY

mundo = new LeagueAPI(key, Region.TR);

router.get('/mundo/:nickname', function (req, res) {

  const details = []
  mundo.getSummonerByName(req.params.nickname)
    .then(function (accountObject) {
      details.push(accountObject)
      mundo.getLeagueRanking(accountObject).then((data) => {
        details.push(data)
        object = details.reduce(function (x, y) {
          Object.keys(y).forEach(function (z) {
            x[z] = y[z];
          })
          x['soloq'] = x['0'];
          delete x['0']     
          return x
        });
        res.json(object)
      })
    })
    .catch(err => res.json(err));

});

// Router listing last 5 matches of user's
router.get('/matches/:nickname', function (req, res) {
  let matchesList = [];
  mundo.getSummonerByName(req.params.nickname)
    .then(function (accountObject) {
      // Gets match list for the account
      return mundo.getMatchList(accountObject);
    })
    .then(function (activeGames) {
      // Fetch last 5 match info
      let fiveMatches = activeGames.matches.slice(0, 5)
      res.json(fiveMatches)
    })
    .catch(err => res.json(err));

})

// Router listing weekly free champions
router.get('/freechampionslist', function(req,res){
  mundo.getFreeChampionRotation().then(function (rotationObject){
    res.json(rotationObject)
  }).catch(err => res.json(err))
})




module.exports = router;
