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
        // redirect all 404 not found page to index
        not_found: {
            entry: "src/main.js",
            template: "public/index.html",
            filename: "404.html",
            title: "Leetcode Ranking Search",
            chunks: ["chunk-vendors", "chunk-common", "index"]
        },
    }
};
