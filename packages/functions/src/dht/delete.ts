import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { client, q } from "src/lib/fauna-client";

interface PaginationOptions {
  size?: number;
  after?: any[];
}

export const main: APIGatewayProxyHandlerV2 = async (event: any) => {
  try {
    const collection = "dhtReading";

    // extract id from pathParameters
    const { id } = event.pathParameters;

    let paginationOptions =
      id === "*"
        ? {}
        : { size: 1, after: [q.Ref(q.Collection("dhtReading"), id)] };

    const alldocs = await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index("all_readings")), paginationOptions),
        q.Lambda(["ref"], q.Delete(q.Var("ref")))
      )
    );

    const titles = alldocs.data.map((doc: any) => doc.data);

    return {
      statusCode: 200,
      body: JSON.stringify(titles),
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

    return {
      statusCode: 500,
      body: JSON.stringify({ error: true, post: true }),
    };
  }
};
