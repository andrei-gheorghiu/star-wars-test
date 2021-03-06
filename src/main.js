import Vue from 'vue'
import App from './App.vue'
import VueMoment from 'vue-moment'
import Axios from 'axios'
import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'
import Row from 'bootstrap-vue/es/components/layout/row'
import Col from 'bootstrap-vue/es/components/layout/col'
import Table from 'bootstrap-vue/es/components/table/table'
import Modal from 'bootstrap-vue/es/components/modal/modal'
import Button from 'bootstrap-vue/es/components/button/button'
import vBTooltip from 'bootstrap-vue/es/directives/tooltip/tooltip';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/one-page.scss'

Vue.use(VueMoment);
Vue.prototype.$http = Axios;

Vue.component('b-row', Row);
Vue.component('b-col', Col);
Vue.component('b-table', Table);
Vue.component('b-modal', Modal);
Vue.component('b-btn', Button);
Vue.component('b-form-checkbox', bFormCheckbox);
Vue.directive('b-tooltip', vBTooltip);

Vue.config.productionTip = false;

new Vue({
	render: h => h(App)
}).$mount('#app');
