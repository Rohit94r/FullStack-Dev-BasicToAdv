// =============================================================================
// DAY 2 PROJECT — Console Quiz Game (fill-in-the-blank)
// Run after you finish: node index.js
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
// SIMPLE IDEA:
// 1. Read questions.json as text.
// 2. Convert JSON text into a JavaScript array.
// 3. Store it inside questionBank.
//
// ANSWER EXAMPLE:
// const raw = fs.readFileSync(QUESTIONS_PATH, "utf8");
// questionBank = JSON.parse(raw);

let questionBank = [];
try {
  // TYPE YOUR CODE HERE:



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
  // If difficulty is provided, keep only matching difficulty.
  // If category is provided, keep only matching category.
  //
  // SIMPLE IDEA:
  // .filter() checks every question.
  // return true  = keep question
  // return false = remove question
  //
  // ANSWER EXAMPLE:
  // return questions.filter((q) => {
  //   if (difficulty && q.difficulty !== difficulty) return false;
  //   if (category && q.category !== category) return false;
  //   return true;
  // });

  // TYPE YOUR CODE HERE:



}

// ── FEATURE: SHUFFLE (Fisher-Yates) ───────────────────────────────────────────

function shuffle(array) {
  // TODO: Fisher-Yates shuffle IN PLACE, return the array
  // Loop i from array.length - 1 down to 1.
  // Pick random j in [0, i].
  // Swap array[i] and array[j].
  //
  // SIMPLE IDEA:
  // Start from the end and swap each item with a random earlier item.
  //
  // ANSWER EXAMPLE:
  // for (let i = array.length - 1; i > 0; i--) {
  //   const j = Math.floor(Math.random() * (i + 1));
  //   [array[i], array[j]] = [array[j], array[i]];
  // }
  // return array;

  // TYPE YOUR CODE HERE:



}

// ── FEATURE: TIMER PER QUESTION ───────────────────────────────────────────────

function askWithTimeout(rl, prompt, seconds) {
  // TODO: Return a Promise that resolves with the user's answer.
  // Use setTimeout. If time runs out, resolve with null.
  // Clear the timer when the user answers.
  //
  // SIMPLE IDEA:
  // Start two things:
  // 1. A timer.
  // 2. A question prompt.
  // Whichever finishes first gives the result.
  //
  // ANSWER EXAMPLE:
  // return new Promise((resolve) => {
  //   let answered = false;
  //
  //   const timer = setTimeout(() => {
  //     if (!answered) {
  //       answered = true;
  //       console.log("\nTime's up!");
  //       resolve(null);
  //     }
  //   }, seconds * 1000);
  //
  //   rl.question(prompt, (answer) => {
  //     if (!answered) {
  //       answered = true;
  //       clearTimeout(timer);
  //       resolve(answer);
  //     }
  //   });
  // });

  // TYPE YOUR CODE HERE:



}

// ── FEATURE: INPUT VALIDATION ─────────────────────────────────────────────────

async function askValidOption(rl, question, seconds) {
  // TODO: Loop until user enters a valid option number.
  // Display numbered options.
  // Use askWithTimeout for each attempt.
  // Return { selectedIndex, timedOut: boolean }.
  //
  // SIMPLE IDEA:
  // Show options, ask answer, convert answer to number, check range.
  //
  // ANSWER EXAMPLE:
  // while (true) {
  //   question.options.forEach((option, index) => {
  //     console.log(`${index + 1}. ${option}`);
  //   });
  //
  //   const answer = await askWithTimeout(
  //     rl,
  //     `Your answer (1-${question.options.length}): `,
  //     seconds
  //   );
  //
  //   if (answer === null) {
  //     return { selectedIndex: null, timedOut: true };
  //   }
  //
  //   const selectedNumber = Number(answer.trim());
  //   const selectedIndex = selectedNumber - 1;
  //
  //   if (
  //     Number.isInteger(selectedNumber) &&
  //     selectedIndex >= 0 &&
  //     selectedIndex < question.options.length
  //   ) {
  //     return { selectedIndex, timedOut: false };
  //   }
  //
  //   console.log(`Please enter a number from 1 to ${question.options.length}.`);
  // }

  // TYPE YOUR CODE HERE:



}

