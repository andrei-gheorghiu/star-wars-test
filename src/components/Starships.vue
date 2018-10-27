<template>
    <div>
        <div class="background-image"></div>
        <div class="overlay"></div>
        <b-row no-gutters class="full-page">
            <b-col sm="8">
                <b-row no-gutters>
                    <b-col cols="10" offset="1" class="my-5 table-transparent text-white">
                        <b-table :items="hideUnknown ? filteredShips() : ships" :fields="fields" :bordered="false"
                                 small :outlined="false" class="table-borderless" :hover="true">
                            <template slot="index" slot-scope="data">
                                {{data.index + 1}}
                            </template>
                            <template slot="name" slot-scope="data">
                                {{data.item.name}} ({{data.item.model}})
                            </template>
                            <template slot="consumables" slot-scope="data">
                                {{data.item.consumables}} <code>({{toHours(data.item.consumables)}} hrs)</code>
                            </template>
                            <template slot="stops" slot-scope="data">
                                {{parseStops(data.item).stops}}
                            </template>
                            <template slot="details" slot-scope="data">
                                <b-btn @click="selected=data.item; modalShow = !modalShow;" variant="link" size="sm">
                                    <i class="fa fa-eye-slash"></i>
                                </b-btn>

                            </template>
                        </b-table>
                        <div class="d-flex justify-content-center">
                            <div class="loader" v-show="loading"></div>
                        </div>
                    </b-col>
                </b-row>
            </b-col>
            <b-col sm="4" class="fixed-panel">
                <b-row no-gutters>
                    <b-col cols="10" offset="1" class="mt-5">
                        <b-col class="text-white">
                            <b-row no-gutters>
                                <div class="form-group col-6">
                                    <b-form-checkbox v-model="hideUnknown">
                                        Hide unknown
                                    </b-form-checkbox>
                                </div>
                                <div class="form-group col-6">
                                    <div class="input-group">
                                        <input class="form-control"
                                               v-model="distance" type="number"
                                               id="distanceInput"
                                        >
                                        <div class="input-group-append">
                                            <span class="input-group-text">MGLT</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group col-12">
                                    <input type="range" v-model="distance"
                                           min="10000" max="100000000"
                                           v-on:input="parseDistance" class="form-control-range">
                                </div>
                            </b-row>
                        </b-col>
                    </b-col>
                    <b-col cols="10" offset="1" class="mt-5">
                        <unknown-ships :ships="unknownShips(ships)"></unknown-ships>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-modal v-model="modalShow" :title="selected.name + ' [' + selected.model + ']'"
                 centered hide-footer size="lg">
            <b-row v-for="(value, propertyName) in selected" :key="propertyName">
                <b-col cols="3">{{humanizeProperty(propertyName)}}</b-col>
                <b-col cols="9">{{value}}</b-col>
            </b-row>
        </b-modal>
    </div>
</template>
<script>
	import Vue from 'vue'
	import $http from 'vue-resource'
	import UnknownShips from "./UnknowknShips.vue"

	Vue.use($http);

	export default {
		name: 'Starships',
		components: {UnknownShips},
		data() {
			return {
				title: 'Starships',
				ships: [],
				distance: 0,
				hideUnknown: false,
				loading: false,
                modalShow: false,
                selected: {},
				fields: [
					'index',
					{
						key: 'name',
						sortable: true
					}, {
						key: 'MGLT',
						label: 'MGLT/hr',
						sortable: true
					}, {
						key: 'consumables',
						sortable: true
					}, {
						key: 'stops',
						sortable: true
					},
                    'details'
                ]
			}
		},
		methods: {
			humanizeProperty(string) {
				return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1)}).replace(/_/g, ' ')
            },
			parseDistance(e) {
				this.distance = e.target.value
			},
			unknownShips(ships) {
				return ships.filter(ship => ship.stops === 'unknown')
			},
			parseStops(ship) {
				if (ship.consumables === 'unknown' || ship.MGLT === 'unknown') {
					ship.stops = 'unknown';
				} else {
					const autonomy = this.toHours(ship.consumables);

					const speed = ship.MGLT;

					const maxDistance = speed * autonomy;

					ship.stops = Math.floor(this.distance / maxDistance);
				}
				return ship;
			},
			toHours(value) {
				return this.$moment.duration(Number(value.replace(/[^0-9]/g, '')), value.replace(/[0-9,\s]/g, ''))
						.asHours()
			},
			fetchData(url) {
				this.loading = true;
				this.$http.get(url).then((r) => {
					r.data.results.forEach((item) => {
						this.ships.push(this.parseStops(item))
					});
					if (r.body.next) {
						this.fetchData(r.body.next)
					} else {
						this.loading = false;
					}
				})
			},
			filteredShips() {
				return this.ships.filter(ship => ship.consumables !== 'unknown' && ship.MGLT !== 'unknown')
			}
		},
		created() {
			this.fetchData('https://swapi.co/api/starships')
		}
	}
</script>
