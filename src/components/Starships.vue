<template>
    <div>
        <div class="background-image"></div>
        <div class="overlay"></div>
        <b-row no-gutters class="full-page">
            <b-col sm="8">
                <b-row no-gutters>
                    <b-col xl="10" offset-xl="1" class="my-5 table-transparent text-white">
                        <b-table :items="hideUnknown ? filterShips() : ships"
                                 :fields="fields"
                                 :bordered="false"
                                 :outlined="false"
                                 :hover="true"
                                 class="table-borderless" small stacked="md">
                            <template slot="index" slot-scope="data">
                                {{data.index + 1}}
                            </template>
                            <template slot="name" slot-scope="data">
                                {{data.item.name}} ({{data.item.model}})
                            </template>
                            <template slot="consumables" slot-scope="data">
                                {{data.item.consumables}} <code v-show="data.item.consumables !== u"><br class="d-none d-md-inline d-xl-none">({{toHours(data.item.consumables)}} hrs)</code>
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
                    <b-col xl="10" offset-xl="1" class="mt-5">
                        <b-col class="text-white">
                            <b-row no-gutters>
                                <b-col class="form-group" lg="6">
                                    <b-form-checkbox v-model="hideUnknown">
                                        Hide unknown
                                    </b-form-checkbox>
                                </b-col>
                                <b-col class="form-group" lg="6">
                                    <div class="input-group">
                                        <input class="form-control"
                                               v-model="distance" type="number"
                                               id="distanceInput"
                                        >
                                        <div class="input-group-append">
                                            <span class="input-group-text">MGLT</span>
                                        </div>
                                    </div>
                                </b-col>
                                <b-col class="form-group" cols="12">
                                    <input type="range" v-model="distance"
                                           min="10000" max="100000000"
                                           v-on:input="parseDistance" class="form-control-range">
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-col>
                    <b-col xl="10" offset-xl="1" class="mt-5 mx-3 mx-xl-auto">
                        <unknown-ships :ships="unknownShips(ships)"></unknown-ships>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-modal v-model="modalShow"
                 :title="selected.name + ' [' + selected.model + ']'"
                 body-class="small"
                 centered hide-footer size="lg">
            <b-row v-for="(value, propertyName) in selected" :key="propertyName">
                <b-col cols="3">{{humanizeProperty(propertyName)}}</b-col>
                <b-col cols="9">{{value}}</b-col>
            </b-row>
        </b-modal>
    </div>
</template>
<script>
	import UnknownShips from "./UnknowknShips.vue"

	const u = 'unknown';

	export default {
		name: 'Starships',
		components: {UnknownShips},
		data() {
			return {
				u,
				title: 'Starships',
				ships: [],
				distance: 0,
				hideUnknown: false,
				loading: false,
				modalShow: false,
				selected: {},
				fields: [
					{
						key: 'index',
						class: 'd-none d-lg-table-cell'
					},
					{
						key: 'name',
						sortable: true
					}, {
						key: 'MGLT',
						label: 'MGLT/hr',
						sortable: true
					}, {
						key: 'consumables',
						sortable: true,
                        width: 193
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
				return string.replace(/\w\S*/g, function (txt) {
					return txt.charAt(0).toUpperCase() + txt.substr(1)
				}).replace(/_/g, ' ')
			},
			parseDistance(e) {
				this.distance = e.target.value
			},
			unknownShips(ships) {
				return ships.filter(ship => ship.stops === u)
			},
			parseStops(ship) {
				if (ship.consumables === u || ship.MGLT === u) {
					ship.stops = u;
				} else {
					ship.stops = Math.floor(this.distance / (ship.MGLT * this.toHours(ship.consumables)));
				}
				return ship;
			},
			toHours(value) {
				return this.$moment.duration(
						Number(value.replace(/[^0-9]/g, '')),
						value.replace(/[0-9,\s]/g, '')
				).asHours()
			},
			fetchShips(url) {
				this.loading = true;
				this.$http.get(url).then((r) => {
					r.data.results.forEach((item) => {
						this.ships.push(this.parseStops(item))
					});
					if (r.data.next)
						this.fetchShips(r.data.next);
					else
						this.loading = false;
				})
			},
			filterShips() {
				return this.ships.filter(ship => ship.consumables !== u && ship.MGLT !== u)
			}
		},
		created() {
			this.fetchShips('https://swapi.co/api/starships')
		}
	}
</script>
