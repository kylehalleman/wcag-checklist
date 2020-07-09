#!/usr/bin/env node
const { JSDOM } = require("jsdom");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const nunjucks = require("nunjucks");
const minify = require("html-minifier-terser").minify;

nunjucks.configure("src", {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true,
});

const dataPath = path.resolve(process.cwd(), "node_modules/quickref/_data");

readFile(path.resolve(dataPath, "wcag21.json"), "utf-8").then((json) => {
  const { principles } = JSON.parse(json);

  const rendered = nunjucks.render("index.html", { principles });

  mkdir(path.resolve(process.cwd(), "build"), { recursive: true }).then(() =>
    writeFile(
      path.resolve(process.cwd(), "build/index.html"),
      minify(rendered, { collapseWhitespace: true })
    )
  );

  console.log(principles);
});
