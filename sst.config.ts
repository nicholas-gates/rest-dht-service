import { SSTConfig } from "sst";
import { DhtRestStack } from "./stacks/DhtRestStack";

export default {
  config(_input) {
    return {
      name: "dht-rest-services",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app.stack(DhtRestStack);
  },
} satisfies SSTConfig;
