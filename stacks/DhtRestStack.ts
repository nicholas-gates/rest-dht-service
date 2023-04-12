import { Api, StackContext } from "sst/constructs";

export function DhtRestStack({ stack }: StackContext) {
  // Create the HTTP API
  const api = new Api(stack, "Api", {
    routes: {
      "GET /notes": "packages/functions/src/note/list.main",
      "GET /notes2": "packages/functions/src/note/list.main",
      "GET /notes/{id}": "packages/functions/src/note/get.main",
      "PUT /notes/{id}": "packages/functions/src/note/update.main",
      "GET /dht": "packages/functions/src/dht/list.main",
      "GET /dht/{id}": "packages/functions/src/dht/get.main",
      "POST /dht": "packages/functions/src/dht/create.main",
      "DELETE /dht/{id}": "packages/functions/src/dht/delete.main",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
