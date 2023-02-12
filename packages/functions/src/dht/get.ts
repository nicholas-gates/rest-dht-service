import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { client, q } from "src/lib/fauna-client";

export const main: APIGatewayProxyHandlerV2 = async (event: any) => {
  try {
    const collection = "myCollection";

    const resp = await client.query(
      q.Get(q.Ref(q.Collection(collection), event.pathParameters.id))
    );

    console.log(resp);

    return {
      statusCode: 200,
      body: JSON.stringify(resp.data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (err: any) {
    console.error(
      "Error: [%s] %s: %s",
      err.name,
      err.message,
    );

    if (err.name === "NotFound") {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: true, message: "Not found" }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: true }),
      };
    }
  }
};
