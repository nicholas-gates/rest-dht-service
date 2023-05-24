<script lang="ts">
	import { PUBLIC_SHOW_JSON_DEBUG } from '$env/static/public';
	import type { DhtReading } from '$home/types/DhtReading';
	import type { DhtReadingsByTimeRangeStore } from '$houdini';
	import type { Writable } from 'svelte/store';
  	import Plot from 'svelte-plotly.js';
	// import type * as Plotly from 'plotly.js';

	// alias data type from plotly.js as PlotlyData
	import type { Datum, Data as PlotlyData } from 'plotly.js';

	/* @type { import('./$houdini').PageData } */
	export let data: Data;

	let DhtReadingsByTimeRange: DhtReadingsByTimeRangeStore, startTs: string, endTs: string, isAuthenticated: Writable<boolean>;

	// console.log('⭐️⭐️⭐️ dht page data', data);

	interface Data {
		DhtReadingsByTimeRange: DhtReadingsByTimeRangeStore;
		// DhtReadingsByTimeRange: Writable<DhtReadingsByTimeRangeInterface>;
		isAuthenticated: Writable<boolean>;
		urlSearchParams: {
			startTs: string;
			endTs: string;
		};
	}

	$: ({ DhtReadingsByTimeRange, urlSearchParams: {startTs, endTs}, isAuthenticated } = data);


	// console.log(data.DhtReadingsByTimeRange)

	const debug = (obj: any, name = '') => {
		return PUBLIC_SHOW_JSON_DEBUG == '1' ? `${name} ${JSON.stringify(obj, null, 2)}` : '';
	};

	const shapeChartData = (dhtReadings: unknown) => {

		const x: Datum[] = [];
		const y: Datum[] = [];

		if (isDhtReadingArray(dhtReadings)) {
			dhtReadings.forEach((reading: DhtReading) => {
				x.push(reading.createdAt);
				y.push(reading.tempFahr);
			});

			// console.log('⭐️⭐️⭐️ shapeChartData', [{ x, y }]);
		}

		const data: PlotlyData[] = [
			{
				x,
				y,
				type: 'scatter'
			}
		];
		return data;
	};

	// create type gaurd to tell typescript that the object is a DhtReading
	const isDhtReadingArray = (obj: any): obj is DhtReading[] => {
		return Array.isArray(obj) && obj[0].tempFahr !== undefined;
	};

</script>

<div>
	<!-- {debug($user, 'user: ')} -->

	{#if !$isAuthenticated}
		<div>
			<h1>Not Authenticated</h1>
		</div>
	{:else if $DhtReadingsByTimeRange?.fetching}
		<div>Loading...</div>
	{:else if $DhtReadingsByTimeRange?.data?.getDhtReadingsByTimeRange}
		<div>
			<form action="/dht">
				<label for="start-time">Start Time:</label>
				<input type="text" id="start-time" name="startTs" value={startTs} /><br /><br />
				<label for="end-time">End Time:</label>
				<input type="text" id="end-time" name="endTs" value={endTs} /><br /><br />
				<button type="submit">Submit</button>
			</form>

			<h2>Chart</h2>
			<Plot
				data={shapeChartData($DhtReadingsByTimeRange.data.getDhtReadingsByTimeRange)}
				layout={{
					margin: { t: 0 }
				}}
				fillParent='width'
				debounce={250}
			/>

			<h2>Readings by Time Range</h2>
			<!-- {debug($DhtReadingsByTimeRange.data.getDhtReadingsByTimeRange, '$DhtReadingsByTimeRange.data.getDhtReadingsByTimeRange: ')} -->
			{#each $DhtReadingsByTimeRange.data.getDhtReadingsByTimeRange as reading}
				<section>
					<ul>
						<li>Temp (F): {reading?.tempFahr}</li>
						<li>Temp (C): {reading?.tempCel}</li>
						<li>Humidity: {reading?.humidity}</li>
						<li>Created At: {reading?.createdAt}</li>
					</ul>
				</section>
			{/each}
		</div>
	{:else}
		<div>
			<h1>Something went wrong</h1>
			<div>{JSON.stringify($DhtReadingsByTimeRange)}</div>
		</div>
	{/if}
</div>
