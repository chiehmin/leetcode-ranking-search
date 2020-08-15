var app = new Vue({
  el: '#app',
  data: {
    perPage: 25,
    currentPage: 1,
    fields: ['globalRanking', 'username', 'rating', 'country'],
    rank: [],
    userFilter: "",
    totalRows: null,
    isBusy: true,
    countryFilter: "All",
    countryList: ["All"],
  },
  computed: {
    total: function () {
      return this.totalRows || this.rank.length;
    },
    filterTrigger: function () {
      return this.countryFilter + this.userFilter;
    },
  },
  methods: {
    loadCountry: function () {
      axios.get('./country.json')
        .then(function (resp) {
          let tmpList = [];
          for (const [_, value] of Object.entries(resp.data)) {
            tmpList.push(value);
          }
          tmpList.sort();
          this.countryList = this.countryList.concat(tmpList);
        }.bind(this));
    },
    loadData: function () {
      // loading contest data
      axios.get('data/global-ranking.json')
        .then(function (resp) {
          this.rank = resp.data;
          this.isBusy = false;
        }.bind(this));
    },
    filterFunc: function (row, _) {
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
    onFiltered: function (filteredItems) {
      this.currentPage = 1;
      this.totalRows = filteredItems.length;
    },
    profileLink: function (username) {
      return `https://leetcode.com/${username}`;
    },
  },
  mounted: function () {
    this.loadCountry();
    this.loadData();
  }
});