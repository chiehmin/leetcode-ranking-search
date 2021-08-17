<template>
  <div id="app" class="px-5 py-3">
    <b-navbar toggleable="lg" type="dark" variant="info" class="mb-2">
      <b-navbar-brand href="#">Global Ranking</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item href="index.html">All Contests</b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <a class="github-button" href="https://github.com/chiehmin" data-size="large" data-show-count="true" aria-label="Follow @chiehmin on GitHub">Follow @chiehmin</a>
    <a class="github-button" href="https://github.com/chiehmin/leetcode-ranking-search" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star chiehmin/leetcode-ranking-search on GitHub">Star</a>

    <b-container fluid class="p-0">
      <b-row align-h="between">
        <b-col sm="5">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            aria-controls="rank-table"
            ></b-pagination>
        </b-col>
        <b-col sm="3">
          <b-row align-h="end">
            <b-form-select
              v-model="countryFilter"
              :options="countryList"
            ></b-form-select>
          </b-row>
        </b-col>
        <b-col sm="4">
          <b-form-input
            v-model="userFilter"
            debounce="500"
            type="search"
            placeholder="Search a user..."
            ></b-form-input>
        </b-col>
      </b-row>
    </b-container>

    <b-table hover
      id="rank-table"
      :fields="fields"
      :items="rankProvider"
      :per-page="0"
      :current-page="currentPage"
      :filter="filterTrigger"
      >
      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <template v-slot:cell(username)="row">
        <b-link :href="profileLink(row.value)" target="_blank">{{ row.value }}</b-link>
      </template>
      <template v-slot:cell(rating)="rating">
          {{ Math.round(rating.value) }}
      </template>
    </b-table>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  components: {
  },
  data() {
    return {
      perPage: 25,
      currentPage: 1,
      fields: ['globalRanking', 'username', 'realName', 'rating', 'country'],
      rank: [],
      filteredRank: [],
      userFilter: "",
      lastFilter: "All",
      totalRows: 0,
      countryFilter: "All",
      countryList: ["All"],
    };
  },
  computed: {
    filterTrigger: function () {
      return this.countryFilter + this.userFilter;
    },
  },
  mounted: function () {
    this.loadCountry();
  },
  methods: {
    rankProvider: function(ctx) {
      if (this.rank.length === 0) {
        return axios.get('data/global-ranking.json')
                  .then(function (resp) {
                    this.rank = resp.data;
                    this.filteredRank = this.rank;
                    this.totalRows = this.rank.length;
                    let start = (this.currentPage - 1) * this.perPage;
                    return this.rank.slice(start, this.perPage);
                  }.bind(this));
      } else {
        if (this.lastFilter != ctx.filter) {
          this.currentPage = 1;
          ctx.currentPage = 1;
          this.filteredRank = this.rank.filter(this.filterFunc);
          this.totalRows = this.filteredRank.length;
          this.lastFilter = ctx.filter;
        }
        let start = (ctx.currentPage - 1) * this.perPage;
        return this.filteredRank.slice(start, start + this.perPage);
      }
    },
    loadCountry: function () {
      axios.get('./country.json')
        .then(function (resp) {
          let tmpList = [];
          for (const [, value] of Object.entries(resp.data)) {
            tmpList.push(value);
          }
          tmpList.sort();
          this.countryList = this.countryList.concat(tmpList);
        }.bind(this));
    },
    filterFunc: function (row, ) {
      return this.filterUser(row) && this.filterCountry(row);
    },
    filterUser: function (row) {
      return (row.username.toLowerCase().startsWith(this.userFilter.toLowerCase())) ? true : false;
    },
    filterCountry: function (row) {
      if ("All" === this.countryFilter) {
        return true;
      }
      return (row.country != null &&
        row.country.toLowerCase() === this.countryFilter.toLowerCase());
    },
    profileLink: function (username) {
      return `https://leetcode.com/${username}`;
    },
  },
};
</script>

<style>
</style>
