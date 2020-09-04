const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

const Hapi = require("@hapi/hapi");

const init = () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  return Promise.all([
    server.register(require("@hapi/vision")),
    server.register(require("@hapi/inert")),
  ])
    .then(() => {
      server.route({
        method: "GET",
        path: "/",
        handler: (request, h) => {
          return h.view("index");
        },
      });

      server.route({
        method: "GET",
        path: "/api/data.json",
        handler: (request, h) => {
          const dataPath = path.resolve(
            process.cwd(),
            "node_modules/quickref/_data"
          );

          return readFile(path.resolve(dataPath, "wcag21.json"), "utf-8").then(
            JSON.parse
          );
        },
      });

      server.route({
        method: "GET",
        path: "/public/{param*}",
        handler: {
          directory: {
            path: "public",
          },
        },
      });

      server.views({
        engines: {
          html: {
            module: require("handlebars"),
          },
        },
        relativeTo: __dirname,
        path: "./views",
      });

      return server.start();
    })
    .then(() => console.log("Server running on %s", server.info.uri));
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
