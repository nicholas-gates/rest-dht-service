import notes from "./notes";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
// update

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const note = notes[event.pathParameters?.id!];
  note.meta = "4 meta data";

  return note
    ? {
        statusCode: 200,
        body: JSON.stringify(note),
        headers: {
          "Content-Type": "application/json",
        },
      }
    : {
        statusCode: 404,
        body: JSON.stringify({ error: true }),
      };
};
