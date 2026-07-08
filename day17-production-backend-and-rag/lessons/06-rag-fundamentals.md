# Day 17 — Lesson 6: RAG Fundamentals

> Retrieval-Augmented Generation — give an LLM relevant context from YOUR data instead of relying on training memory alone.

## The problem RAG solves

LLMs don't know your private docs, and they hallucinate. RAG **retrieves** relevant chunks from your knowledge base and **augments** the prompt before generation.

```
User question
     ↓
[Embed query] → vector
     ↓
[Similarity search] → top K document chunks
     ↓
[Build prompt] = system + retrieved chunks + user question
     ↓
[LLM generates answer grounded in your docs]
```

---

## Step 1: Embeddings (text → vectors)

An **embedding** is a list of numbers (e.g. 1536 floats) representing semantic meaning.

- Similar meanings → vectors close together in space
- "How do I reset my password?" and "Forgot login credentials" → similar vectors
- Produced by models like OpenAI `text-embedding-3-small` or local `sentence-transformers`

```text
"Docker runs containers" → [0.02, -0.14, 0.88, ...]  (1536 dims)
"Kubernetes orchestrates pods" → [0.01, -0.11, 0.91, ...]
```

---

## Step 2: Chunking

Don't embed entire PDFs — split into **chunks** (300–800 tokens) with overlap.

Why?
- Embeddings capture local meaning
- Retrieval returns precise paragraphs, not whole books

Common strategies:
- **Fixed size** — 500 chars, 50 char overlap
- **By paragraph/heading** — respect document structure
- **Recursive** — split by `\n\n`, then sentences

---

## Step 3: Cosine similarity

Compare query vector **q** and chunk vector **c**:

```
similarity = (q · c) / (||q|| × ||c||)
```

Result between -1 and 1 (usually 0–1 for normalized embeddings). **Higher = more relevant.**

You can implement this in 5 lines — see `project/tiny-rag-demo/index.ts`.

---

## Step 4: Vector storage

Production: **Pinecone**, **Weaviate**, **pgvector** (Postgres extension), **Chroma**.

Learning/demo: in-memory array of `{ text, embedding }` — same concept, no infra.

---

## Step 5: The full RAG pipeline

| Phase | What happens |
|-------|----------------|
| **Ingest** | Load docs (PDF, txt, markdown) |
| **Chunk** | Split into pieces |
| **Embed** | Each chunk → vector |
| **Store** | Save text + vector (+ metadata) |
| **Query** | User question → embed → similarity search → top 3 chunks |
| **Augment** | Put chunks in prompt: "Answer using only this context: …" |
| **Generate** | LLM produces grounded answer |

---

## RAG vs fine-tuning

| | RAG | Fine-tuning |
|---|-----|-------------|
| Updates | Add new docs anytime | Retrain model |
| Cost | Lower for changing data | Higher |
| Best for | Q&A over private docs | Style, format, domain tone |
| Hallucination | Reduced with good retrieval | Can still hallucinate |

Most production "chat with your docs" products use **RAG**, not fine-tuning.

---

## Example prompt template

```
You are a helpful assistant. Answer ONLY using the context below.
If the answer is not in the context, say "I don't know."

Context:
---
{chunk1}
---
{chunk2}
---

Question: {user_question}
```

---

## Interview Q&A

**Q: What is an embedding?**  
A: A dense vector representation of text where semantic similarity maps to geometric closeness.

**Q: What is cosine similarity?**  
A: Measures angle between two vectors — standard metric for comparing embeddings.

**Q: Why chunk documents?**  
A: Embeddings work best on focused text; retrieval returns relevant passages not whole files.

**Q: Walk through the RAG pipeline.**  
A: Ingest → chunk → embed → store → on query embed question → retrieve top-K similar chunks → augment prompt → LLM generates answer.

**Q: Why RAG instead of fine-tuning?**  
A: Easier to update knowledge, lower cost, no retraining when docs change — ideal for dynamic private data.
