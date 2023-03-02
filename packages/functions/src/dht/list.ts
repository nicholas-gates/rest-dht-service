import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import response from "src/lib/response";

import { list } from "./actors/Dht";

// import validator from "@middy/validator";
// import { transpileSchema } from "@middy/validator/transpile";

import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import cors from "@middy/http-cors";

const schema = {
  type: "object",
  required: ["body", "foo"],
  properties: {
    // this will pass validation
    body: {
      type: "string",
    },
    // this won't as it won't be in the event
    foo: {
      type: "string",
    },
  },
};

export const main: APIGatewayProxyHandlerV2 = middy(async (event: any) => {
  try {
    const { docData, after } = await list(event.queryStringParameters?.after);

    // extract the title from the document
    // const titles = docData.map((doc: any) => doc.title);

    return response({
      body: docData,
      headers: {
        "X-After": after,
      },
    });
  } catch (err: any) {
    console.error("Error: [%s] %s: %s", err.name, err.message);
    throw err;
  }
})
  .use(httpHeaderNormalizer())
  .use(httpEventNormalizer())
  .use(httpErrorHandler())
  // .use(
  //   validator({
  //     eventSchema: transpileSchema(schema),
  //   })
  // )
  .use(cors());
