# DAY 2 — JavaScript Basics (Zero → Solid)

## Today's Goal
JavaScript fundamentals so solid that basic interview questions
(var/let/const, data types, == vs ===, array methods) are automatic answers.

## Morning Revision (2 hr)
Rebuild yesterday's portfolio navbar + skills grid FROM MEMORY in a blank file.
Stuck = look once, delete, redo.

## Lessons (in order) — ALL FILES ALREADY EXIST in `lessons/`
| # | File | Time |
|---|------|------|
| 1 | `01-variables-and-datatypes.js` — var/let/const, 8 data types, falsy values, conversion | 60 min |
| 2 | `02-operators-and-conditions.js` — all operators, == vs ===, ternary, switch, ??, ?. | 50 min |
| 3 | `03-loops.js` — for, while, for...of, for...in, break/continue, FizzBuzz | 50 min |
| 4 | `04-functions.js` — declarations, expressions, arrows, callbacks, recursion, scope, IIFE | 70 min |
| 5 | `05-objects.js` — objects, destructuring, spread, Object.keys/values/entries, freeze | 60 min |
| 6 | `06-arrays-and-strings.js` — every array method, every string method | 70 min |
| 7 | `07-es6-modern-features.js` — template literals, Sets, Maps, Symbols, logical assignment | 60 min |

**Run every file:** `node lessons/01-variables-and-datatypes.js` — then MODIFY examples and re-run.

## Project (6 hours): Console Quiz Game (pure JS, run with node)
Create `project/quiz-game/` here. One small project covering EVERYTHING from today:

Features:
- [ ] Question bank as array of objects (question, options, answer, difficulty, category)
- [ ] Ask questions one by one (use `readline` — I'll show you in the scaffold)
- [ ] Score tracking with streak bonus (streak = consecutive correct → use a counter)
- [ ] Filter questions by difficulty/category (uses `.filter()`)
- [ ] Shuffle questions (Fisher-Yates with a loop)
- [ ] Timer per question (uses `setTimeout` — preview of async!)
- [ ] Final report: score, accuracy %, category breakdown (uses `.reduce()`)
- [ ] High-score persistence to a JSON file (uses `fs` — preview of Node!)
- [ ] Input validation (invalid option → re-ask, uses while loop)

**Project scaffold ready:** `project/quiz-game/` — fill in every `TODO` before checking answers.

## Tonight's Notes
- All 6 falsy values (memorize!)
- == vs === with 3 examples
- map vs filter vs reduce — one line each
- Spread vs rest — one example each
- Why `typeof null === "object"`

## Interview Questions
1. Difference between var, let, const?
2. What are the falsy values?
3. What is destructuring? Show object + array example.
4. slice vs splice?
5. What does Array.from({length: 5}, (_, i) => i) produce?
6. Map vs Object — when each?
