#!/usr/bin/env python3

import argparse
import datetime
import json
import os
import requests
import sys

def getRanking(contest):
    API_URL_FMT = 'https://leetcode.com/contest/api/ranking/{}/?pagination={}&region=global'
    page = 1
    total_rank = []
    retry_cnt = 0
    while True:
        try:
            url = API_URL_FMT.format(contest, page)
            resp = requests.get(url).json()
            page_rank = resp['total_rank']
            if (0 == len(page_rank)):
                break
            total_rank.extend(resp['total_rank'])
            print('Retrieved ranking from page {}. {} retrieved.'.format(page, len(total_rank)))
            page += 1
            retry_cnt = 0
        except:
            print(f'Failed to retrieved data of page {page}...retry...{retry_cnt}')
            retry_cnt += 1

    # discard and transform fields
    for rank in total_rank:
        rank.pop('contest_id', None)
        rank.pop('user_slug', None)
        rank.pop('country_code', None)
        rank.pop('global_ranking', None)
        finish_timestamp = rank.pop('finish_time', None)
        if finish_timestamp:
            rank["finish_time"] = datetime.datetime.fromtimestamp(int(finish_timestamp)).isoformat()

    persistent_file = 'public/data/{}.json'.format(contest)
    print('Save retrieved ranking to {}'.format(persistent_file))
    with open(persistent_file, 'w') as fp:
        json.dump(total_rank, fp)

def getContestInfo(contest):
    def unSlug(slug):
        return ' '.join([ w.capitalize() for w in slug.split('-') ])

    def isNew(contests, newContest):
        for c in contests:
            if newContest['title'] == c['title']:
                return False
        return True

    CONTEST_INFO_API_URL_FMT = 'https://leetcode.com/contest/api/info/{}/'
    resp = requests.get(CONTEST_INFO_API_URL_FMT.format(contest)).json()
    startTimestamp = int(resp['contest']['start_time'])

    newContest = {
        "title": unSlug(contest),
        "href": 'contest.html?contest={}'.format(contest),
        "startTime": startTimestamp
    }

    if os.path.exists('public/data/contests.json'):
        with open('public/data/contests.json', 'r') as fp:
            contests = json.load(fp)
    else:
        contests = []

    if isNew(contests, newContest):
        contests.append(newContest)
        contests.sort(key=lambda c : c['startTime'], reverse = True)

    with open('public/data/contests.json', 'w+') as fp:
        json.dump(contests, fp)

def main():
    parser = argparse.ArgumentParser(description='Leetcode ranking crawler')
    parser.add_argument('contest', help='contest slug (ex: weekly-contest-178)')
    args = parser.parse_args()

    getRanking(args.contest)
    getContestInfo(args.contest)


if __name__ == "__main__":
    main()
