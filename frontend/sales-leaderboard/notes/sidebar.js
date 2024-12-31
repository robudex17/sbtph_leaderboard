<script>
export default {
  data() {
    return {
      activeMenu: "Dashboard", // Default active menu
      menuItems: [
        { name: "Dashboard", route: "/", icon: "fas fa-tachometer-alt" },
        { name: "Leaderboard", route: "/leaderboard", icon: "fas fa-list" },
        { name: "Analytics", route: "/analytics", icon: "fas fa-chart-bar" },
        { name: "Reports", route: "/reports", icon: "fas fa-file-alt" },
        { name: "Team Performance", route: "/team-performance", icon: "fas fa-users" },
        { name: "Settings", route: "/settings", icon: "fas fa-cog" },
      ],
    };
  },
  methods: {
    navigate(route) {
      this.activeMenu = this.menuItems.find((item) => item.route === route).name;
      this.$router.push(route); // Nuxt.js navigation
    },
  },
};
</script>
