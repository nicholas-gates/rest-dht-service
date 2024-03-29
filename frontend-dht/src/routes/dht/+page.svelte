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
		type ChartDataset,
		type ChartData

		// type ChartOptions,
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
	let barChart: Chart<'bar'>;

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

	function onChartDataChange(dhtReadings: DhtReading[]) {
		if (browser && barChart && barChartElement) {
			const chartData = shapeChartData(dhtReadings);

			barChart.data.labels = chartData.labels;
			barChart.data.datasets.forEach((dataset: ChartDataset) => {
				dataset.data = chartData.datasets[0].data.map((d) => d as [number, number]);
			});

			// Re-render the ChartJS component
			barChart.update();

			return '';
		}
	}

	const debug = (obj: any, name = '') => {
		return PUBLIC_SHOW_JSON_DEBUG == '1' ? `${name} ${JSON.stringify(obj, null, 2)}` : '';
	};

	const shapeChartData = (dhtReadings: (DhtReading | null)[]): ChartData<'bar'> => {
		const x: string[] = [];
		const y: number[] = [];

		dhtReadings.forEach((value: DhtReading | null, index: number, array: (DhtReading | null)[]) => {
			if (value !== null) {
				const [xValue, yValue] = [value.createdAt, value.tempFahr];
				x.push(xValue.toString());
				y.push(yValue);
			}
		});

		return {
			labels: x,
			datasets: [
				{
					data: y.map((value: number | [number, number] | null) => {
						if (value === null) {
							return [0, 0];
						} else if (typeof value === 'number') {
							return [0, value];
						} else {
							return value;
						}
					}),
					backgroundColor: '#007bff'
				}
			]
		};
	};

	// const shapeChartData = (dhtReadings: (DhtReading | null)[]): ChartData<'bar'> => {
	// 	const x: string[] = [];
	// 	const y: number[] = [];

	// 	dhtReadings
	// 		.filter((reading: DhtReading | null): reading is DhtReading => reading !== null)
	// 		.forEach((reading: DhtReading) => {
	// 			x.push(reading.createdAt);
	// 			y.push(reading.tempFahr);
	// 		});

	// 	return {
	// 		labels: x,
	// 		datasets: [
	// 			{
	// 				label: 'Temperature',
	// 				data: y.map((temp: number) => [temp, 0]),
	// 				backgroundColor: 'rgba(255, 99, 132, 0.2)',
	// 				borderColor: 'rgba(255, 99, 132, 1)',
	// 				borderWidth: 1
	// 			}
	// 		]
	// 	};
	// };

	// type gaurd to tell typescript that the object is a DhtReading
	const isDhtReadingArray = (obj: any): obj is DhtReading[] => {
		return Array.isArray(obj) && obj[0].tempFahr !== undefined;
	};

	const chartColors = {
		canvas: '#1C646D',
		grid: '#38184C',
		bar: '#CEF09D',
		barBorder: '#A0CD60',
		text: '#A0CD60'
	};

	onMount(() => {
		if (browser) {
			barChart = new Chart<'bar', (number | [number, number] | null)[], unknown>(barChartElement, {
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
					responsive: true,
					maintainAspectRatio: true,
					plugins: {
						legend: {
							display: false
						}
					},
					scales: {
						x: {
							ticks: {
								color: chartColors.text
							},
							grid: {
								color: chartColors.grid
							}
						},
						y: {
							ticks: {
								color: chartColors.text
							},
							grid: {
								color: chartColors.grid
							}
						}
					}
				}
			});
			// barChart = new Chart(barChartElement, {
			// 	type: 'bar',
			// 	data: shapeChartData($DhtReadingsByTimeRange?.data?.getDhtReadingsByTimeRange || []),
			// 	plugins: [
			// 		{
			// 			id: 'custom_canvas_background_color',
			// 			beforeDraw: (chart: Chart) => {
			// 				const ctx = chart.canvas.getContext('2d');
			// 				if (ctx) {
			// 					ctx.save();
			// 					ctx.globalCompositeOperation = 'destination-over';
			// 					ctx.fillStyle = chartColors.canvas;
			// 					ctx.fillRect(0, 0, chart.width, chart.height);
			// 					ctx.restore();
			// 				}
			// 			}
			// 		}
			// 	],
			// 	options: {
			// 		plugins: {
			// 			legend: {
			// 				display: false
			// 			}
			// 		},
			// 		scales: {
			// 			x: {
			// 				grid: {
			// 					color: chartColors.grid
			// 				},
			// 				ticks: { color: chartColors.text }
			// 			},
			// 			y: {
			// 				beginAtZero: false,
			// 				ticks: { color: chartColors.text, font: { size: 18 } },
			// 				grid: {
			// 					color: chartColors.grid
			// 				},
			// 				title: {
			// 					display: true,
			// 					text: 'Temperature (F)',
			// 					color: chartColors.text,
			// 					font: { size: 24, family: 'Helvetica' }
			// 				}
			// 			}
			// 		}
			// 	}
			// });
			// console.log('⭐️⭐️⭐️ onMount barChartElement', barChartElement)
			// console.log('⭐️⭐️⭐️ onMount barChart', barChart)
		}
	});

	const isoFormatDate = (ts: string) => {
		return new Date(ts).toISOString().slice(0, 16);
	};
</script>

<div>
	<!-- {debug($user, 'user: ')} -->

	{#if !$isAuthenticated}
		<div class="container">
			<h1>Not Authenticated</h1>
		</div>
	{:else if $DhtReadingsByTimeRange?.fetching}
		<div class="container">Loading...</div>
	{:else if $DhtReadingsByTimeRange?.data?.getDhtReadingsByTimeRange}
		<!-- {debug({}, `render time: ${new Date().toLocaleString()}`)} -->
		<div class="container">
			<form action="/dht">
				<div
					style="border: 1px solid gray; border-radius: 5px; padding: 20px; display: inline-block; max-width: 100%;"
				>
					<div class="grid" style="display: inline-block; max-width: 100%;">
						<div>
							<!-- { console.log('⭐️⭐️⭐️ startTs', (new Date(startTs)).toISOString().slice(0, 16))} -->
							<label for="start-time">Start Time</label>
							<input
								type="datetime-local"
								id="start-time"
								name="startTs"
								value={isoFormatDate(startTs)}
							/>
						</div>
						<div>
							<label for="end-time">End Time</label>
							<input
								type="datetime-local"
								id="end-time"
								name="endTs"
								value={isoFormatDate(endTs)}
							/>
						</div>
						<div style="display: inline-block; max-width: 100%;">
							<button type="submit" class="btn">Submit</button>
						</div>
					</div>

					<div class="grid" />
				</div>
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
