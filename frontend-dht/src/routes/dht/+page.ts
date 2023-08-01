export const ssr = false;

import { graphql } from "$houdini";

import { isAuthenticated, user } from "../../store";
import type { HoudiniAfterLoadEvent } from "$types/HoudiniAfterLoadEvent";

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
  url: { searchParams },
}: DhtReadingsByTimeRangeVariablesParams) => {
  return {
    ...getSearchParams(searchParams),
  };
};

/**
 * @param { import('./$houdini').AfterLoadEvent }
 */
export const _houdini_afterLoad = ({
  event: {
    url: { searchParams },
  },
  data: { DhtReadingsByTimeRange },
}: HoudiniAfterLoadEvent) => {
  // if (!DhtReadingsByTimeRange) {
  // 	throw error(404, 'Missing DhtReadingsByTimeRange');
  // }

  // add the search params to the data
  return {
    user,
    isAuthenticated,
    urlSearchParams: {
      ...getSearchParams(searchParams),
    },
  };
};

const formatDate = (dateParam: string) => {
  // let formattedDate = "2022-01-01T12:00";
  let date = new Date(dateParam + ":00.000Z");
  return date.toISOString();
};

/**
 *
 * @param {*} event
 */
const getSearchParams = (searchParams: URLSearchParams) => {
  let timeParams = {
    startTs: searchParams.get("startTs") ?? "2023-06-05T00:00",
    endTs: searchParams.get("endTs") ?? "2023-06-19T00:00",
  };

  timeParams = {
    startTs: formatDate(timeParams.startTs),
    endTs: formatDate(timeParams.endTs),
  };

  console.log("getSearchParams", timeParams);

  return timeParams;
};
