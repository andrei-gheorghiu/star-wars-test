<template>
    <div>
        <h5 class="text-white">{{title}}:</h5>
        <div class="button-group">
            <button type="button" v-for="ship in ships" :key="ship.url"
                    class="btn btn-dark btn-sm" style="margin: 5px;">{{ship.model}}</button>
        </div>
    </div>
</template>
<script>

	export default {
		name: 'UnknownShips',
		props: {
			ships: Array
		},
		data () {
			return {
				title: 'Unknown'
			}
		},
		methods: {
		},
		created () {
			//console.log(this.ships)
		}
	}
</script>
