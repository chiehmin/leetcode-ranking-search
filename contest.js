var app = new Vue({
  el: '#app',
  data: {
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
  },
  computed: {
    total: function () {
      return this.totalRows || this.rank.length;
    },
    unSlugTitle: function () {
      words = this.title.split("-");
      for (var i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].substr(1);
      }
      return words.join(" ");
    },
    filterTrigger: function() {
      return this.countryFilter + this.userFilter;
    },
  },
  methods: {
    loadCountry: function() {
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
      contest = new URLSearchParams(new URL(document.URL).search).get("contest");
      contest = contest ? contest : 'latest';

      // loading contest data
      axios.get('data/' + contest + '.json')
        .then(function (resp) {
          this.isBusy = false;
          this.rank = resp.data;
        }.bind(this));

      this.title = contest;
    },
    filterFunc: function(row, _) {
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
    profileLink: function(username) {
      return `https://leetcode.com/${username}`;
    },
  },
  mounted: function () {
    this.loadCountry();
    this.loadData();
  }
});
