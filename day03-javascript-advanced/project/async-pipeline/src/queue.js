// =============================================================================
// DAY 3 PROJECT — queue.js
// Rate limiter: max N concurrent async tasks (queue + event loop)
// Concepts: Promises, closures, class/EventEmitter-style logging
// =============================================================================

import { EventEmitter } from "events";

/**
 * Simple EventEmitter wrapper for pipeline logging.
 * (Uses Node's built-in EventEmitter — same pattern as Day 5 lesson 7.)
 */
export class PipelineEvents extends EventEmitter {
  log(event, data) {
    this.emit(event, data);
    console.log(`[pipeline:${event}]`, data);
  }
}

/**
 * Create a concurrency-limited task queue.
 * At most `maxConcurrent` tasks run at once; others wait in line.
 *
 * @param {number} maxConcurrent — default 2
 * @returns {{ add(fn): Promise, pending: number, running: number }}
 */
export function createQueue(maxConcurrent = 2) {
  // TODO: Closure state — running count, waiting queue array
  // YOUR IDEA: _________________________________________________
  // ANSWER:
  // let running = 0;
  // const waiting = [];
  // _____________________

  function tryRunNext() {
    // TODO: While running < maxConcurrent AND waiting has tasks:
    //   Dequeue next { fn, resolve, reject }
    //   Increment running, run fn(), on settle decrement running and tryRunNext
    // YOUR IDEA: _________________________________________________
    // _____________________
  }

  return {
    add(fn) {
      // TODO: Return a Promise that enqueues fn and calls tryRunNext
      // YOUR IDEA: _________________________________________________
      //
      // ANSWER:
      // return new Promise((resolve, reject) => {
      //   waiting.push({ fn, resolve, reject });
      //   tryRunNext();
      // });
      // _____________________
    },

    get pending() {
      // TODO: Return waiting.length
      // _____________________
    },

    get running() {
      // TODO: Return running count
      // _____________________
    },
  };
}

/**
 * Run an array of async factories with concurrency limit.
 * Uses Promise.allSettled for partial failure handling.
 *
 * @param {Array<() => Promise>} tasks
 * @param {number} maxConcurrent
 */
export async function runBatch(tasks, maxConcurrent = 2) {
  const queue = createQueue(maxConcurrent);

  // TODO: Map each task to queue.add(task)
  // Return Promise.allSettled on all those promises
  // YOUR IDEA: _________________________________________________
  // ANSWER: return Promise.allSettled(tasks.map((task) => queue.add(task)));
  // _____________________
}