// ── FEATURE: SCORE + STREAK ───────────────────────────────────────────────────

function createScoreTracker() {
  let score = 0;
  let correct = 0;
  let streak = 0;
  let maxStreak = 0;
  const byCategory = {};

  return {
    recordAnswer(question, selectedIndex, timedOut) {
      // TODO: If timedOut, reset streak.
      // TODO: If selectedIndex === question.answer, add score and streak bonus.
      // TODO: If wrong, reset streak.
      // TODO: Track correct count per category in byCategory.
      //
      // SIMPLE IDEA:
      // Correct answer = score goes up, streak goes up.
      // Wrong or timeout = streak becomes 0.
      //
      // ANSWER EXAMPLE:
      // if (timedOut) {
      //   streak = 0;
      //   return { correct: false, timedOut: true, points: 0, streak };
      // }
      //
      // if (selectedIndex === question.answer) {
      //   correct++;
      //   streak++;
      //   maxStreak = Math.max(maxStreak, streak);
      //
      //   const points = 1 + (streak > 1 ? CONFIG.streakBonusPoints : 0);
      //   score += points;
      //   byCategory[question.category] = (byCategory[question.category] || 0) + 1;
      //
      //   return { correct: true, timedOut: false, points, streak };
      // }
      //
      // streak = 0;
      // return { correct: false, timedOut: false, points: 0, streak };

      // TYPE YOUR CODE HERE:



    },
    getReport(totalAsked) {
      // TODO: Return { score, accuracy, maxStreak, byCategory }
      // accuracy = (correct / totalAsked) * 100
      //
      // SIMPLE IDEA:
      // Put final values into one object and return it.
      //
      // ANSWER EXAMPLE:
      // return {
      //   score,
      //   accuracy: totalAsked === 0 ? 0 : (correct / totalAsked) * 100,
      //   maxStreak,
      //   byCategory,
      // };

      // TYPE YOUR CODE HERE:



    },
  };
}

// ── FEATURE: FINAL REPORT ─────────────────────────────────────────────────────

function printReport(report, totalAsked) {
  console.log("\n========== FINAL REPORT ==========");
  // TODO: Print score, accuracy %, max streak.
  // TODO: Print category breakdown using Object.entries(report.byCategory).
  //
  // SIMPLE IDEA:
  // Use console.log for normal values.
  // Use Object.entries() to loop through category results.
  //
  // ANSWER EXAMPLE:
  // console.log(`Questions asked: ${totalAsked}`);
  // console.log(`Score: ${report.score}`);
  // console.log(`Accuracy: ${report.accuracy.toFixed(0)}%`);
  // console.log(`Max streak: ${report.maxStreak}`);
  //
  // console.log("By category:");
  // const entries = Object.entries(report.byCategory);
  //
  // if (entries.length === 0) {
  //   console.log("  No correct answers yet.");
  // } else {
  //   entries.forEach(([category, count]) => {
  //     console.log(`  ${category}: ${count}`);
  //   });
  // }

  // TYPE YOUR CODE HERE:



  console.log("==================================\n");
}

// ── FEATURE: HIGH SCORE PERSISTENCE ───────────────────────────────────────────

function loadHighScore() {
  // TODO: Read highscore.json if it exists.
  // If it does not exist, return { score: 0, date: null }.
  //
  // SIMPLE IDEA:
  // Check if file exists first, then read it.
  //
  // ANSWER EXAMPLE:
  // if (!fs.existsSync(HIGH_SCORE_PATH)) {
  //   return { score: 0, date: null };
  // }
  //
  // const raw = fs.readFileSync(HIGH_SCORE_PATH, "utf8");
  // return JSON.parse(raw);

  // TYPE YOUR CODE HERE:



}

