// =============================================================================
// DAY 5 PROJECT — Router.js
// Matches HTTP method + path patterns like /users/:id
// Concepts: regex, params extraction
// =============================================================================

class Router {
  constructor() {
    this.routes = [];
  }

  /**
   * Register a route.
   * @param {string} method — GET, POST, DELETE, ...
   * @param {string} path — e.g. "/users/:id"
   * @param {Function} handler — (req, res) => void | Promise
   */
  add(method, path, handler) {
    // TODO: Push { method: method.toUpperCase(), path, handler, regex, paramNames }
    // Convert path "/users/:id" to regex /^\/users\/([^/]+)$/ and capture param names
    // YOUR IDEA: _________________________________________________
    //
    // ANSWER:
    // const paramNames = [];
    // const pattern = path.replace(/:([^/]+)/g, (_, name) => {
    //   paramNames.push(name);
    //   return "([^/]+)";
    // });
    // const regex = new RegExp(`^${pattern}$`);
    // this.routes.push({ method: method.toUpperCase(), path, handler, regex, paramNames });
    // _____________________
  }

  /**
   * Find matching route for method + pathname.
   * @returns {{ handler, params } | null}
   */
  match(method, pathname) {
    // TODO: Loop routes — if method matches AND regex.test(pathname):
    //   Extract param values with regex.exec, map to paramNames object
    //   Return { handler, params }
    // YOUR IDEA: _________________________________________________
    // _____________________
  }
}

module.exports = Router;
