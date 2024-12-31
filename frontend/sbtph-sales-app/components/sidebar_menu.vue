<template>
  <div class="flex">
    <!-- Sidebar -->
    <aside :class="sidebarClass" class="bg-gray-800 text-white transition-all fixed h-screen">
      <div class="flex justify-between items-center p-4 text-center text-2xl font-bold border-b border-gray-700">
        <div v-if="!isCollapsed">Sales Leaderboard</div>
        <button @click="toggleSidebar" class="text-white">
          <font-awesome-icon :icon="['fas', 'bars']" />
        </button>
      </div>
      <nav>
        <ul>
          <li
            v-for="item in menuItems"
            :key="item.name"
            class="p-4 hover:bg-gray-700 cursor-pointer"
            :class="{ 'bg-blue-600': activeMenu === item.name }"
          >
            <div @click="item.subMenu ? toggleSubmenu(item.name) : activateMenu(item.name, item.route)">
              <font-awesome-icon :icon="item.icon" class="pr-1" /> 
              <span v-if="!isCollapsed">{{ item.name }}</span>
              <font-awesome-icon 
                v-if="item.subMenu" 
                :icon="['fas', submenuStates[item.name] ? 'chevron-up' : 'chevron-down']" 
                class="ml-auto" 
              />
            </div>
            <!-- Dropdown for submenus -->
            <ul v-if="item.subMenu && submenuStates[item.name]" class="ml-4 mt-2 space-y-2 ">
              <li
                v-for="subItem in item.subMenu"
                :key="subItem.name"
                class="p-2 pl-6 hover:bg-gray-600 cursor-pointer"
                :class="{ 'bg-blue-600': activeMenu === subItem.name }"
                @click="activateMenu(subItem.name, subItem.route)"
              >
                <font-awesome-icon :icon="subItem.icon" /> {{ subItem.name }}
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main :class="mainClass" class="p-6 bg-gray-100">
      <slot />
    </main>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const activeMenu = ref('Dashboard'); // Holds the name of the currently active menu
const isCollapsed = ref(false);
const submenuStates = ref({});

const menuItems = [
  { name: 'Dashboard', route: '/', icon: ['fas', 'tachometer-alt'] },
  { name: 'Leaderboard', route: '/sales_leaderboard', icon: ['fas', 'list'] },
  { name: 'Analytics', route: '/analytics', icon: ['fas', 'chart-bar'] },
  { name: 'Reports', route: '/reports', icon: ['fas', 'file-alt'] },
  { name: 'Team Performance', route: '/team-performance', icon: ['fas', 'users'] },
  { 
    name: 'Admin Panel',
    route: null,
    icon: ['fas', 'cog'],
    subMenu: [
      { name: 'Manage Users', route: '/admin/manage-users', icon: ['fas', 'user'] },
      { name: 'Manage Sales Agents', route: '/admin/manage-sales-agents', icon: ['fas', 'user-tie'] },
      { name: 'Manage Memos', route: '/admin/manage-memos', icon: ['fas', 'sticky-note'] },
      { name: 'Manage Roles', route: '/admin/manage-roles', icon: ['fas', 'user-shield'] },
      { name: 'Manage Teams', route: '/admin/manage-teams', icon: ['fas', 'users'] },
      { name: 'Activity Log', route: '/admin/activity-log', icon: ['fas', 'clipboard-list'] },
      { name: 'System Settings', route: '/admin/system-settings', icon: ['fas', 'cogs'] }
    ]
  }
];

const activateMenu = (menuName, route) => {
  activeMenu.value = menuName;
  if (route) {
    router.push(route); // Navigate to the specified route
  }
};

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const sidebarClass = computed(() => {
  return isCollapsed.value ? 'w-16' : 'w-64';
});

const mainClass = computed(() => {
  return isCollapsed.value ? 'ml-16' : 'ml-64';
});

const toggleSubmenu = (menuName) => {
  submenuStates.value[menuName] = !submenuStates.value[menuName];
};
</script>



<style scoped>
aside {
  transition: width 0.3s ease-in-out;
  overflow-y: auto; /* To allow scrolling within the sidebar if needed */
}
main {
  transition: margin-left 0.3s ease-in-out;
}
</style>

