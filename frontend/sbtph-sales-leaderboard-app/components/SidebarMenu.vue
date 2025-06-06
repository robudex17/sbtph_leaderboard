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
                    <div >
                      <font-awesome-icon :icon="subItem.icon" /> {{ subItem.name }}
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
            <!-- Logout button at the bottom -->
            <button class="logout-btn p-4 hover:bg-gray-700 cursor-pointer mt-auto " @click="logout">
              <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="pr-2" />
              <span v-if="!isCollapsed">Logout</span>
            </button>
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

      //get the current user
      const authStore = useAuthStore()
      authStore.fetchTokenFromLocalStore()
      const currentUser = authStore.state.user 

      const router = useRouter();
      const route = useRoute(); // Access the current route

      const activeMenu = ref('Leaderboard'); // Holds the name of the currently active menu
      const isCollapsed = ref(false);
      const submenuStates = ref({});
      let menuItems 

      if (currentUser.role === 'admin'){
          menuItems = [
            { name: 'Dashboard', route: null , icon: ['fas', 'tachometer-alt'],
              subMenu: [
                { name: 'month', route: '/dashboard/dashboard_month_view', icon: ['fas', 'tachometer-alt']  },
                { name: 'year', route: '/dashboard/dashboard_year_view', icon: ['fas', 'tachometer-alt']  },
                { name: 'chart-view', route: '/dashboard/dashboard_chart_view', icon: ['fas', 'tachometer-alt']},
              ]
            },
            { name: 'Leaderboard', route: '/', icon: ['fas', 'list'] },

            { 
              name: 'Feedback', 
              route: null, icon: ['fas', 'poll'],
              subMenu:[
                { name: 'BY QA', route: '/feedback/feedback_by_qa', icon: ['fas', 'users']  },
                
              ] 
            
            },
           { 
              name: 'Agent Performance', 
              route: null, 
              icon: ['fas', 'cog'],
              subMenu: [
                { name: 'Agent_Monthly', route: '/admin/agent_performance/monthly', icon: ['fas', 'user'] },
                { name: 'Agent_Yearly', route: '/admin/agent_performance/yearly', icon: ['fas', 'user'] },
              
              ]
            },
            { 
              name: 'Team Performance', 
              route: null, 
              icon: ['fas', 'cog'],
              subMenu: [
              { name: 'Team_Monthly', route: '/team_performance/month', icon: ['fas', 'users'] },
              { name: 'Team_Yearly', route: '/team_performance/year', icon: ['fas', 'users'] },
              ]
            },

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

            { 
              name: 'Admin Panel',
              route: null,
              icon: ['fas', 'cog'],
              subMenu: [
                { name: 'Manage Standard Users', route: '/admin/manage_standard_users', icon: ['fas', 'user'] },
                { name: 'Manage Sales Agents', route: '/admin/agent/manage_sales_agents', icon: ['fas', 'user-tie'] },
                { name: 'Upload Target/Shipok Sales Data', route: '/admin/upload_target_shipok_data', icon: ['fas', 'fa-upload'] },
                { name: 'Upload New Deposit Sales Data', route: '/admin/upload_new_deposit_data', icon: ['fas', 'fa-upload'] },
                // { name: 'export', route: '/admin/export_to_excel', icon: ['fas', 'fa-file-excel'] },
  

              ]
            }
          ];
      }else if (currentUser.role === 'manager' && currentUser.login_type == 'salesagentuser'  && currentUser.agent_type == 2){
        menuItems = [
            { name: 'Dashboard', route: null , icon: ['fas', 'tachometer-alt'],
              subMenu: [
                { name: 'month', route: '/dashboard/dashboard_month_view', icon: ['fas', 'tachometer-alt']  },
                { name: 'year', route: '/dashboard/dashboard_year_view', icon: ['fas', 'tachometer-alt']  },
                { name: 'chart-view', route: '/dashboard/dashboard_chart_view', icon: ['fas', 'tachometer-alt']},
              ]

            },
            { name: 'Leaderboard', route: '/', icon: ['fas', 'list'] },
            { 
              name: 'Feedback', 
              route: null, icon: ['fas', 'poll'],
              subMenu:[
              
                { name: 'LOCAL MANAGER', route: '/feedback/lm_feedback', icon: ['fas', 'users']},
              
              ] 
            },

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
            { 
              name: 'Agent Performance', 
              route: null, 
              icon: ['fas', 'cog'],
              subMenu: [
                { name: 'Agent_Monthly', route: '/agent_performance/month', icon: ['fas', 'user'] },
                { name: 'Agent_Yearly', route: '/agent_performance/year', icon: ['fas', 'user'] },
                { name: 'Analytics', route: '/agent_performance/analytics', icon: ['fas', 'user'] },
              ]
            },
            { 
              name: 'Team Performance', 
              route: null, 
              icon: ['fas', 'cog'],
              subMenu: [
                { name: 'Team_Monthly', route: '/team_performance/month', icon: ['fas', 'users'] },
                { name: 'Team_Yearly', route: '/team_performance/year', icon: ['fas', 'users'] },
                { name: 'Analytics', route: '/team_performance/analytics', icon: ['fas', 'users'] },
              ]
            },

            { 
              name: 'Admin Panel',
              route: null,
              icon: ['fas', 'cog'],
              subMenu: [
                { name: 'Manage Standard Users', route: '/admin/manage_standard_users', icon: ['fas', 'user'] },
                { name: 'Manage Sales Agents', route: '/admin/agent/manage_sales_agents', icon: ['fas', 'user-tie'] },
              

              ]
            }
          ];
      }
      else if (currentUser.role === 'manager' && currentUser.login_type == 'salesagentuser'  && currentUser.agent_type == 1){
        menuItems = [
          { name: 'Dashboard', route: null , icon: ['fas', 'tachometer-alt'],
              subMenu: [
                { name: 'month', route: '/dashboard/dashboard_month_view', icon: ['fas', 'tachometer-alt']  },
                { name: 'year', route: '/dashboard/dashboard_year_view', icon: ['fas', 'tachometer-alt']  },
                { name: 'chart-view', route: '/dashboard/dashboard_chart_view', icon: ['fas', 'tachometer-alt']},
              ]

            },
            { name: 'Leaderboard', route: '/', icon: ['fas', 'list'] },
            { 
              name: 'Feedback', 
              route: null, icon: ['fas', 'poll'],
              subMenu:[
              
                { name: 'MANAGER', route: '/feedback/managers_feedback', icon: ['fas', 'users']},
                { name: 'AGENTS', route: '/feedback/agents_feedback', icon: ['fas', 'users']},
              
              ] 
            
            },

          
            { 
              name: 'Agent Performance', 
              route: null, 
              icon: ['fas', 'cog'],
              subMenu: [
                { name: 'Agent_Monthly', route: '/agent_performance/month', icon: ['fas', 'user'] },
                { name: 'Agent_Yearly', route: '/agent_performance/year', icon: ['fas', 'user'] },
                { name: 'Analytics', route: '/agent_performance/analytics', icon: ['fas', 'user'] },
              ]
            },
            { 
              name: 'Team Performance', 
              route: null, 
              icon: ['fas', 'cog'],
              subMenu: [
                { name: 'Team_Monthly', route: '/team_performance/month', icon: ['fas', 'users'] },
                { name: 'Team_Yearly', route: '/team_performance/year', icon: ['fas', 'users'] },
                { name: 'Analytics', route: '/team_performance/analytics', icon: ['fas', 'users'] },
              ]
            },

            { 
              name: 'Admin Panel',
              route: null,
              icon: ['fas', 'cog'],
              subMenu: [
                { name: 'Manage Standard Users', route: '/admin/manage_standard_users', icon: ['fas', 'user'] },
                { name: 'Manage Sales Agents', route: '/admin/agent/manage_sales_agents', icon: ['fas', 'user-tie'] },
            
              ]
            }
          ];
      }
      else if( currentUser.role == 'user' && currentUser.login_type == 'salesagentuser'  && currentUser.agent_type == 0){
      activeMenu.value = "Agent Performance"
        menuItems = [
            { 
              name: 'Feedback', 
              route: null, icon: ['fas', 'poll'],
              subMenu:[
              
                { name: 'MANAGER', route: '/feedback/managers_feedback', icon: ['fas', 'users']},
              
              
              ] 
            
            },
            { 
              name: 'Agent Performance', 
              route: null, 
              icon: ['fas', 'cog'],
              subMenu: [
                { name: 'Agent_Monthly', route: '/agent_performance/month', icon: ['fas', 'user'] },
                { name: 'Agent_Yearly', route: '/agent_performance/year', icon: ['fas', 'user'] },
                { name: 'Analytics', route: '/agent_performance/analytics', icon: ['fas', 'user'] },
              ]
            },
            { 
              name: 'Team Performance', 
              route: null, 
              icon: ['fas', 'cog'],
              subMenu: [
                { name: 'Team_Monthly', route: '/team_performance/month', icon: ['fas', 'users'] },
                { name: 'Team_Yearly', route: '/team_performance/year', icon: ['fas', 'users'] },
                { name: 'Analytics', route: '/team_performance/analytics', icon: ['fas', 'users'] },
              ]
            },
      ]
            
          
      }

      const isNotAnalytics = computed(() =>{
        if(!analyticsPath.value.includes(route.path)){
          return true
        }else{
          return false
        }
      })

      const logout = () => {
          const confirmation = window.confirm("Are you sure you want to logout?");
          if (!confirmation) {
                    return; // Exit if the user cancels the deletion
          }
          localStorage.removeItem('jwt')
          
          router.push('/login')
          location.reload()
        
      }
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
        console.log('the Route is ', route)
        const currentRoute = route.path;

        if (/^\/admin\/agent\/\d+\/details$/.test(currentRoute)) {
              submenuStates.value["Admin Panel"] = true; // Open the Admin Panel submenu
               activeMenu.value = "Manage Sales Agents";
              return;
        }

        if(currentRoute == "/agent_performance/month"){
            submenuStates.value["Agent Performance"] = true; // Open the Agent Performance submenu
            activeMenu.value = "Agent_Monthly";
            return;         
        }

        if(currentRoute == "/agent_performance/year"){
            submenuStates.value["Agent Performance"] = true; // Open the Agent Performance  submenu
            activeMenu.value = "Agent_Yearly";
            return;         
        }

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
 
 