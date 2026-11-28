# DISPATCH-X — Emergency Assignment Algorithm Explorer

An interactive educational web application comparing **Brute Force, Greedy, Bitmask Dynamic Programming, and Branch and Bound** on the same minimum-cost assignment problem.

## Project Team

| S. No.  | Student Name     | PRN       |
| 1       | J. Nageswara Rao | 250200037 |
| 2       | K. Mahesh        | 250200391 |

## Project Links

- **Live Application:** https://dispatch-x.netlify.app/
- **GitHub Repository:** https://github.com/njangili636-source/Dispatch-x

---

## Project Overview

DISPATCH-X is an interactive educational web application that demonstrates and compares four algorithms for solving the minimum-cost assignment problem.

The project uses an emergency ambulance assignment scenario where ambulances must be assigned to incidents while minimizing the total estimated travel time.

Users can enter a cost matrix, execute the algorithms, and compare their assignment results and performance.

## Real-World Problem and Computation

Given `n` ambulances and `n` incidents, with non-negative estimated travel time `C[i][j]`, assign each ambulance to exactly one incident and each incident to exactly one ambulance to minimize the total response time.

Minimize:

**Σᵢ Σⱼ C[i][j] x[i][j]**

Subject to:

- Each ambulance is assigned to exactly one incident.
- Each incident is assigned to exactly one ambulance.
- `x[i][j] ∈ {0,1}`.

This is a static one-to-one minimum-cost assignment model. It does not model live traffic or emergency severity and must not be used for real emergency decisions.

## Algorithms

| Algorithm | Technique | Time | Auxiliary Space | Optimal? |
|---|---|---|---|---|
| Brute Force | Enumerates possible assignments | O(n × n!) | O(n) | Yes |
| Greedy | Selects the cheapest available incident | O(n²) | O(n) | Not always |
| Bitmask DP | Stores minimum cost for incident subsets | O(n × 2ⁿ) | O(2ⁿ) | Yes |
| Branch and Bound | DFS with lower-bound pruning | O(n² × n!) conservative bound | O(n²) | Yes |

### Brief Working

- **Brute Force:** Checks all possible assignments and selects the minimum-cost one.
- **Greedy:** Assigns each ambulance to the cheapest available incident. It is fast but may not give the optimal result.
- **Bitmask DP:** Uses bitmasks to track assigned incidents and stores results of subproblems.
- **Branch and Bound:** Uses a lower bound to prune branches that cannot improve the current best assignment.

Brute Force, Bitmask DP, and Branch and Bound produce optimal solutions. Greedy does not guarantee an optimal solution.

For larger assignment problems, the Hungarian algorithm provides an exact O(n³) solution, but it is not included in this project.

## Important Project Feature

The application compares all four algorithms using the **same cost matrix**.

The costs returned by the three exact algorithms—Brute Force, Bitmask DP, and Branch and Bound—are cross-checked to verify that they produce the same optimal result.

Greedy is also compared, but it may return a higher cost because it makes local decisions.

The built-in Greedy Failure example demonstrates this difference:

```text
[[1, 2],
 [2, 100]]
```

Greedy cost: **101**

Optimal cost: **4**

This shows why a locally cheapest choice does not always produce the globally optimal solution.

## Input Validation

- Square matrix only.
- Core algorithm module supports sizes from 1 to 12; UI limits to 10.
- Each cell must contain a finite non-negative number.
- Blank or nonnumeric cells are rejected.
- Full four-way comparison is limited to 9 × 9 for browser responsiveness.
- Greedy processes ambulances in order A1 to An; ties are resolved by the lowest incident index.

## Built-in Demos

- **3×3 Demo:** `[[4,2,8],[2,5,7],[3,1,6]]` — optimum 10.
- **Greedy Failure:** `[[1,2],[2,100]]` — Greedy 101, optimum 4.
- **Equal Costs:** 3×3 matrix of fives — optimum 15.
- **5×5 Test:** Used for larger correctness and performance comparison.

Runtime values are measured in the browser as single-run measurements, not rigorous benchmarks. For a report, run multiple trials and calculate median runtimes.

## Features

- Interactive cost matrix input.
- Built-in sample matrices.
- Input validation.
- Four algorithm implementations.
- Assignment and total cost results.
- Algorithm comparison and execution traces.
- CSV export.
- Responsive dark/light theme.

## Technology Stack

- HTML5
- CSS3
- JavaScript ES Modules
- Node.js for testing
- GitHub for source code
- Netlify for deployment

No external dependencies or API keys are required.

## Project Structure

```text
DISPATCH-X/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── algorithms.js
│   └── app.js
│
├── assets/
│   └── ambulance-illustration.png
│
├── tests/
│   └── test.mjs
│
├── package.json
│
└── README.md
```

### File Description

| File | Description |
|---|---|
| `index.html` | Main dashboard and educational content |
| `css/style.css` | Responsive dark/light theme |
| `js/algorithms.js` | Four algorithm implementations |
| `js/app.js` | Validation, result views, execution traces and CSV export |
| `assets/ambulance-illustration.png` | Ambulance illustration |
| `tests/test.mjs` | Algorithm correctness tests |
| `package.json` | Project configuration and ES module support |
| `README.md` | Project documentation |

## Run Locally

JavaScript ES modules require a local web server.

Run from the project directory:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

No dependencies or API keys are required.

## Testing

Run the algorithm tests using:

```bash
node tests/test.mjs
```

Use Node.js 18+; `package.json` declares ES module support.

## Deployment

The project is deployed using Netlify.

- **Live Application:** https://dispatch-x.netlify.app/
- **GitHub Repository:** https://github.com/njangili636-source/Dispatch-x

## Design References

The visual direction is inspired by the four user-provided reference screenshots:

- Dark incident command center.
- Fleet logistics dashboard.
- Clean analytics layout.
- Medical operations dashboard.

The layout and code are original and do not embed the reference images.

## Submission Checklist

- [ ] Test all four algorithms with built-in samples.
- [ ] Verify the mathematical objective and constraints.
- [ ] Review complexity and the Greedy counterexample.
- [ ] Run the automated tests.
- [ ] Push source code to GitHub.
- [ ] Verify the live Netlify URL.
- [ ] Submit both the live application and repository URLs.

## Conclusion

DISPATCH-X demonstrates how different algorithm design techniques solve the same minimum-cost assignment problem.

By comparing Brute Force, Greedy, Bitmask Dynamic Programming, and Branch and Bound, the project helps students understand algorithm efficiency, optimality, and practical applications of DAA concepts.