function saveHighScore(score) {
  // TODO: Write { score, date: new Date().toISOString() } to highscore.json.
  //
  // SIMPLE IDEA:
  // Create an object, convert it to JSON, then save it.
  //
  // ANSWER EXAMPLE:
  // const highScore = {
  //   score,
  //   date: new Date().toISOString(),
  // };
  //
  // fs.writeFileSync(HIGH_SCORE_PATH, JSON.stringify(highScore, null, 2));

  // TYPE YOUR CODE HERE:



}

// ── MAIN GAME LOOP ────────────────────────────────────────────────────────────

async function runQuiz() {
  const rl = createInterface();

  console.log("\nWelcome to the Console Quiz Game!\n");

  // TODO: Ask player for difficulty filter: easy/medium/hard/all.
  // TODO: Ask player for category filter or all.
  //
  // SIMPLE IDEA:
  // Ask two questions. Clean answers using trim() and toLowerCase().
  //
  // ANSWER EXAMPLE:
  // const difficultyInput = await ask(
  //   rl,
  //   "Filter difficulty (easy/medium/hard/all): "
  // );
  // const categoryInput = await ask(rl, "Filter category (or 'all'): ");
  //
  // const difficulty = difficultyInput.trim().toLowerCase();
  // const category = categoryInput.trim().toLowerCase();
  //
  // const filters = {
  //   difficulty: difficulty === "all" || difficulty === "" ? undefined : difficulty,
  //   category: category === "all" || category === "" ? undefined : category,
  // };

  // TYPE YOUR CODE HERE:



  // TODO: Filter, shuffle, and take first CONFIG.questionsPerRound questions.
  //
  // SIMPLE IDEA:
  // Filter first, copy array, shuffle, then slice.
  //
  // ANSWER EXAMPLE:
  // const round = shuffle([...filterQuestions(questionBank, filters)]).slice(
  //   0,
  //   CONFIG.questionsPerRound
  // );
  //
  // if (round.length === 0) {
  //   console.log("\nNo questions matched your filters. Try again with 'all'.");
  //   rl.close();
  //   return;
  // }

  // TYPE YOUR CODE HERE:



  const tracker = createScoreTracker();
  const round = []; // Replace this when you write your filter/shuffle code.

  for (let i = 0; i < round.length; i++) {
    const q = round[i];
    console.log(`\nQuestion ${i + 1}/${round.length} [${q.difficulty}] (${q.category})`);
    console.log(q.question);

    // TODO: Call askValidOption, then tracker.recordAnswer(...)
    //
    // SIMPLE IDEA:
    // Ask answer, record answer, then print correct/wrong feedback.
    //
    // ANSWER EXAMPLE:
    // const result = await askValidOption(rl, q, CONFIG.secondsPerQuestion);
    // const feedback = tracker.recordAnswer(q, result.selectedIndex, result.timedOut);
    //
    // if (feedback.timedOut) {
    //   console.log(`Wrong. Correct answer: ${q.options[q.answer]}`);
    // } else if (feedback.correct) {
    //   console.log(`Correct! (+${feedback.points}, streak: ${feedback.streak})`);
    // } else {
    //   console.log(`Wrong. Correct answer: ${q.options[q.answer]}`);
    // }

    // TYPE YOUR CODE HERE:



  }

  const report = tracker.getReport(round.length);
  printReport(report, round.length);

  // TODO: Compare report.score to high score. Save only if current score is better.
  //
  // SIMPLE IDEA:
  // Load old score, compare, save if new score is bigger.
  //
  // ANSWER EXAMPLE:
  // const highScore = loadHighScore();
  //
  // if (report.score > highScore.score) {
  //   saveHighScore(report.score);
  //   console.log(`New high score: ${report.score}`);
  // } else {
  //   console.log(`High score: ${highScore.score}`);
  // }

  // TYPE YOUR CODE HERE:



  rl.close();
}

// TODO: Call runQuiz() and catch errors.
//
// SIMPLE IDEA:
// This starts the game.
//
// ANSWER EXAMPLE:
// runQuiz().catch(console.error);

// TYPE YOUR CODE HERE:



