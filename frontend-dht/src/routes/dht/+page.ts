export const ssr = false;

import { graphql } from '$houdini';

import { error } from '@sveltejs/kit';

import { isAuthenticated, user } from '../../store';
import type { DhtReading } from '$types/DhtReading';
import type { HoudiniAfterLoadEvent } from '$types/HoudiniAfterLoadEvent';

export const _houdini_load = graphql(`
	query DhtReadingsByTimeRange($startTs: String!, $endTs: String!) {
		getDhtReadingsByTimeRange(startTs: $startTs, endTs: $endTs) {
			_id
			tempFahr
			tempCel
			humidity
			modifiedAt
			createdAt
		}
	}
`);

interface DhtReadingsByTimeRangeVariablesParams {
	url: {
		searchParams: URLSearchParams;
	};
}

// This is the function for the AllItems query.
// Query variable functions must be named _<QueryName>Variables.
/* @type { import('./$houdini').AllItemsVariables } */
export const _DhtReadingsByTimeRangeVariables = ({
	url: { searchParams }
}: DhtReadingsByTimeRangeVariablesParams) => {
	return {
		...getSearchParams(searchParams)
	};
};

/**
 * @param { import('./$houdini').AfterLoadEvent }
 */
export const _houdini_afterLoad = (
	{
		event: {
			url: { searchParams }
		},
		data: { DhtReadingsByTimeRange }
	}: HoudiniAfterLoadEvent
) =>
	{
		// if (!DhtReadingsByTimeRange) {
		// 	throw error(404, 'Missing DhtReadingsByTimeRange');
		// }

		// add the search params to the data
		return {
			user,
			isAuthenticated,
			urlSearchParams: {
				...getSearchParams(searchParams)
			}
		};
	};

/**
 *
 * @param {*} event
 */
const getSearchParams = (searchParams: URLSearchParams) => {
	return {
		startTs: searchParams.get('startTs') ?? '2021-03-19T00:01:24.697092Z',
		endTs: searchParams.get('endTs') ?? '2023-06-19T00:01:24.697092Z'
	};
};
