// =============================================================================
// DAY 2 PROJECT — Console Quiz Game (fill-in-the-blank)
// Run: node index.js
// Covers: variables, loops, functions, arrays, objects, readline, fs, timers
// =============================================================================

const readline = require("readline");
const fs = require("fs");
const path = require("path");

const QUESTIONS_PATH = path.join(__dirname, "questions.json");
const HIGH_SCORE_PATH = path.join(__dirname, "highscore.json");

// ── CONFIG ────────────────────────────────────────────────────────────────────

const CONFIG = {
  questionsPerRound: 5,
  secondsPerQuestion: 15,
  streakBonusPoints: 2,
};

// ── LOAD QUESTION BANK ────────────────────────────────────────────────────────

// TODO: Read questions.json synchronously and parse JSON
// YOUR IDEA: _________________________________________________
// ANSWER: const raw = fs.readFileSync(QUESTIONS_PATH, "utf8");
//         const questionBank = JSON.parse(raw);

let questionBank = [];
try {
  // TODO: Implement load — assign to questionBank
  // _____________________
} catch (err) {
  console.error("Failed to load questions:", err.message);
  process.exit(1);
}

// ── READLINE HELPER ───────────────────────────────────────────────────────────

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function ask(rl, prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// ── FEATURE: FILTER BY DIFFICULTY / CATEGORY ──────────────────────────────────

function filterQuestions(questions, { difficulty, category } = {}) {
  // TODO: Return filtered array using .filter()
  // If difficulty is provided, keep only matching difficulty
  // If category is provided, keep only matching category
  // YOUR IDEA: _________________________________________________
  // ANSWER: return questions.filter((q) => {
  //   if (difficulty && q.difficulty !== difficulty) return false;
  //   if (category && q.category !== category) return false;
  //   return true;
  // });
  // _____________________
}

// ── FEATURE: SHUFFLE (Fisher-Yates) ───────────────────────────────────────────

function shuffle(array) {
  // TODO: Fisher-Yates shuffle IN PLACE, return the array
  // Loop i from array.length - 1 down to 1
  // Pick random j in [0, i], swap array[i] and array[j]
  // YOUR IDEA: _________________________________________________
  // ANSWER:
  // for (let i = array.length - 1; i > 0; i--) {
  //   const j = Math.floor(Math.random() * (i + 1));
  //   [array[i], array[j]] = [array[j], array[i]];
  // }
  // return array;
  // _____________________
}

// ── FEATURE: TIMER PER QUESTION ───────────────────────────────────────────────

function askWithTimeout(rl, prompt, seconds) {
  // TODO: Return a Promise that resolves with the user's answer
  // Use setTimeout — if time runs out, resolve with null (timed out)
  // Clear the timer when the user answers
  // YOUR IDEA: _________________________________________________
  // ANSWER:
  // return new Promise((resolve) => {
  //   let answered = false;
  //   const timer = setTimeout(() => {
  //     if (!answered) { answered = true; console.log("\n⏱ Time's up!"); resolve(null); }
  //   }, seconds * 1000);
  //   rl.question(prompt, (answer) => {
  //     if (!answered) { answered = true; clearTimeout(timer); resolve(answer); }
  //   });
  // });
  // _____________________
}

// ── FEATURE: INPUT VALIDATION ─────────────────────────────────────────────────

async function askValidOption(rl, question, seconds) {
  // TODO: Loop until user enters a valid option number (1 to options.length)
  // Display numbered options, use askWithTimeout for each attempt
  // Return { selectedIndex, timedOut: boolean }
  // YOUR IDEA: _________________________________________________
  // _____________________
}

// ── FEATURE: SCORE + STREAK ───────────────────────────────────────────────────

function createScoreTracker() {
  let score = 0;
  let streak = 0;
  let maxStreak = 0;
  const byCategory = {};

  return {
    recordAnswer(question, selectedIndex, timedOut) {
      // TODO: If timedOut → reset streak, return
      // TODO: If selectedIndex === question.answer → add points + streak bonus
      //       Else → reset streak
      // TODO: Track correct count per category in byCategory
      // YOUR IDEA: _________________________________________________
      // _____________________
    },
    getReport(totalAsked) {
      // TODO: Return { score, accuracy, maxStreak, byCategory }
      // accuracy = (correct / totalAsked) * 100
      // YOUR IDEA: _________________________________________________
      // _____________________
    },
  };
}

// ── FEATURE: FINAL REPORT ─────────────────────────────────────────────────────

function printReport(report, totalAsked) {
  console.log("\n========== FINAL REPORT ==========");
  // TODO: Print score, accuracy %, max streak
  // TODO: Print category breakdown using Object.entries(report.byCategory)
  // YOUR IDEA: _________________________________________________
  // _____________________
  console.log("==================================\n");
}

// ── FEATURE: HIGH SCORE PERSISTENCE ───────────────────────────────────────────

function loadHighScore() {
  // TODO: Read highscore.json if exists, else return { score: 0, date: null }
  // YOUR IDEA: _________________________________________________
  // _____________________
}

function saveHighScore(score) {
  // TODO: Write { score, date: new Date().toISOString() } to highscore.json
  // YOUR IDEA: _________________________________________________
  // _____________________
}

// ── MAIN GAME LOOP ────────────────────────────────────────────────────────────

async function runQuiz() {
  const rl = createInterface();

  console.log("\n🎮 Welcome to the Console Quiz Game!\n");

  // TODO: Ask player for difficulty filter (easy/medium/hard/all)
  // TODO: Ask for category filter or "all"
  // YOUR IDEA: _________________________________________________
  // _____________________

  // TODO: Filter → shuffle → slice first CONFIG.questionsPerRound questions
  // YOUR IDEA: _________________________________________________
  // _____________________

  const tracker = createScoreTracker();
  const round = []; // assign your selected questions here

  for (let i = 0; i < round.length; i++) {
    const q = round[i];
    console.log(`\nQuestion ${i + 1}/${round.length} [${q.difficulty}] (${q.category})`);
    console.log(q.question);

    // TODO: Call askValidOption, then tracker.recordAnswer(...)
    // YOUR IDEA: _________________________________________________
    // _____________________
  }

  const report = tracker.getReport(round.length);
  printReport(report, round.length);

  // TODO: Compare report.score to high score — save if new record
  // YOUR IDEA: _________________________________________________
  // _____________________

  rl.close();
}

// TODO: Call runQuiz() and catch errors
runQuiz().catch(console.error);
