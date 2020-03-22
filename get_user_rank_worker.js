onmessage = function(e) {
  let user = e.data[0], contest = e.data[1], startTime = e.data[2], contestData = e.data[3];
  for (let userRank of contestData) {
    if (userRank.username == user) {
      postMessage({"contest": contest, "startTime": startTime, "rank": userRank.rank, "participants": contestData.length});
    }
  }
  postMessage({});
}
