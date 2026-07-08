// =============================================================================
// DAY 5 PROJECT — App.js
// Tiny Express clone: routing + middleware chain + listen()
// THE KEY CONCEPT: middleware runs in order; call next() to continue
// =============================================================================

const http = require("http");
const Router = require("./Router");
const Request = require("./Request");
const Response = require("./Response");

class App {
  constructor() {
    this.router = new Router();
    this.middlewares = [];
  }

  // ── ROUTE REGISTRATION ──────────────────────────────────────────────────────

  get(path, handler) {
    // TODO: this.router.add("GET", path, handler)
    // _____________________
  }

  post(path, handler) {
    // TODO: this.router.add("POST", path, handler)
    // _____________________
  }

  delete(path, handler) {
    // TODO: this.router.add("DELETE", path, handler)
    // _____________________
  }

  // ── MIDDLEWARE ──────────────────────────────────────────────────────────────

  use(fn) {
    // TODO: Push fn onto this.middlewares array
    // fn signature: (req, res, next) => void
    // YOUR IDEA: _________________________________________________
    // ANSWER: this.middlewares.push(fn);
    // _____________________
  }

  // ── MIDDLEWARE RUNNER (THE HEART OF EXPRESS) ────────────────────────────────

  /**
   * Run middleware stack + final handler.
   * index tracks position — calling next() increments and runs next fn.
   */
  _runStack(req, res, stack, finalHandler) {
    let index = 0;

    const next = (err) => {
      // TODO: If err is passed → jump to error-handling (see _handleError below)
      // If index >= stack.length → call finalHandler(req, res, next)
      // Else call stack[index++](req, res, next) inside try/catch
      // YOUR IDEA: _________________________________________________
      // _____________________
    };

    next();
  }

  // ── REQUEST HANDLER ─────────────────────────────────────────────────────────

  _handleRequest(rawReq, rawRes) {
    const req = new Request(rawReq);
    const res = new Response(rawRes);

    const routeHandler = async (req, res, next) => {
      // TODO: Match route with this.router.match(req.method, req.pathname)
      // If no match → call next() with Error("Not Found") or a 404 marker
      // If match → assign req.params = match.params, await match.handler(req, res, next)
      // YOUR IDEA: _________________________________________________
      // _____________________
    };

    const notFoundHandler = (req, res) => {
      // TODO: res.status(404).json({ error: `Cannot ${req.method} ${req.pathname}` })
      // _____________________
    };

    const errorHandler = (err, req, res, next) => {
      // TODO: Log err.message, send res.status(500).json({ error: err.message })
      // (Express error middleware has 4 args — err first)
      // _____________________
    };

    // TODO: Build stack = [...this.middlewares, routeHandler]
    // Run _runStack; on 404 call notFoundHandler; on error call errorHandler
    // YOUR IDEA: _________________________________________________
    // _____________________
  }

  // ── START SERVER ────────────────────────────────────────────────────────────

  listen(port, callback) {
    // TODO: http.createServer((req, res) => this._handleRequest(req, res))
    // Call server.listen(port, callback)
    // Return server instance
    // YOUR IDEA: _________________________________________________
    //
    // ANSWER:
    // const server = http.createServer((req, res) => this._handleRequest(req, res));
    // server.listen(port, callback);
    // return server;
    // _____________________
  }
}

module.exports = App;
