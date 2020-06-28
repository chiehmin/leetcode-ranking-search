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
  axios.get('data/' + slugTitle(contest) + '.json')
    .then(function(resp){
      let contestData = resp.data;
      for (let userRank of contestData) {
        if (userRank.username.toLowerCase() == user.toLowerCase()) {
          postMessage({"contest": contest, "startTime": startTime, "rank": userRank.rank, "participants": contestData.length});
        }
      }
      postMessage({});
    }.bind(this));
}
