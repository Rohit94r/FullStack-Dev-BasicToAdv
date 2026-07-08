// ============================================================
// DAY 5 — LESSON 6: STREAMS & BUFFERS — HANDLING BIG DATA
// Level: Intermediate → Advanced
// Run with:  node 06-streams-and-buffers.js
// (Creates a temp folder "stream-playground" and cleans it up.)
// ============================================================

const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const { pipeline } = require("stream/promises");
const zlib = require("zlib"); // built-in compression (for the pipe demo)

const DIR = path.join(__dirname, "stream-playground");
fs.mkdirSync(DIR, { recursive: true });

// ─────────────────────────────────────────────────────────────
// SECTION 1: WHAT IS A BUFFER?
// ─────────────────────────────────────────────────────────────
//
// A Buffer = a chunk of RAW BYTES (numbers 0-255) in memory.
// JavaScript strings are for TEXT; but files, images, and network
// packets are BYTES. Buffer is Node's container for bytes.
//
// ANALOGY: a string is a printed page you can read; a Buffer is
// the box of ink dots before they become letters. An ENCODING
// (like utf8) is the rulebook for turning dots into letters.

// Make a buffer from text:
const buf = Buffer.from("Hi ✅"); // utf8 by default
console.log(buf);
// Expected output: <Buffer 48 69 20 e2 9c 85>
//   48 = 'H', 69 = 'i', 20 = space, and the ✅ emoji takes THREE bytes!

console.log("string length:", "Hi ✅".length); // 4  (JS counts UTF-16 units)
console.log("byte length  :", buf.length); // 6  (real bytes)
// WHY it matters: Content-Length headers, file sizes, and slicing
// binary data all count BYTES, not characters.

// Bytes → text again (decode with an encoding):
console.log(buf.toString("utf8")); // Expected output: Hi ✅
console.log(buf.toString("hex")); // Expected output: 486920e29c85
console.log(buf.toString("base64")); // Expected output: SGkg4pyF
// base64 = a way to write bytes using only safe text characters
// (used in data: URLs, JWT tokens, email attachments).

// You already met Buffers: fs.readFile without encoding returns one,
// and http request "data" chunks are Buffers!

// ─────────────────────────────────────────────────────────────
// SECTION 2: WHAT IS A STREAM? (and WHY)
// ─────────────────────────────────────────────────────────────
//
// PROBLEM: fs.readFile("movie-2GB.mp4") loads ALL 2 GB into RAM
// before you can touch byte one. Your server dies.
//
// STREAM = data flowing piece by piece, processed as it arrives.
// ANALOGY: watering a garden.
//   readFile = filling a giant bucket first, then carrying it (heavy!).
//   stream   = a hose — water flows through, you never hold it all.
//
// The 4 stream types:
//   Readable  — data comes OUT (fs.createReadStream, http req)
//   Writable  — data goes IN  (fs.createWriteStream, http res)
//   Duplex    — both directions (a TCP socket)
//   Transform — data goes in, changed data comes out (gzip, encryption)

