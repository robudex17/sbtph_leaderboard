import { library } from "@fortawesome/fontawesome-svg-core";
import { faTachometerAlt, faList, faChartBar, faFileAlt, faUsers, faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons';


library.add(faTachometerAlt, faList, faChartBar, faFileAlt, faUsers, faCog, fas);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("font-awesome-icon", FontAwesomeIcon);
});
