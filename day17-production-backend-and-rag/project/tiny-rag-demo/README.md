# Tiny RAG Demo — Day 17 Part B

Minimal RAG pipeline: chunk → embed (stub) → cosine similarity → query.

No vector DB — in-memory array is enough to understand the concept.

## Run

```bash
cd project/tiny-rag-demo
npm install
npm start
```

## Fill in `index.ts`

1. `chunkText()` — split docs into overlapping chunks
2. `embed()` — stub that returns deterministic fake vectors (or call real API)
3. `cosineSimilarity()` — YOU write the math (~5 lines)
4. `search()` — return top 3 chunks for a query
5. `answerQuery()` — print retrieved context + mock LLM response

## Sample docs

- `sample-docs/docker-basics.txt`
- `sample-docs/rag-overview.txt`

## Workflow

TODO → YOUR IDEA → ANSWER → run `npm start` and ask: "What is cosine similarity?"