async function main() {
  // ── Setup: create a test file with many lines ───────────────
  const bigFile = path.join(DIR, "big.txt");
  const line = "This is one line of log data for our streaming demo.\n";
  await fsp.writeFile(bigFile, line.repeat(5000)); // ~270 KB
  const { size } = await fsp.stat(bigFile);
  console.log(`\ntest file created: ${(size / 1024).toFixed(0)} KB`);

  // ── SECTION 3: READABLE STREAM — read in chunks ─────────────
  // highWaterMark = preferred chunk size in bytes (default 64 KB).
  await new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(bigFile, { highWaterMark: 64 * 1024 });

    let chunkCount = 0;
    let byteCount = 0;

    // "data" fires every time a chunk is ready. chunk is a Buffer.
    readStream.on("data", (chunk) => {
      chunkCount++;
      byteCount += chunk.length;
      // Only ~64 KB is in memory at any moment — not the whole file!
    });

    // "end" = no more data. "error" = something broke (ALWAYS handle it).
    readStream.on("end", () => {
      console.log(`read ${byteCount} bytes in ${chunkCount} chunks (~64KB each)`);
      // Expected output: read 270000 bytes in 5 chunks (~64KB each)
      resolve();
    });
    readStream.on("error", reject);
  });

  // ── SECTION 4: WRITABLE STREAM — write in pieces ────────────
  const outFile = path.join(DIR, "written.txt");
  await new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(outFile);
    for (let i = 1; i <= 3; i++) {
      writeStream.write(`piece ${i}\n`); // queue a chunk
    }
    writeStream.end("final piece\n"); // last chunk + close
    writeStream.on("finish", resolve); // all data flushed to disk
    writeStream.on("error", reject);
  });
  console.log("written.txt:", JSON.stringify(await fsp.readFile(outFile, "utf8")));
  // Expected output: "piece 1\npiece 2\npiece 3\nfinal piece\n"

  // ── SECTION 5: pipe — connect streams like LEGO ─────────────
  // source.pipe(destination) moves data automatically AND handles
  // BACKPRESSURE: if the writer is slower than the reader, pipe
  // pauses the reader so memory doesn't explode.
  // ANALOGY: pouring water through a funnel — if the funnel is full,
  // you stop pouring for a second. pipe does that pause for you.
  //
  // Modern best practice: pipeline() instead of .pipe(), because
  // pipeline forwards ERRORS properly and returns a promise:

  const gzFile = path.join(DIR, "big.txt.gz");
  await pipeline(
    fs.createReadStream(bigFile), // Readable  (source)
    zlib.createGzip(), // Transform (compress on the fly!)
    fs.createWriteStream(gzFile) // Writable  (destination)
  );
  const gzSize = (await fsp.stat(gzFile)).size;
  console.log(
    `gzip pipeline: ${(size / 1024).toFixed(0)} KB → ${(gzSize / 1024).toFixed(1)} KB compressed`
  );
  // Expected output: gzip pipeline: 264 KB → ~1 KB compressed
  // (Repeated text compresses extremely well.)
  // Note: we compressed the file WITHOUT ever holding it all in RAM.

  // ── SECTION 6: streams in HTTP (the real-world payoff) ──────
  // This pattern serves a video/big file to a browser with tiny memory:
  //
  //   http.createServer((req, res) => {
  //     res.writeHead(200, { "Content-Type": "video/mp4" });
  //     fs.createReadStream("movie.mp4").pipe(res);  // res IS a writable stream!
  //   });
  //
  // And you ALREADY used streams in lesson 5: collecting req "data"
  // chunks to parse a JSON body — req is a Readable stream.

  // Cleanup
  await fsp.rm(DIR, { recursive: true, force: true });
  console.log("cleaned up stream-playground ✅");
}

main().catch((err) => {
  console.error("demo failed:", err);
  process.exitCode = 1;
});

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
//
// Q1: What is a Buffer?
// A1: A fixed-size chunk of raw bytes outside V8's string world.
//     Node uses Buffers for anything binary: files, network packets,
//     crypto. Convert to text with buf.toString(encoding).
//
// Q2: What is a Stream and why use one?
// A2: An interface for processing data piece by piece as it flows,
//     instead of loading everything into memory first. Use for big
//     files, network data, and anything where you want constant,
//     small memory usage and faster time-to-first-byte.
//
// Q3: Name the 4 stream types with examples.
// A3: Readable (fs.createReadStream, http request), Writable
//     (fs.createWriteStream, http response), Duplex (TCP socket —
//     both), Transform (zlib gzip — modifies data passing through).
//
// Q4: What is backpressure?
// A4: When the destination is slower than the source, data piles
//     up in memory. Backpressure is the signal (write() returns
//     false / 'drain' event) to pause reading. pipe()/pipeline()
//     handle it automatically.
//
// Q5: pipe() vs pipeline()?
// A5: Both connect streams. pipeline() (stream/promises) also
//     propagates errors from EVERY stream in the chain, destroys
//     all streams on failure, and returns a promise. Prefer it.
//
// Q6: Why does "✅".length differ from its byte length?
// A6: JS strings count UTF-16 code units, while utf8 encoding may
//     use 1-4 bytes per character. Emoji ✅ = 1 visible char but
//     3 utf8 bytes. Use Buffer.byteLength(str) for real sizes.
//
// Q7: How would you serve a 2 GB file over HTTP?
// A7: fs.createReadStream(file).pipe(res) — streams it chunk by
//     chunk with ~64 KB in memory, instead of readFile which would
//     load 2 GB into RAM.
//
// Q8: What events does a Readable stream emit?
// A8: "data" (a chunk arrived), "end" (no more data), "error"
//     (failure — always handle it!), "close". Writables emit
//     "drain", "finish", "error".
//
// Q9: What is highWaterMark?
// A9: The internal buffer size limit of a stream (default 64 KB for
//     files, 16 KB for others). It controls chunk size and when
//     backpressure kicks in.
//
// Q10: Where did we already use streams without noticing?
// A10: HTTP: req is a Readable (that's why POST bodies arrive as
//      chunks) and res is a Writable (that's why res.end() exists).
