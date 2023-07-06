<script lang="ts">
	import { PUBLIC_SHOW_JSON_DEBUG } from '$env/static/public';
	import type { DhtReading } from '$home/types/DhtReading';
	import type { DhtReadingsByTimeRangeStore } from '$houdini';
	import type { Writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import '$lib/styles/global.css';

	import { onMount } from 'svelte';

	import {
		Chart,
		Title,
		Tooltip,
		Legend,
		BarController,
		BarElement,
		LinearScale,
		TimeScale,
		PointElement,
		CategoryScale,
		// type ChartOptions,
		type ChartItem

	} from 'chart.js';

	import 'chartjs-adapter-moment'; // Import the Chart.js adapter for moment.js

	Chart.register(
		Title,
		Tooltip,
		Legend,
		BarController,
		BarElement,
		LinearScale,
		TimeScale,
		PointElement,
		CategoryScale
	);

	let barChartElement: HTMLCanvasElement;
	let barChart: ChartItem;

	/* @type { import('./$houdini').PageData } */
	export let data: Data;

	let DhtReadingsByTimeRange: DhtReadingsByTimeRangeStore,
		startTs: string,
		endTs: string,
		isAuthenticated: Writable<boolean>;

	// console.log('⭐️⭐️⭐️ dht page data', data);

	interface Data {
		DhtReadingsByTimeRange: DhtReadingsByTimeRangeStore;
		isAuthenticated: Writable<boolean>;
		urlSearchParams: {
			startTs: string;
			endTs: string;
		};
	}

	$: ({
		DhtReadingsByTimeRange,
		urlSearchParams: { startTs, endTs },
		isAuthenticated
	} = data);

	// $: updateChart();
	// console.log(data.DhtReadingsByTimeRange)

	function onChartDataChange(dhtReadings: unknown) {
		if (browser && barChart && barChartElement) {
			const chartData = shapeChartData(dhtReadings);

			// console.log('⭐️⭐️⭐️ onChartDataChange', dhtReadings);
			// console.log('⭐️⭐️⭐️ onChartDataChangebarChartElement', barChartElement)
			// console.log('⭐️⭐️⭐️ onChartDataChangeonMount barChart', barChart)
			// console.log('⭐️⭐️⭐️ onChartDataChangeonMount barChart.data', barChart.data)

			// Fetch data from the database and replace old data
			barChart.data.labels = chartData.labels;
			barChart.data.datasets.forEach((dataset: unknown) => {
				dataset.data = chartData.datasets[0].data;
			});

			// Re-render the ChartJS component
			barChart.update();
		}
	}

	const debug = (obj: any, name = '') => {
		return PUBLIC_SHOW_JSON_DEBUG == '1' ? `${name} ${JSON.stringify(obj, null, 2)}` : '';
	};

	const shapeChartData = (dhtReadings: unknown) => {
		const x: String[] = [];
		const y: Number[] = [];

		if (isDhtReadingArray(dhtReadings)) {
			dhtReadings.forEach((reading: DhtReading) => {
				x.push(reading.createdAt);
				y.push(reading.tempFahr);
			});

			// console.log('⭐️⭐️⭐️ shapeChartData', [{ x, y }]);
		}

		const data = [
			{
				x,
				y
			}
		];

		const chartdata = {
			labels: x,
			datasets: [
				{
					label: 'Temperature (F)',
					data: y,
					backgroundColor: [
						chartColors.bar,
					],
					borderColor: [chartColors.barBorder],
					borderRadius: 4,
					borderWidth: 2
				}
			]
		};

		// console.log('⭐️⭐️⭐️ shapeChartData', chartdata);
		return chartdata;
	};

	// const options: ChartOptions = {
	// 	scales: {
	// 		x: {
	// 			type: 'time',
	// 			time: {
	// 				unit: 'month',
	// 				tooltipFormat: 'll'
	// 			},
	// 			title: {
	// 				display: true,
	// 				text: 'Date'
	// 			}
	// 		},
	// 		y: {
	// 			title: {
	// 				display: true,
	// 				text: 'Temp (F)'
	// 			}
	// 		}
	// 	}
	// };
	// create type gaurd to tell typescript that the object is a DhtReading
	const isDhtReadingArray = (obj: any): obj is DhtReading[] => {
		return Array.isArray(obj) && obj[0].tempFahr !== undefined;
	};

	const chartColors = {
		canvas: '#1C646D',
		grid: '#38184C',
		bar: '#CEF09D',
		barBorder: '#A0CD60',
		text: '#A0CD60'
	}

	onMount(() => {

		if (browser) {
			barChart = new Chart(barChartElement, {
				type: 'bar',
				data: shapeChartData($DhtReadingsByTimeRange?.data?.getDhtReadingsByTimeRange || []),
				plugins: [
					{
						id: 'custom_canvas_background_color',
						beforeDraw: (chart: Chart) => {
							const ctx = chart.canvas.getContext('2d');
							if (ctx) {
								ctx.save();
								ctx.globalCompositeOperation = 'destination-over';
								ctx.fillStyle = chartColors.canvas;
								ctx.fillRect(0, 0, chart.width, chart.height);
								ctx.restore();
							}
						}
					}
				],
				options: {
					plugins: {
						legend: {
							display: false
						}
					},
					scales: {
						x: {
							grid: {
								color: chartColors.grid
							},
							ticks: { color: chartColors.text }
						},
						y: {
							beginAtZero: false,
							ticks: { color: chartColors.text, font: { size: 18 } },
							grid: {
								color: chartColors.grid
							},
							title: {
								display: true,
								text: 'Temperature (F)',
								color: chartColors.text,
								font: { size: 24, family: 'Helvetica' }
							}
						}
					}
				}
			});
			// console.log('⭐️⭐️⭐️ onMount barChartElement', barChartElement)
			// console.log('⭐️⭐️⭐️ onMount barChart', barChart)

		}
	});

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
		{debug({}, `render time: ${new Date().toLocaleString()}`)}
		<div>
			<form action="/dht">
				<label for="start-time">Start Time:</label>
				<input type="text" id="start-time" name="startTs" value={startTs} /><br /><br />
				<label for="end-time">End Time:</label>
				<input type="text" id="end-time" name="endTs" value={endTs} /><br /><br />
				<button type="submit">Submit</button>
			</form>

			<h2>Chart</h2>
			<canvas bind:this={barChartElement} />
			{onChartDataChange($DhtReadingsByTimeRange.data.getDhtReadingsByTimeRange)}

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
