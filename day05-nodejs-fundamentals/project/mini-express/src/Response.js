// =============================================================================
// DAY 5 PROJECT — Response.js
// Wraps Node's raw http.ServerResponse with helper methods
// Concepts: status codes, headers, JSON serialization
// =============================================================================

class Response {
  constructor(rawRes) {
    this.raw = rawRes;
    this.statusCode = 200;
    this._headers = { "Content-Type": "application/json" };
  }

  /**
   * Chainable status setter — res.status(404).json({ error: "..." })
   */
  status(code) {
    // TODO: Set this.statusCode and return this
    // YOUR IDEA: _________________________________________________
    // ANSWER: this.statusCode = code; return this;
    // _____________________
  }

  /**
   * Set a response header.
   */
  setHeader(name, value) {
    this._headers[name] = value;
    return this;
  }

  /**
   * Send plain text (or Buffer). Ends the response.
   */
  send(data) {
    // TODO: writeHead with this.statusCode and this._headers
    // If data is object, stringify; else String(data)
    // Call raw.end(body)
    // YOUR IDEA: _________________________________________________
    // _____________________
  }

  /**
   * Send JSON. Sets Content-Type automatically.
   */
  json(data) {
    // TODO: setHeader Content-Type application/json, then send stringified data
    // YOUR IDEA: _________________________________________________
    // ANSWER:
    // this.setHeader("Content-Type", "application/json");
    // this.send(JSON.stringify(data));
    // _____________________
  }
}

module.exports = Response;
