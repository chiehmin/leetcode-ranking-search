<template>
  <div id="app" class="px-5 py-3">
    <b-navbar toggleable="lg" type="dark" variant="info" class="mb-2">
      <b-navbar-brand href="#">Leetcode contest ranking searcher</b-navbar-brand>
    </b-navbar>
    <a class="github-button" href="https://github.com/chiehmin" data-size="large" data-show-count="true" aria-label="Follow @chiehmin on GitHub">Follow @chiehmin</a>
    <a class="github-button" href="https://github.com/chiehmin/leetcode-ranking-search" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star chiehmin/leetcode-ranking-search on GitHub">Star</a>

    <b-container fluid class="p-0">
      <b-row align-h="between">
        <b-col sm="5">
          <b-pagination v-model="currentPage" :total-rows="total" :per-page="perPage" aria-controls="contest-table" ></b-pagination>
        </b-col>
        <b-col sm="3">
          <b-form-input v-model="filterContest" type="search" placeholder="Search a contest..."></b-form-input>
        </b-col>
        <b-col sm="4">
          <b-input-group>
            <b-form-input
              v-model="filterUser"
              type="search"
              placeholder="Search user contest history..."
              @keydown.enter.native="searchUserHistory"
            ></b-form-input>
            <b-input-group-append>
              <b-button id="user-history-submit" type="submit" variant="primary" v-on:click="searchUserHistory">Submit</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
    </b-container>

    <b-table hover id="contest-table"
      :items="contests"
      :fields="fields"
      :per-page="perPage"
      :current-page="currentPage"
      :filter="filterContest"
      :filter-included-fields="filteredOn"
      @filtered="onFiltered"
      :busy="isBusy">
      <template v-slot:head(title)="">
        Contest
      </template>
      <template v-slot:cell(title)="data">
        <b-link :href="data.item.href">{{ data.item.title }}</b-link>
      </template>
      <template v-slot:cell(startTime)="data">
        {{ timestampToDate(data.item.startTime) }}
      </template>
    </b-table>

    <b-modal ref="user-history-modal" no-close-on-backdrop :hide-footer="true" :title="userContestHistoryTitle">
      <b-table hover
        :items="userContestHistory"
        :fields="userContestHistoryFields"
        :busy="userContestBusy"
        sort-by="startTime"
        :sort-desc="true"
        show-empty
        empty-text="no contest data found.">
        <template v-slot:table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading {{ retrievedCnt }} / {{ totalContests }}...</strong>
          </div>
        </template>
      </b-table>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import UserRankingWorker from './scripts/get_user_rank_worker'

export default {
  name: 'App',
  components: {
    // HelloWorld
  },
  data() {
    return {
      perPage: 15,
      currentPage: 1,
      contests: [],
      fields: ["title", "startTime"],
      filterContest: "",
      filteredOn: ["title"],
      isBusy: true,
      totalRows: null,
      // user contest history
      filterUser: "",
      userContestHistoryFields: [{
        key: "contest",
      }, {
        key: "rank",
        // label: "Rank (Percentile)",
      }, {
        key: "percentile"
      }, {
        key: "participants"
      }],
      retrievedCnt: 0,
      userContestHistory: [],
      userContestBusy: false,
    }
  },
  computed: {
    total: function() {
      return this.totalRows || this.contests.length;
    },
    totalContests: function() {
      return this.contests.length;
    },
    userContestHistoryTitle: function() {
      return this.filterUser + "'s Contest History";
    }
  },
  mounted: function() {
    this.contests = [{
      "title": "Global Ranking",
      "href": "global_ranking.html",
      "startTime": 0,
    }];
    axios.get('data/contests.json')
      .then(function(resp) {
        this.contests = this.contests.concat(resp.data);
        this.isBusy = false;
      }.bind(this));
  },
  methods: {
    timestampToDate: function(timestamp) {
      return moment.unix(timestamp).format('YYYY-MM-DD hh:mm:ss');
    },
    onFiltered: function(filteredItems) {
      this.currentPage = 1;
      this.totalRows = filteredItems.length;
    },
    searchUserHistory: function() {
      this.userContestHistory = [];
      this.userContestBusy = true;
      this.$refs['user-history-modal'].toggle('user-history-submit');
      var worker = new UserRankingWorker;
      this.retrievedCnt = 0;
      worker.onmessage = function(e) {
        if(e.data.contest) {
          this.userContestHistory.push(e.data);
        }
        this.retrievedCnt++;
        if (this.retrievedCnt == this.contests.length) {
          this.userContestBusy = false;
        }
      }.bind(this);
      for (let contest of this.contests) {
        if (contest.title === "Global Ranking") {
          continue;
        }
        worker.postMessage([this.filterUser, contest.title, contest.startTime]);
      }
    }
  }
}
</script>

<style>
</style>
