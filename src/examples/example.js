const { createConnection, createMicroservice } = require("../../dist/index");

class NotImplementedError extends Error {}

const microservice = createMicroservice(
  { 
    url: "mqtt://localhost", 
    name: "example",
    errorHandler: (error) => {
      return {
        message: 'Teste',
        name: 'Erro',
        stack: error.stack
      }
    }
  },
  {
    hello: async (args) => {
      throw new NotImplementedError(name);
    },
    world: async (args) => {
      const { name } = args;
      return `Hello ${name}`;
    },
  }
);

const client = async () => {
  const { conn, request } = await createConnection({
    url: "mqtt://localhost",
  });

  await request("example/world", {
    name: "world",
  })
    .then(console.log)
    .catch(console.error);

  await request("example/hello", {
    name: "world",
  })
    .then(console.log)
    .catch(console.error);

  await conn.endAsync();
  await (await microservice).endAsync();
};

const run = async () => {
  await microservice;
  await client();
};

run();
