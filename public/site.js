console.log("shite");

fetch("/api/data.json")
  .then((res) => (res.ok ? res.json() : null))
  .then((data) => {
    console.log("hey");
    console.log(data);
  });
