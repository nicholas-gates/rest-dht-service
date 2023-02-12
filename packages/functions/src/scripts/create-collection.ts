const faunadb = require("faunadb");
const q = faunadb.query;

  // Create a collection called 'myCollection'
//   client
//     .query(q.CreateCollection({ name: "myCollection" }))
    // Show the result
    // .then((ret) => console.log(ret))
    // .catch((err) =>
    //   console.error(
    //     "Error: [%s] %s: %s",
    //     err.name,
    //     err.message,
    //     err.errors()[0].description
    //   )
    // );