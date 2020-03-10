# Leetcode Contest Ranking Searcher

Demo site: https://fatminmin.com/leetcode-ranking-search/

## Crawling contest results

By simply executing the `crawler.py` script, the contest results will be parsed and saved into `data/<contest>.json`.

```sh
# crawling results of weekly contest 179
./crawler.py weekly-contest-179
```

## Web UI

The website is purely static which can be served on any web server directly!!

The UI is made with [Vue.js](https://vuejs.org/) and [BootstrapVue](https://bootstrap-vue.js.org/).

![sample](images/sample.png)
