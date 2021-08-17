module.exports = {
    publicPath: "/leetcode-ranking-search",
    pages: {
        index: {
            entry: "src/main.js",
            template: "public/index.html",
            filename: "index.html",
            title: "Leetcode Ranking Search",
            chunks: ["chunk-vendors", "chunk-common", "index"]
        },
        contest: {
            entry: "src/contest.js",
            template: "public/index.html",
            filename: "contest.html",
            title: "Contest Ranking",
            chunks: ["chunk-vendors", "chunk-common", "contest"]
        },
        global_ranking: {
            entry: "src/global_ranking.js",
            template: "public/index.html",
            filename: "global_ranking.html",
            title: "Global Ranking",
            chunks: ["chunk-vendors", "chunk-common", "global_ranking"]
        },
    }
};
