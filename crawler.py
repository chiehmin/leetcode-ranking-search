#!/usr/bin/env python3

import argparse
import json
import requests
import sys

def getRanking(contest):
    API_URL_FMT = 'https://leetcode.com/contest/api/ranking/{}/?pagination={}&region=global'
    page = 1
    total_rank = []
    while True:
        url = API_URL_FMT.format(contest, page)
        resp = requests.get(url).json()
        page_rank = resp['total_rank']
        if (0 == len(page_rank)):
            break
        total_rank.extend(resp['total_rank'])
        print('Retreived ranking from page {}. {} retreived.'.format(page, len(total_rank)))
        page = page + 1

    persistent_file = 'data/{}.json'.format(contest)
    print('Save retreived ranking to {}'.format(persistent_file))
    with open(persistent_file, 'w') as fp:
        json.dump(total_rank, fp)

def main():
    parser = argparse.ArgumentParser(description='Leetcode ranking crawler')
    parser.add_argument('contest', help='contest slug (ex: weekly-contest-178)')
    args = parser.parse_args()
    getRanking(args.contest)

if __name__ == "__main__":
    main()
