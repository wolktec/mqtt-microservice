import { createConnection, createMicroservice } from "../index";

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
    hello: async (args: { name: string }) => {
      throw new NotImplementedError();
    },
    world: async (args: { name: string }) => {
      const { name } = args;
      return `Hello ${name}`;
    },
  }
);

const client = async () => {
  const { conn, request } = await createConnection({
    url: "mqtt://localhost",
  });

  await request<string>("example/world", {
      name: "world",
    })
    .then(console.log)
    .catch(console.error);

  await request<string>("example/hello", {
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
