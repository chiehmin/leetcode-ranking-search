var app = new Vue({
  el: '#app',
  data: {
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
  },
  computed: {
    filterTrigger: function () {
      return this.countryFilter + this.userFilter;
    },
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
          for (const [_, value] of Object.entries(resp.data)) {
            tmpList.push(value);
          }
          tmpList.sort();
          this.countryList = this.countryList.concat(tmpList);
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
    profileLink: function (username) {
      return `https://leetcode.com/${username}`;
    },
  },
  mounted: function () {
    this.loadCountry();
  }
});