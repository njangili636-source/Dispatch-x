import assert from 'node:assert/strict';
import { algorithms, validateMatrix } from '../js/algorithms.js';
const tests = [{ m: [
        [4, 2, 8],
        [2, 5, 7],
        [3, 1, 6]
    ], optimal: 10 }, { m: [
        [1, 2],
        [2, 100]
    ], optimal: 4, greedy: 101 }, { m: [
        [5, 5, 5],
        [5, 5, 5],
        [5, 5, 5]
    ], optimal: 15 }, { m: [
        [7]
    ], optimal: 7 }, { m: [
        [0, 0],
        [0, 0]
    ], optimal: 0 }];
for (const { m, optimal, greedy }
    of tests) { const results = algorithms.map(fn => fn(m)); for (const i of[0, 2, 3]) assert.equal(results[i].cost, optimal, `Exact algorithm ${i} failed`); if (greedy !== undefined) assert.equal(results[1].cost, greedy); for (const r of results) { assert.equal(r.assignment.length, m.length);
        assert.equal(new Set(r.assignment).size, m.length);
        assert.equal(r.assignment.reduce((s, j, i) => s + m[i][j], 0), r.cost); } }
let seed = 417;

function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32; }
for (let n = 2; n <= 7; n++)
    for (let t = 0; t < 12; t++) { const m = Array.from({ length: n }, () => Array.from({ length: n }, () => Math.floor(rnd() * 30))); const results = algorithms.map(fn => fn(m));
        assert.equal(results[0].cost, results[2].cost);
        assert.equal(results[0].cost, results[3].cost);
        assert.ok(results[1].cost >= results[0].cost); }
for (const bad of[[], [
        [1, 2]
    ], [
        [1, -2],
        [3, 4]
    ], [
        [1, NaN],
        [3, 4]
    ]]) assert.throws(() => validateMatrix(bad));
console.log('PASS: built-in cases, 72 seeded randomized cases, and invalid-input checks');