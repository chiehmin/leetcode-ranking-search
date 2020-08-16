#!/usr/bin/env python3

import json
import requests

class GlobalRankingCrawler:
    _REQUEST_PAYLOAD_TEMPLATE = {
        "operationName": None,
        "variables": {},
        "query":
r'''{
    globalRanking(page: 1) {
        totalUsers
        userPerPage
        rankingNodes {
            currentRating
            currentGlobalRanking
            dataRegion
            user {
                username
                profile {
                    countryCode
                    countryName
                }
            }
        }
    }
}
'''
    }

    def __init__(self):
        self.rankItems = []

    def fetch_lastest_ranking(self):
        self.rankItems = []
        cur_page = 1
        while True:
            payload = GlobalRankingCrawler._REQUEST_PAYLOAD_TEMPLATE.copy()
            payload['query'] = payload['query'].replace('page: 1', 'page: {}'.format(cur_page))
            resp = requests.post('https://leetcode.com/graphql',
                headers = {'Content-type': 'application/json'},
                json = payload).json()

            resp = resp['data']['globalRanking']
            # no more data
            if len(resp['rankingNodes']) == 0:
                break

            for rankNode in resp['rankingNodes']:
                rankItem = {}
                rankItem['rating'] = rankNode['currentRating']
                rankItem['globalRanking'] = rankNode['currentGlobalRanking']
                rankItem['username'] = rankNode['user']['username']
                if rankNode['dataRegion'] == 'CN':
                    rankItem['country'] = 'China'
                else:
                    rankItem['country'] = rankNode['user']['profile']['countryName']

                self.rankItems.append(rankItem)

            print('Retreived ranking from page {}. {} retreived.'.format(cur_page, len(self.rankItems)))
            cur_page += 1

    def save(self):
        file_path = 'data/global-ranking.json'
        print('Save global ranking to {}'.format(file_path))
        with open(file_path, 'w') as fp:
            json.dump(self.rankItems, fp)


if __name__ == "__main__":
    crawler = GlobalRankingCrawler()
    crawler.fetch_lastest_ranking()
    crawler.save()
