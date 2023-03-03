import { APIGatewayProxyHandlerV2 } from "aws-lambda";

import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";

import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";

import response from "src/lib/response";
// import { Dht } from "src/dht/actors/Dht";
// const dht = Dht.instance;
import { create } from "./actors/Dht";

const schema = {
  type: "object",
  required: ["body"],
  properties: {
    // this will pass validation
    body: {
      type: "object",
      required: ["title"],
      properties: {
        title: {
          type: "string",
        },
      },
    },
  },
};

export const main: APIGatewayProxyHandlerV2 = middy(async (event: any) => {
  try {
    const resp = await create(event.body);

    return response({
      body: resp.data,
    });
  } catch (err: any) {
    console.error("Error: [%s] %s: %s", err.name, err.message);

    return response({
      statusCode: 500,
      body: { error: true, post: true },
    });
  }
})
  .use(httpErrorHandler())
  .use(httpJsonBodyParser())
  .use(
    validator({
      eventSchema: transpileSchema(schema),
    })
  );
