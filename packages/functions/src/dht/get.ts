import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import response from "src/lib/response";
// import { DhtGet } from "./DhtGet";
// import {Dht} from "src/dht/actors/Dht";
// const dht = Dht.instance;
import { getById } from "./actors/Dht";

import middy from "@middy/core";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import httpErrorHandler from "@middy/http-error-handler";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import cors from "@middy/http-cors";

const schema = {
  type: "object",
  required: ["pathParameters"],
  properties: {
    // this will pass validation
    pathParameters: {
      type: "object",
    },
  },
};

const handler: APIGatewayProxyHandlerV2 = middy(async (event: any) => {
  try {
    const resp = await getById(event.pathParameters.id);

    return response({
      body: resp.data,
    });
  } catch (err: any) {
    console.error("Error: [%s] %s: %s", err.name, err.message);

    if (err.name === "NotFound") {
      return response({
        statusCode: 404,
        body: JSON.stringify({ error: true, message: "Not found" }),
      });
    } else {
      return response({
        statusCode: 500,
        body: JSON.stringify({ error: true }),
      });
    }
  }
})
  .use(httpHeaderNormalizer())
  .use(httpEventNormalizer())
  .use(httpErrorHandler())
  .use(cors())
  .use(
    validator({
      eventSchema: transpileSchema(schema),
    })
  );

export default handler;
