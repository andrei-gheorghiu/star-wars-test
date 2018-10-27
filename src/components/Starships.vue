<template>
    <div>
        <div class="overlay"></div>
        <div class="row no-gutters full-page">
            <div class="col-sm-8">
                <div class="row no-gutters h-80">
                    <div class="col-10 offset-1 my-5 table-transparent text-white">
                        <table class="table table-borderless table-hover table-sm">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>MGLT/h</th>
                                <th>Consumables</th>
                                <th>Stops</th>
                            </tr>
                            </thead>
                            <tbody v-if="ships.length">
                            <tr v-if="parseStops(ship) !== 'unknown' || showHidden"
                                v-for="ship in ships" :key="ship.url">
                                <td>{{ship.name}} ({{ship.model}})</td>
                                <td>{{ship.MGLT}}<span v-if="ship.MGLT !=='unknown'">MGLT/h</span></td>
                                <td>{{ship.consumables}}
                                    (<code>{{toHours(ship.consumables)}} hrs</code>)
                                </td>
                                <td>{{parseStops(ship)}}</td>
                            </tr>
                            </tbody>
                        </table>
                        <div class="d-flex justify-content-center">
                            <div class="loader" v-show="loading"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-4 fixed-panel">
                <div class="row h-80 no-gutters">
                    <div class="col-10 offset-1 mt-5">
                        <div class="col text-white">
                            <div class="row no-gutters">
                                <div class="form-group col-6">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="showHidden" v-model="showHidden">
                                        <label class="form-check-label" for="showHidden">
                                            Show Hidden
                                        </label>
                                    </div>
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
                            </div>
                        </div>
                    </div>
                    <div class="col-10 offset-1">
                        <unknown-ships :ships="unknownShips(ships)"></unknown-ships>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
	import Vue from 'vue'
	import $http from 'vue-resource'
	import VueMoment from 'vue-moment'
	import FormCheckbox from 'bootstrap-vue'
	import UnknownShips from "./UnknowknShips.vue"

	Vue.use($http, VueMoment, FormCheckbox);

	export default {
		name: 'Starships',
		components: {UnknownShips, FormCheckbox},
		data() {
			return {
				title: 'Starships',
				ships: [],
				distance: 0,
				showHidden: false,
              loading: false
			}
		},
		methods: {
			parseDistance(e) {
				this.distance = e.target.value
			},
			unknownShips(ships) {
				return ships.filter(ship => this.parseStops(ship) === 'unknown')
			},
			parseStops(ship) {
				if (ship.consumables === 'unknown' || ship.MGLT === 'unknown') {
					return 'unknown'
				}
				const autonomy = this.toHours(ship.consumables)

				const speed = ship.MGLT

				const maxDistance = speed * autonomy

				return Math.floor(this.distance / maxDistance)
			},
			toHours(value) {
				return this.$moment.duration(Number(value.replace(/[^0-9]/g, '')), value.replace(/[0-9,\s]/g, ''))
						.asHours()
			},
			fetchData(url) {
				this.loading = true;
				this.$http.get(url).then((r) => {
					r.data.results.forEach((item) => {
						this.ships.push(item)
					});
					if (r.body.next) {
						this.fetchData(r.body.next)
					} else {
						this.loading = false;
                    }
				})
			}
		},
		created() {
			this.fetchData('https://swapi.co/api/starships')
		}
	}
</script>
