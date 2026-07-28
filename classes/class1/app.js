import http from "http";

function process(req, res) {
  if (req.method === "GET" && req.url === "/test") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h1>Hello World</h1>");
    res.end();
  } else {
    res.writeHead(404);
    res.end("Not Found.");
  }
}

const server = http.createServer(process);
server.listen(3000);
console.log("Listening on port 3000");
console.log("URL: http://localhost:3000/test");

// URL: http://localhost:3000/test
