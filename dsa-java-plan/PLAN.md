# DSA IN JAVA — COMPLETE PLAN (Start After Day 18)
## Java From Zero + DSA From Zero → Interview Ready

> **Your situation:** First time Java. First time DSA. But you now know programming
> deeply (JS/TS/Python), so Java syntax will take days, not weeks.
> **Daily time:** 4 hr DSA + 2 hr development (keep building!) + 1 hr open source/revision
> **Duration:** ~10 weeks to interview-ready. Don't rush DSA — it rewards consistency over intensity.

---

## PHASE 0: JAVA LANGUAGE (Days 1-5) — Learn Java by Mapping From What You Know

You already know: variables, loops, functions, OOP, async. Java is just new syntax + types (like TS!).

| Day | Topics | Practice |
|-----|--------|----------|
| 1 | Setup (JDK, IntelliJ), main method, variables, primitive types vs objects, String, printing, input | 20 small exercises (FizzBuzz, reverse string, etc.) |
| 2 | Conditions, loops, arrays (fixed size!), 2D arrays, methods, overloading | Array exercises: max, reverse, rotate |
| 3 | OOP: classes, constructors, inheritance, interfaces, abstract, access modifiers, static | Build Task manager (again! — in Java now, you know the domain) |
| 4 | Collections framework: ArrayList, HashMap, HashSet, LinkedList, Queue/Deque, iteration | Rewrite Day 2 exercises with collections |
| 5 | Generics, wrapper classes/autoboxing, equals/hashCode, Comparable/Comparator, exceptions, StringBuilder | Sort custom objects 3 ways; string builder problems |

**Rule:** When you know how to do something in JS/Python, ask "how in Java?" — fastest mapping.

---

## PHASE 1: DSA FOUNDATIONS (Weeks 1-2)

### Week 1: Complexity + Arrays + Strings
| Day | Topic | Problems (easy→medium) |
|-----|-------|------------------------|
| 1 | Big-O notation: time/space, analyze every loop you write | Analyze 10 code snippets |
| 2 | Arrays: traversal, in-place ops | 5 problems: two sum, move zeros, best time to buy stock |
| 3 | Two pointers | 5: reverse array, palindrome, container with water, 3sum |
| 4 | Sliding window | 5: max sum subarray size k, longest substring without repeat |
| 5 | Prefix sums | 4: range sum, subarray sum equals k |
| 6 | Strings in Java (immutability!, StringBuilder) | 5: anagrams, string compression |
| 7 | REVISION: redo the 5 hardest from the week WITHOUT looking | — |

### Week 2: Hashing + Recursion + Sorting/Searching
| Day | Topic | Problems |
|-----|-------|----------|
| 1 | HashMap/HashSet patterns | 5: group anagrams, longest consecutive sequence |
| 2 | Recursion basics: base case thinking, call stack | 5: factorial→fibonacci→subsets |
| 3 | Backtracking intro | 4: permutations, combinations, subsets |
| 4 | Sorting: bubble/selection/insertion (understand), merge/quick (implement!) | Implement merge + quick sort from scratch |
| 5 | Binary search + variants | 5: classic, rotated array, first/last occurrence |
| 6 | Binary search on answer space | 3: koko eating bananas, ship packages |
| 7 | REVISION week 2 + mock: 3 random problems, 45 min timer | — |

---

## PHASE 2: CORE DATA STRUCTURES (Weeks 3-5)

### Week 3: Linked Lists + Stacks + Queues
- Days 1-2: Linked list: build from scratch, reverse, detect cycle (Floyd), merge two sorted, middle node — 8 problems
- Days 3-4: Stack: valid parentheses, min stack, monotonic stack (next greater element), daily temperatures — 6 problems
- Day 5: Queue/Deque: sliding window maximum, implement queue with stacks — 4 problems
- Day 6: LRU Cache (combines HashMap + doubly linked list — classic interview!)
- Day 7: REVISION + mock

