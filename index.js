#!/usr/bin/env node
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
const buildDir = path.resolve(process.cwd(), "build");

readFile(path.resolve(dataPath, "wcag21.json"), "utf-8").then((json) => {
  const { principles } = JSON.parse(json);

  const rendered = nunjucks.render("index.html", { principles });
  const minified = minify(rendered, { collapseWhitespace: true });

  mkdir(buildDir, { recursive: true }).then(() =>
    writeFile(path.resolve(buildDir, "index.html"), minified)
  );
});
