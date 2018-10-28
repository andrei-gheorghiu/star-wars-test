<template>
    <div>
        <h5 class="text-white">{{title}}: <sup><i class="fa fa-info-circle" v-b-tooltip="{title:'Hover ships for reason'}"></i></sup></h5>
        <div class="button-group">
            <button type="button" v-for="ship in ships" :key="ship.index"
                    v-b-tooltip="{title:createTooltip(ship)}"
                    class="btn btn-dark btn-sm" style="margin: 5px;"
            >{{ship.model}}
            </button>
        </div>
    </div>
</template>
<script>

	export default {
		name: 'UnknownShips',
		props: {
			ships: Array
		},
		data() {
			return {
				title: 'Unknown'
			}
		},
		methods: {
			createTooltip(ship) {
				const reasons = [];
				if (ship.MGLT === 'unknown')
					reasons.push('MGLT');
				if (ship.consumables === 'unknown')
					reasons.push('consumables');
                return reasons.map(item => item + ': unknown').join(', ')
			}
		},
		created() {
			//console.log(this.ships)
		}
	}
</script>