### Week 4: Trees
- Day 1: Binary tree: build, all 4 traversals (recursive) — understand deeply
- Day 2: Iterative traversals + level order (BFS with queue) — 5 problems
- Day 3: Tree problems: height, diameter, invert, same tree, symmetric — 6 problems
- Day 4: BST: insert, search, validate, kth smallest, LCA — 6 problems
- Day 5: Harder: path sums, serialize/deserialize — 4 problems
- Day 6: Heaps/PriorityQueue: kth largest, top k frequent, merge k lists — 5 problems
- Day 7: REVISION + mock

### Week 5: Graphs
- Day 1: Representations (adjacency list), DFS + BFS — implement both from scratch
- Day 2: Grid graphs: number of islands, flood fill, rotten oranges — 5 problems
- Day 3: Topological sort: course schedule I & II — 3 problems
- Day 4: Union-Find: implement + connected components — 4 problems
- Day 5: Shortest paths: Dijkstra (concept + 2 problems)
- Day 6: Graph mixed practice — 5 problems
- Day 7: REVISION + mock

---

## PHASE 3: ADVANCED (Weeks 6-8)

### Week 6: Dynamic Programming I (go SLOW here — everyone struggles at first)
- Day 1: What DP is: recursion → memoization → tabulation (climb stairs 3 ways!)
- Day 2: 1D DP: house robber, min cost climbing — 4 problems
- Day 3: 1D DP: coin change, longest increasing subsequence — 4 problems
- Day 4: 2D DP intro: unique paths, min path sum — 4 problems
- Day 5: Strings DP: longest common subsequence, edit distance — 3 problems
- Day 6: Knapsack pattern: subset sum, partition equal subset — 3 problems
- Day 7: REVISION (redo ALL week's problems from scratch — DP needs repetition)

### Week 7: DP II + Greedy + Intervals
- Days 1-2: More DP practice (word break, decode ways, stocks series) — 8 problems
- Day 3: Greedy: jump game, gas station, assign cookies — 5 problems
- Day 4: Intervals: merge, insert, non-overlapping, meeting rooms — 5 problems
- Day 5: Bit manipulation basics: single number, counting bits — 4 problems
- Days 6-7: Mixed hard-medium practice + mock

### Week 8: Tries + Sliding Window Hard + Misc
- Day 1: Trie: implement, word search II — 3 problems
- Day 2: Hard sliding window: minimum window substring — 3 problems
- Day 3: Matrix: rotate, spiral, set zeros — 4 problems
- Day 4: Math/misc: pow(x,n), sqrt, random problems
- Days 5-7: Company-wise problem lists + mocks

---

## PHASE 4: INTERVIEW MODE (Weeks 9-10)
- Daily: 2 timed problems (45 min each) — simulate real pressure
- Alternate days: 1 mock interview (use Pramp/peers/me — talk OUT LOUD while solving)
- Revisit your "wrong answers" notebook — redo every problem you ever failed
- System design basics (you have real projects to talk about — huge advantage!)
- Behavioral prep: STAR stories from your 18-day journey + capstone

---

## THE RULES OF DSA (Different From Development!)

1. **Struggle 30-45 min before looking at ANY hint.** Struggle IS the learning.
2. **After solving: explain the approach out loud.** Then code it again clean.
3. **Failed problems notebook:** every problem you couldn't solve goes in.
   Redo after 3 days. Redo again after 1 week. (Spaced repetition!)
4. **Pattern over problem:** after each solve, write ONE line: "this was the ___ pattern."
5. **Don't grind count. 150 problems DEEPLY > 500 problems copied.**
6. **Talk while coding** — from day 1. Interviews test communication, not just solving.

## Problem Sources
- NeetCode 150 (follow this list — it's pattern-organized)
- LeetCode (filter: easy → medium; hard only in weeks 8+)
- Striver's A2Z sheet (alternative, more exhaustive)

## Daily Structure (7 hr)
| Block | Time | What |
|-------|------|------|
| DSA new topic | 2 hr | Learn pattern + solve guided problems |
| DSA practice | 2 hr | Solo problems, timed |
| Development | 2 hr | Keep improving capstone / build monthly project / open source |
| Revision + notes | 1 hr | Failed-problems notebook + pattern notes |

**When you start Phase 0, ask me:** *"Generate the Java day 1 lesson files"* —
same fill-in-the-blank style as the full-stack plan.
