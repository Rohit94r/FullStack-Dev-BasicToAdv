/**
 * Tiny RAG Demo — fill in the blanks, then run: npm start
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, "sample-docs");

type Chunk = {
  id: string;
  text: string;
  source: string;
  embedding: number[];
};

// =============================================================================
// TODO: chunkText(text, chunkSize = 200, overlap = 40) → string[]
// Split text into overlapping chunks for embedding
// YOUR IDEA: write your attempt here first ↓


// ─── ANSWER ───
// function chunkText(text: string, chunkSize = 200, overlap = 40): string[] {
//   const chunks: string[] = [];
//   let start = 0;
//   while (start < text.length) {
//     chunks.push(text.slice(start, start + chunkSize).trim());
//     start += chunkSize - overlap;
//   }
//   return chunks.filter(Boolean);
// }

function chunkText(_text: string, _chunkSize = 200, _overlap = 40): string[] {
  throw new Error("Implement chunkText");
}


// =============================================================================
// TODO: embed(text) — stub: return fixed-length vector from char codes
// (In production: call OpenAI embeddings API or local model)
// YOUR IDEA: write your attempt here first ↓


// ─── ANSWER ───
// function embed(text: string, dims = 32): number[] {
//   const vec = new Array(dims).fill(0);
//   for (let i = 0; i < text.length; i++) {
//     vec[i % dims] += text.charCodeAt(i) / 1000;
//   }
//   const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
//   return vec.map((v) => v / mag);
// }

function embed(_text: string): number[] {
  throw new Error("Implement embed");
}


// =============================================================================
// TODO: cosineSimilarity(a, b) — dot product / (||a|| * ||b||)
// YOUR IDEA: write your attempt here first ↓


// ─── ANSWER ───
// function cosineSimilarity(a: number[], b: number[]): number {
//   const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
//   const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
//   const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
//   return dot / (magA * magB || 1);
// }

function cosineSimilarity(_a: number[], _b: number[]): number {
  throw new Error("Implement cosineSimilarity");
}


function loadDocuments(): Chunk[] {
  const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".txt"));
  const chunks: Chunk[] = [];
  let id = 0;

  for (const file of files) {
    const text = fs.readFileSync(path.join(DOCS_DIR, file), "utf-8");
    for (const piece of chunkText(text)) {
      chunks.push({
        id: String(id++),
        text: piece,
        source: file,
        embedding: embed(piece),
      });
    }
  }
  return chunks;
}


function search(store: Chunk[], query: string, topK = 3): Chunk[] {
  // TODO: Embed query, score all chunks with cosineSimilarity, return top K
  // YOUR IDEA: write your attempt here first ↓


  // ─── ANSWER ───
  // const qVec = embed(query);
  // return [...store]
  //   .map((chunk) => ({ chunk, score: cosineSimilarity(qVec, chunk.embedding) }))
  //   .sort((a, b) => b.score - a.score)
  //   .slice(0, topK)
  //   .map((r) => r.chunk);

  return [];
}


function answerQuery(store: Chunk[], query: string): void {
  const results = search(store, query);
  console.log(`\nQuery: "${query}"\n`);
  console.log("Top chunks:");
  results.forEach((c, i) => {
    console.log(`  ${i + 1}. [${c.source}] ${c.text.slice(0, 80)}…`);
  });

  const context = results.map((c) => c.text).join("\n---\n");
  console.log("\nMock LLM answer (using retrieved context):");
  console.log(`Based on the docs: ${context.slice(0, 200)}…`);
}


function main() {
  console.log("Loading and indexing documents…");
  const store = loadDocuments();
  console.log(`Indexed ${store.length} chunks`);

  answerQuery(store, "What is cosine similarity in RAG?");
  answerQuery(store, "How do I run postgres with docker-compose?");
}

main();
