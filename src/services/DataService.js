import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/leetcode-ranking-search/',
  withCredentials: false,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getAllContestInfo() {
    return apiClient.get('data/contests.json')
  },
  getCountry() {
    return apiClient.get('country.json')
  },
  getContest(contest) {
    return apiClient.get('data/' + contest + '.json')
  },
}