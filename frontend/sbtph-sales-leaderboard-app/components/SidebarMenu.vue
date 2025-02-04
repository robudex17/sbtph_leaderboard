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
     <main :class="mainClass" class="p-6 bg-gray-100 flex flex-col">
       <slot />
     </main>
   </div>
 </template>
 
 
 <script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute(); // Access the current route

const activeMenu = ref('Leaderboard'); // Holds the name of the currently active menu
const isCollapsed = ref(false);
const submenuStates = ref({});

const menuItems = [
  { name: 'Dashboard', route: '/dashboard', icon: ['fas', 'tachometer-alt'] },
  { name: 'Leaderboard', route: '/', icon: ['fas', 'list'] },
  { 
    name: 'Analytics', 
    route: null, icon: ['fas', 'chart-bar'],
    subMenu:[
      { name: 'Overall', route: '/analytics/overall', icon: ['fas', 'users']  },
      { name: 'Market', route: '/analytics/market', icon: ['fas', 'users']  },
      { name: 'Agents', route: '/analytics/agents', icon: ['fas', 'user']}
    ] 
  
  },
  // { name: 'Reports', route: '/reports', icon: ['fas', 'file-alt'] },
  { name: 'Team Performance', route: '/team_performance', icon: ['fas', 'users'] },
  { name: 'Agent Performance', route: '/sales_agent_performance', icon: ['fas', 'users'] },
  { 
    name: 'Admin Panel',
    route: null,
    icon: ['fas', 'cog'],
    subMenu: [
      { name: 'Manage Users', route: '/admin/manage_users', icon: ['fas', 'user'] },
      { name: 'Manage Sales Agents', route: '/admin/agent/manage_sales_agents', icon: ['fas', 'user-tie'] },
      // { name: 'Manage Memos', route: '/admin/manage_memos', icon: ['fas', 'sticky-note'] },
      // { name: 'Manage Roles', route: '/admin/manage_roles', icon: ['fas', 'user-shield'] },
      // { name: 'Manage Teams', route: '/admin/manage_teams', icon: ['fas', 'users'] },
      // { name: 'Activity Log', route: '/admin/activity_log', icon: ['fas', 'clipboard-list'] },
      // { name: 'System Settings', route: '/admin/system_settings', icon: ['fas', 'cogs'] }
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

const setActiveMenuFromRoute = () => {
  const currentRoute = route.path;
  for (const item of menuItems) {
    if (item.route === currentRoute) {
      activeMenu.value = item.name;
      return;
    }
    if (item.subMenu) {
      const matchedSubItem = item.subMenu.find(subItem => subItem.route === currentRoute);
      if (matchedSubItem) {
        activeMenu.value = matchedSubItem.name;
        submenuStates.value[item.name] = true; // Open the submenu
        return;
      }
    }
  }
};




onMounted(() => {
  setActiveMenuFromRoute();
});
</script>

 
 
 <style scoped>
 aside {
   transition: width 0.3s ease-in-out;
   overflow-y: auto; /* To allow scrolling within the sidebar if needed */
   z-index: 10;
 }
 main {
   transition: margin-left 0.3s ease-in-out;
 }
 </style>
 
 