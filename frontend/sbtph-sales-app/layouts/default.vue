<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1">
      <TopNavbar />
       <NuxtPage />
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/sidebar_menu.vue";
import TopNavbar from "@/components/navigation_bar.vue";

export default {
  components: {
    Sidebar,
    TopNavbar,
  },
};
</script>
