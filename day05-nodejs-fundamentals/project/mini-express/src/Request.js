// =============================================================================
// DAY 5 PROJECT — Request.js
// Wraps Node's raw http.IncomingMessage with parsed URL, query, body
// Concepts: streams, URL parsing, Buffer.concat
// =============================================================================

const { URL } = require("url");

class Request {
  constructor(rawReq) {
    this.raw = rawReq;
    this.method = rawReq.method;
    this.headers = rawReq.headers;

    // TODO: Parse req.url with new URL(req.url, "http://localhost")
    // Set this.pathname = url.pathname
    // Set this.query = Object.fromEntries(url.searchParams)
    // YOUR IDEA: _________________________________________________
    // ANSWER:
    // const url = new URL(rawReq.url, "http://localhost");
    // this.pathname = url.pathname;
    // this.query = Object.fromEntries(url.searchParams);
    // _____________________

    this.pathname = rawReq.url?.split("?")[0] || "/";
    this.query = {};
    this.params = {}; // filled by Router when route matches :id style params
    this.body = null; // filled by body-parser middleware
  }

  /**
   * Read JSON body from the request stream.
   * Call once — collects chunks until "end".
   */
  async parseBody() {
    // TODO: Return a Promise that collects data chunks, concat, JSON.parse
    // Empty body → return {}
    // Invalid JSON → throw Error("Invalid JSON body")
    // YOUR IDEA: _________________________________________________
    //
    // ANSWER:
    // return new Promise((resolve, reject) => {
    //   const chunks = [];
    //   this.raw.on("data", (chunk) => chunks.push(chunk));
    //   this.raw.on("end", () => {
    //     try {
    //       const raw = Buffer.concat(chunks).toString("utf8");
    //       resolve(raw ? JSON.parse(raw) : {});
    //     } catch {
    //       reject(new Error("Invalid JSON body"));
    //     }
    //   });
    //   this.raw.on("error", reject);
    // });
    // _____________________
  }
}

module.exports = Request;
