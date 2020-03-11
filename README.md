# Leetcode Contest Ranking Searcher

[![auto crawling contest data](https://github.com/chiehmin/leetcode-ranking-search/workflows/auto%20crawling%20contest%20data/badge.svg)](https://github.com/chiehmin/leetcode-ranking-search/actions)

Website: https://fatminmin.com/leetcode-ranking-search/

Leetcode contest ranking page lacks a search bar to search for the ranking of a specific user. So I implemented one.

The contest data is updated every week by setting up a scheduled pipeline using Github Actions.

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
