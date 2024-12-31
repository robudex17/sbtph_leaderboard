<script>
export default {
  data() {
    return {
      searchQuery: "",
      notifications: [
        { id: 1, message: "John Doe reached his sales target!" },
        { id: 2, message: "New sales report available." },
      ],
      showNotifications: false,
      viewMode: "card", // Default view mode
    };
  },
  methods: {
    search() {
      console.log("Searching for:", this.searchQuery);
      // Add search logic here
    },
    toggleTheme() {
      document.body.classList.toggle("dark-mode");
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },
    toggleViewMode() {
      this.viewMode = this.viewMode === "card" ? "table" : "card";
    },
  },
};
</script>
