# DISPATCH-X — Emergency Assignment Algorithm Explorer

An interactive educational web application comparing **Brute Force, Greedy, Bitmask Dynamic Programming, and Branch and Bound** on the **same minimum-cost assignment problem**.

## Run locally

Because JavaScript ES modules require a web server, run from the project directory:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. No dependencies or API keys required.

## Deploy (your own account)

1. Create a public GitHub repository and upload the contents of this directory (index.html at the repository root).
2. In GitHub, go to **Settings → Pages → Build and deployment → Deploy from a branch**, select `main` and `/ (root)`, then save.
3. Wait for GitHub Pages to publish and copy the URL shown under Pages.
4. Submit that live URL and your repository URL. **No account access is provided to the assistant; deployment must be done by the student.**

## Real-world problem and computation

Given n ambulances and n simultaneous incidents, with non-negative estimated travel time `C[i][j]`, assign each ambulance to exactly one incident and each incident to exactly one ambulance to **minimize the sum of response times**.

Minimize Σᵢ Σⱼ C[i][j] x[i][j], subject to Σⱼ x[i][j] = 1, Σᵢ x[i][j] = 1 and x[i][j] ∈ {0,1}.

This is a static **one-to-one minimum-cost assignment** model. It is not a live dispatch system, does not model emergency severity, and must not be used for real emergency decisions.

## Algorithms

| Algorithm | Technique | Time | Auxiliary space | Optimal? |
| --- | --- | --- | --- | --- |
| Brute Force | Enumerate permutations and score each | O(n · n!) | O(n) | Yes |
| Greedy | Assign next ambulance to cheapest unassigned incident | O(n²) | O(n) | Not always |
| Bitmask DP | Minimum cost per incident subset | O(n 2ⁿ) | O(2ⁿ) | Yes |
| Branch and Bound | DFS with optimistic row-minimum lower bound | O(n² · n!) conservative upper bound | O(n²) | Yes |

Brute Force's complexity counts O(n) cost calculation for each permutation, though this implementation incrementally accumulates cost during DFS and can be bounded more tightly by the number of search nodes. The table retains the familiar permutation-scoring formulation. Branch and Bound uses a Greedy incumbent and a lower bound that sums the cheapest available incident for each remaining ambulance; the estimate can reuse incidents, so it is admissible. Branch and Bound's stated upper bound includes repeated lower-bound computation. Its auxiliary space is O(n²) in this implementation because each recursive level retains remaining-incident and sorted-option lists.

For larger assignment problems, the Hungarian algorithm offers an O(n³) exact method, but is not one of the four pedagogical techniques required here.

## Input validation

- Square matrix only, 1–12 in the core algorithm module; UI limits to 10.
- Each cell must be a finite non-negative number.
- Blank or nonnumeric cells are rejected.
- Full four-way comparison is limited to 9 × 9 to protect browser responsiveness.
- Deterministic Greedy order: ambulances A1..An; ties resolved by lowest incident index.

## Built-in demos

- `3×3 Demo`: [[4,2,8],[2,5,7],[3,1,6]] — optimum **10**.
- `Greedy Failure`: [[1,2],[2,100]] — Greedy **101**, optimum **4**.
- `Equal Costs`: 3×3 matrix of fives — optimum **15**.
- `5×5 Test`: larger correctness and performance comparison.

The app cross-checks the costs from the three exact algorithms. Runtime values are measured in the browser, not fabricated. They are **single-run measurements**, not rigorous benchmarks. For a report, run several trials and calculate median runtimes.

## Files

- `index.html`: dashboard and educational content
- `css/style.css`: responsive dark/light theme
- `js/algorithms.js`: four independent algorithm implementations
- `js/app.js`: validation UI, result views, execution traces and CSV export
- `tests/test.mjs`: correctness tests runnable with Node.js

## Testing

```bash
node tests/test.mjs
```

No packages required. Use Node.js 18+; `package.json` declares ES module support.

## Design references

The visual direction is inspired by the four user-provided reference screenshots: dark incident command center, fleet logistics admin dashboard, clean analytics layout, and medical operations dashboard. The layout and code are original and do not embed the reference images.

## Submission checklist

- [ ] Test all four algorithms with built-in samples
- [ ] Verify the mathematical objective and constraints
- [ ] Review pseudocode, complexity and the Greedy counterexample
- [ ] Push source to your GitHub account
- [ ] Enable GitHub Pages and verify the live URL
- [ ] Submit both URLs
