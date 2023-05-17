import type { DhtReading } from "$types/DhtReading";

export interface HoudiniAfterLoadEvent {
	event: {
		url: {
			searchParams: URLSearchParams;
		};
	},
	data: {
		DhtReadingsByTimeRange: DhtReading[];
	};
}
