importScripts('https://unpkg.com/axios/dist/axios.min.js');

onmessage = function () {
  console.log("worker got message");
  axios.get('data/global-ranking.json')
    .then(function (resp) {
      postMessage({"rankingData": JSON.stringify(resp)});
    })
    .catch(function (error) {
      console.error("failed to get data/global-ranking.json");
      console.error(error);
      postMessage(null);
    });
}