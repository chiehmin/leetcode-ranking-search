<template>
  <div id="app" class="px-5">
    <b-navbar toggleable="lg" type="dark" variant="info" class="mb-2">
      <b-navbar-brand href="#">{{ unSlugTitle }}</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item to="/">All Contests</b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <b-container fluid class="p-0">
      <b-row align-h="between">
        <b-col sm="5">
          <b-pagination
            v-model="currentPage"
            :total-rows="total"
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
      :items="rank"
      :per-page="perPage"
      :current-page="currentPage"
      :busy="isBusy"
      :filter="filterTrigger"
      :filter-function="filterFunc"
      :filter-included-fields="filteredOn"
      @filtered="onFiltered"
      >
      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <template v-slot:cell(username)="row">
        <b-link :href="profileLink(row.value, row.item.data_region)" target="_blank">{{ row.value }}</b-link>
      </template>
    </b-table>

  </div>
</template>

<script>
import DataService from '@/services/DataService.js'

export default {
  name: "Contest",
  components: {
  },
  data() {
    return {
      title: "",
      perPage: 25,
      currentPage: 1,
      fields: ['rank', 'username', 'country_name', 'score', 'finish_time', 'data_region'],
      rank: [],
      userFilter: "",
      filteredOn: ["username", "country_name"],
      totalRows: null,
      isBusy: true,
      countryFilter: "All",
      countryList: ["All"],
    };
  },
  computed: {
    total: function () {
      return this.totalRows || this.rank.length;
    },
    unSlugTitle: function () {
      var words = this.title.split("-");
      for (var i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].substr(1);
      }
      return words.join(" ");
    },
    filterTrigger: function() {
      return this.countryFilter + this.userFilter;
    },
  },
  created: function () {
    this.loadCountry();
    this.loadData();
  },
  methods: {
    loadCountry: function() {
      DataService.getCountry()
        .then(function (resp) {
          let tmpList = [];
          for (const [, value] of Object.entries(resp.data)) {
            tmpList.push(value);
          }
          tmpList.sort();
          this.countryList = this.countryList.concat(tmpList);
        }.bind(this));
    },
    loadData: function () {
      var contest = new URLSearchParams(new URL(document.URL).search).get("contest");
      contest = contest ? contest : 'latest';

      // loading contest data
      DataService.getContest(contest)
        .then(function (resp) {
          this.isBusy = false;
          this.rank = resp.data;
        }.bind(this));

      this.title = contest;
    },
    filterFunc: function(row, ) {
      return this.filterUser(row) && this.filterCountry(row);
    },
    filterUser: function (row) {
      return (row.username.toLowerCase().startsWith(this.userFilter.toLowerCase())) ? true : false;
    },
    filterCountry: function(row) {
      if ("All" === this.countryFilter) {
        return true;
      }
      return (row.country_name != null &&
        row.country_name.toLowerCase() === this.countryFilter.toLowerCase());
    },
    onFiltered: function (filteredItems) {
      this.currentPage = 1;
      this.totalRows = filteredItems.length;
    },
    profileLink: function(username, data_region) {
      if ("CN" == data_region) {
        return `https://leetcode-cn.com/u/${username}`;
      } else {
        return `https://leetcode.com/${username}`;
      }
    },
  },
};
</script>

<style>
</style>
