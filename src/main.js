import Vue from 'vue'
import App from './App.vue'
import VueMoment from 'vue-moment'
import BootstrapVue from 'bootstrap-vue'
import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox';
import Row from 'bootstrap-vue/es/components/layout/row';
import Col from 'bootstrap-vue/es/components/layout/col';
import Table from 'bootstrap-vue/es/components/table/table';

Vue.use(VueMoment, BootstrapVue);

Vue.component('b-form-checkbox', bFormCheckbox);
Vue.component('b-row', Row);
Vue.component('b-col', Col);
Vue.component('b-table', Table);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
