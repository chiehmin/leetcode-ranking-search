importScripts('https://unpkg.com/axios/dist/axios.min.js');

function slugTitle(title) {
  words = title.split(" ");
  for(var i = 0 ; i < words.length ; i++){
    words[i] = words[i].charAt(0).toLowerCase() + words[i].substr(1);
  }
  return words.join("-");
}

onmessage = function(e) {
  let user = e.data[0], contest = e.data[1], startTime = e.data[2];
  axios.get('/data/' + slugTitle(contest) + '.json')
    .then(function(resp){
      let contestData = resp.data;
      for (let userRank of contestData) {
        if (userRank.username.toLowerCase() == user.toLowerCase()) {
          let percentile = (userRank.rank * 100.0 / contestData.length).toFixed(2) + "%";
          postMessage({
            "contest": contest,
            "startTime": startTime,
            "rank": userRank.rank,
            "percentile": percentile,
            "participants": contestData.length
          });
        }
      }
      postMessage({});
    }.bind(this))
    .catch(function(error) {
      console.error("failed to retrieve contest data of " + contest);
      console.error(error);
      postMessage({});
    }) ;
}
