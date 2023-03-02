const timestamp = new Date().toISOString().slice(14, 19);

const defaultOptions: Response = {
  statusCode: 200,
  body: {},
  headers: {
    "Content-Type": "application/json",
    "x-version": "1",
    "x-timestamp": `${timestamp}`,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
};

export default (options: ResponseOptions) => {
  let allHeaders;

  if (options.body && typeof options.body !== "string") {
    options.body = JSON.stringify(options.body);
  }

  if (options.headers) {
    allHeaders = {
      ...defaultOptions.headers,
      ...options.headers,
    };
  }

  return {
    ...defaultOptions,
    ...options,
    ...{
      headers: {
        ...allHeaders,
      },
    },
  };
};

type StringOrNumberOrBoolean = string | number | boolean;

interface Response {
  statusCode: number;
  body?: any;
  headers?: Record<string, StringOrNumberOrBoolean>;
}

interface ResponseOptions {
  statusCode?: number;
  body?: any;
  headers?: Record<string, StringOrNumberOrBoolean>;
}
