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
		registerables,
		Title,
		Tooltip,
		Legend,
		BarController,
		BarElement,
		// LineElement,
		LinearScale,
		TimeScale,
		PointElement,
		CategoryScale,
		type ChartOptions
	} from 'chart.js';

	// import { Chart, TimeScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
	import 'chartjs-adapter-moment'; // Import the Chart.js adapter for moment.js

	Chart.register(
		// ...registerables,
		Title,
		Tooltip,
		Legend,
		BarController,
		BarElement,
		// LineElement,
		LinearScale,
		TimeScale,
		PointElement,
		CategoryScale
	);

	let barChartElement: HTMLCanvasElement;

	/* @type { import('./$houdini').PageData } */
	export let data: Data;

	let DhtReadingsByTimeRange: DhtReadingsByTimeRangeStore,
		startTs: string,
		endTs: string,
		isAuthenticated: Writable<boolean>;

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

	$: ({
		DhtReadingsByTimeRange,
		urlSearchParams: { startTs, endTs },
		isAuthenticated
	} = data);

	// console.log(data.DhtReadingsByTimeRange)

	const debug = (obj: any, name = '') => {
		return PUBLIC_SHOW_JSON_DEBUG == '1' ? `${name} ${JSON.stringify(obj, null, 2)}` : '';
	};

	const shapeChartData = (dhtReadings: unknown) => {
		// const x: Datum[] = [];
		// const y: Datum[] = [];
		const x: String[] = [];
		const y: Number[] = [];

		if (isDhtReadingArray(dhtReadings)) {
			dhtReadings.forEach((reading: DhtReading) => {
				x.push(reading.createdAt);
				y.push(reading.tempFahr);
			});

			// console.log('⭐️⭐️⭐️ shapeChartData', [{ x, y }]);
		}

		// const data: PlotlyData[] = [
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
						'hsl(347 38% 49%)',
						'hsl(346 65% 63%)',
						'hsl(346 49% 56%)',
						'hsl(346 89% 70%)',
						'hsl(346 90% 76%)',
						'hsl(346 90% 73%)',
						'hsl(346 89% 79%)',
						'hsl(346 89% 85%)',
						'hsl(347 89% 82%)',
						'hsl(346 90% 88%)',
						'hsl(347 87% 94%)',
						'hsl(347 91% 91%)',
						'hsl(346 87% 97%)'
					],
					borderColor: ['hsl(43 100% 52%)'],
					borderRadius: 4,
					borderWidth: 2
				}
			]
		};

		console.log('⭐️⭐️⭐️ shapeChartData', chartdata);
		return chartdata;
	};

	const options: ChartOptions = {
		scales: {
			x: {
				type: 'time',
				time: {
					unit: 'month',
					tooltipFormat: 'll'
				},
				title: {
					display: true,
					text: 'Date'
				}
			},
			y: {
				title: {
					display: true,
					text: 'Temp (F)'
				}
			}
		}
	};
	// create type gaurd to tell typescript that the object is a DhtReading
	const isDhtReadingArray = (obj: any): obj is DhtReading[] => {
		return Array.isArray(obj) && obj[0].tempFahr !== undefined;
	};

	onMount(() => {
		if (browser) {
			new Chart(barChartElement, {
				type: 'bar',
				data: shapeChartData($DhtReadingsByTimeRange?.data?.getDhtReadingsByTimeRange || []),
				plugins: [
					{
						id: 'custom_canvas_background_colour',
						beforeDraw: (chart: Chart) => {
							const ctx = chart.canvas.getContext('2d');
							if (ctx) {
								ctx.save();
								ctx.globalCompositeOperation = 'destination-over';
								ctx.fillStyle = 'hsl(13 46% 25%)';
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
								color: 'hsl(43 100% 52% / 10%)'
							},
							ticks: { color: 'hsl(43 100% 52% )' }
						},
						y: {
							beginAtZero: false,
							ticks: { color: 'hsl(43 100% 52% )', font: { size: 18 } },
							grid: {
								color: 'hsl(43 100% 52% / 40%)'
							},
							title: {
								display: true,
								text: 'Temperature (F)',
								color: 'hsl(43 100% 52% )',
								font: { size: 24, family: 'Merriweather' }
							}
						}
					}
				}
			});
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
