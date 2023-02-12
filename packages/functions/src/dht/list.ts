import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { client, q } from "src/lib/fauna-client";

interface PaginationOptions {
  size?: number;
  after?: any[];
}

export const main: APIGatewayProxyHandlerV2 = async (event: any) => {
  try {
    const collection = "myCollection";

    const paginationOptions: PaginationOptions = {
      // size: 1,
    };

    if (event.queryStringParameters?.after) {
      paginationOptions.after = [
        q.Ref(q.Collection("myCollection"), event.queryStringParameters.after),
      ];
    }

    const alldocs = await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index("all_docs")), paginationOptions),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    );

    // extract the title from the document
    const titles = alldocs.data.map((doc: any) => doc.data);

    const x_after = alldocs?.after ? alldocs.after[0].id : null;

    return {
      statusCode: 200,
      body: JSON.stringify(titles),
      headers: {
        "Content-Type": "application/json",
        "x-after": `${x_after}`,
      },
    };
  } catch (err: any) {
    console.error("Error: [%s] %s: %s", err.name, err.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: true, post: true }),
    };
  }
};
