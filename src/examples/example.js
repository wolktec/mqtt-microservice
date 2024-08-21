const { createConnection, createMicroservice } = require("../../dist/index");

const microservice = createMicroservice(
  { url: "mqtt://localhost", name: "example" },
  {
    hello: async (args) => {
      return `Hello, ${args.name}`;
    },
  }
);

const client = async () => {
  const { conn, request } = await createConnection({
    url: "mqtt://localhost",
  });

  const response = await request("example/hello", {
    name: "world",
  });
  console.log(response);
  await conn.endAsync();
  (await microservice).endAsync();
};

const run = async () => {
  await microservice;
  await client();
};

run();
