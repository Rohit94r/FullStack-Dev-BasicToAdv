# Day 2 Project — Console Quiz Game (Fill-in-the-Blank)

A terminal quiz game that covers **all Day 2 JavaScript basics**: arrays, objects, loops, functions, `readline`, `fs`, and `setTimeout`.

## Setup

```bash
cd project/quiz-game
node index.js
```

## Build Checklist

Open `index.js` and fill every `TODO`.

### Core

- [ ] Load `questions.json` with `fs.readFileSync` + `JSON.parse`
- [ ] Question bank: array of `{ question, options, answer, difficulty, category }`
- [ ] Ask questions one at a time with `readline`

### Features

- [ ] **Filter** questions by `difficulty` and/or `category` (`.filter()`)
- [ ] **Shuffle** with Fisher-Yates (loop + swap)
- [ ] **Timer** per question (`setTimeout` — resolve `null` on timeout)
- [ ] **Score + streak** — consecutive correct answers add bonus points
- [ ] **Input validation** — invalid option re-prompts (`while` loop)
- [ ] **Final report** — score, accuracy %, category breakdown (`.reduce()`)
- [ ] **High score** — persist best score to `highscore.json`

## Sample Run (when complete)

```
🎮 Welcome to the Console Quiz Game!

Filter difficulty (easy/medium/hard/all): easy
Filter category (or 'all'): arrays

Question 1/5 [easy] (arrays)
Which method adds an element to the END of an array?
1. push
2. pop
3. shift
4. unshift
Your answer (1-4): 1
✅ Correct! (+1, streak: 1)

========== FINAL REPORT ==========
Score: 8
Accuracy: 80%
Max streak: 3
By category: { arrays: 2, variables: 1, ... }
==================================
```

## File Guide

| File | Purpose |
|------|---------|
| `index.js` | Main game — fill in all TODOs |
| `questions.json` | Sample question bank (add more!) |
| `highscore.json` | Created automatically when you beat the high score |

## Hints

- `answer` in JSON is a **0-based index** into `options`
- Use `readline.createInterface` once; call `rl.close()` at the end
- Fisher-Yates: loop backward, swap with random earlier index
- Category breakdown: `byCategory[q.category] = (byCategory[q.category] || 0) + 1`

## Self-Test

- [ ] Invalid input (0, 99, "abc") re-asks without crashing
- [ ] Timeout counts as wrong and resets streak
- [ ] High score survives restarting the game
- [ ] Filtering "hard" + category "objects" returns only matching questions
