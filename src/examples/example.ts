import { createConnection, createMicroservice } from "../index";

const microservice = async () => {
  await createMicroservice(
    { url: "mqtt://localhost", name: "example" },
    {
      hello: async (args: { name: string }) => {
        return `Hello, ${args.name}`;
      },
    }
  );
};

const client = async () => {
  const conn = await createConnection({
    url: "mqtt://localhost",
  });

  const response = await conn.request<string>("example/hello", {
    name: "world",
  });
  console.log(response);
};

const run = async () => {
  await microservice();
  await client();
};

run();
