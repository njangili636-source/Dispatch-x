import { algorithms, algorithmInfo, validateMatrix } from './algorithms.js';

const $ = id => document.getElementById(id);

const samples = {
    demo: [
        [4, 2, 8],
        [2, 5, 7],
        [3, 1, 6]
    ],
    counter: [
        [1, 2],
        [2, 100]
    ],
    ties: [
        [5, 5, 5],
        [5, 5, 5],
        [5, 5, 5]
    ],
    medium: [
        [9, 2, 7, 8, 6],
        [6, 4, 3, 7, 5],
        [5, 8, 1, 8, 4],
        [7, 6, 9, 4, 2],
        [8, 5, 2, 9, 3]
    ]
};

let matrix = samples.demo.map(r => [...r]);
let results = [];
let selected = 0;

const palette = ['#15cbb9', '#5d8fff', '#f4b44d', '#b890ff'];


// DISPLAY NOTIFICATIONS
function notify(msg, type = 'info') {
    const el = $('toast');

    el.textContent = msg;
    el.className = 'toast show ' + type;

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        el.className = 'toast';
    }, 4500);
}


// DISPLAY INPUT MATRIX
function renderInputs() {
    const n = matrix.length;

    $('size').value = n;

    const wrap = $('matrix');

    wrap.innerHTML = '';
    wrap.style.setProperty('--n', n);

    const table = document.createElement('table');
    table.className = 'matrix-table';

    const head = document.createElement('tr');

    head.innerHTML =
        '<th></th>' +
        Array.from({ length: n },
            (_, j) => `<th>E${j + 1}</th>`
        ).join('');

    table.append(head);

    matrix.forEach((r, i) => {
        const tr = document.createElement('tr');

        const th = document.createElement('th');

        th.textContent = `A${i + 1}`;

        tr.append(th);

        r.forEach((v, j) => {
            const td = document.createElement('td');

            const input = document.createElement('input');

            input.type = 'number';
            input.min = '0';
            input.step = 'any';
            input.value = v;

            input.setAttribute(
                'aria-label',
                `Travel time ambulance ${i + 1} to incident ${j + 1}`
            );

            input.dataset.i = i;
            input.dataset.j = j;

            td.append(input);
            tr.append(td);
        });

        table.append(tr);
    });

    wrap.append(table);

    $('countAmb').textContent = n;
    $('countInc').textContent = n;
}


// CHANGE MATRIX SIZE
function updateSize() {
    const n = Number($('size').value);

    if (!Number.isInteger(n) || n < 1 || n > 10) {
        notify('Choose a size from 1 to 10.', 'error');
        return;
    }

    // FIXED MATRIX SIZE GENERATION
    matrix = Array.from({ length: n },
        (_, i) =>
        Array.from({ length: n },
            (_, j) =>
            matrix[i]?.[j] ?? (Math.floor(Math.random() * 18) + 2)
        )
    );

    results = [];

    renderInputs();
    renderAlgorithm();

    $('resultRows').innerHTML = '';
    $('bars').innerHTML = '';

    $('bestCost').textContent = '—';
    $('bestAlgorithm').textContent = 'Awaiting analysis';
    $('optimalStatus').textContent = '—';
    $('fastest').textContent = '—';
    $('runStamp').textContent = 'Not yet run';

    notify('Matrix size updated. Click Run All Algorithms.');
}


// READ USER INPUT
function readInputs() {
    const n = Number($('size').value);

    const inputs = [
        ...$('matrix').querySelectorAll('input')
    ];

    if (inputs.length !== n * n) {
        throw Error(
            'Matrix dimensions do not match. Generate the matrix again.'
        );
    }

    const out = Array.from({ length: n },
        () => Array(n)
    );

    for (const input of inputs) {
        const { i, j } = input.dataset;

        if (input.value.trim() === '') {
            throw Error(
                `Missing response time at A${+i + 1} → E${+j + 1}.`
            );
        }

        out[+i][+j] = Number(input.value);
    }

    validateMatrix(out);

    matrix = out;

    return out;
}


// LOAD SAMPLE MATRIX
function loadSample(name) {
    if (!samples[name]) {
        notify('Sample not found.', 'error');
        return;
    }

    matrix = samples[name].map(r => [...r]);

    results = [];

    renderInputs();

    renderAlgorithm();

    $('resultRows').innerHTML = '';
    $('bars').innerHTML = '';

    $('bestCost').textContent = '—';
    $('bestAlgorithm').textContent = 'Awaiting analysis';
    $('optimalStatus').textContent = '—';
    $('fastest').textContent = '—';
    $('runStamp').textContent = 'Not yet run';

    notify('Sample loaded. Select Run All Algorithms.');
}


// GENERATE RANDOM MATRIX
function randomize() {
    const n = Number($('size').value);

    matrix = Array.from({ length: n },
        () =>
        Array.from({ length: n },
            () => Math.floor(Math.random() * 30) + 1
        )
    );

    results = [];

    renderInputs();

    renderAlgorithm();

    $('resultRows').innerHTML = '';
    $('bars').innerHTML = '';

    $('bestCost').textContent = '—';
    $('bestAlgorithm').textContent = 'Awaiting analysis';
    $('optimalStatus').textContent = '—';
    $('fastest').textContent = '—';
    $('runStamp').textContent = 'Not yet run';

    notify('Random matrix generated.');
}


// NAVIGATION
function nav(page) {
    document.querySelectorAll('[data-page]').forEach(x => {
        x.classList.toggle(
            'active',
            x.dataset.page === page
        );
    });

    document.querySelectorAll('.page').forEach(x => {
        x.hidden = x.id !== `page-${page}`;
    });

    $('pageTitle').textContent = ({
        overview: 'Command Overview',
        lab: 'Algorithm Explorer',
        comparison: 'Performance Lab',
        docs: 'DAA Documentation'
    })[page];
}


// DRAW PERFORMANCE BARS
function drawBars() {
    const host = $('bars');

    host.innerHTML = '';

    if (!results.length) return;

    const max = Math.max(
        ...results.map(r => r.cost),
        1
    );

    results.forEach((r, i) => {
        const d = document.createElement('div');

        d.className = 'bar-row';

        d.innerHTML = `
            <div class="bar-label">${r.name}</div>

            <div class="bar-track">
                <div
                    class="bar-fill"
                    style="
                        width:${Math.max(2, r.cost / max * 100)}%;
                        background:${palette[i]}
                    ">
                </div>
            </div>

            <strong>${fmt(r.cost)} min</strong>
        `;

        host.append(d);
    });
}


// FORMAT NUMBERS
function fmt(n) {
    return Number(n.toFixed(3)).toLocaleString();
}


// DISPLAY RESULTS
function renderResults() {
    if (!results.length) return;

    const optimum = results[2].cost;

    const fastest = Math.min(
        ...results.map(r => r.ms)
    );

    $('bestCost').textContent =
        fmt(optimum) + ' min';

    $('bestAlgorithm').textContent =
        'Exact algorithms agree';

    $('fastest').textContent =
        results.find(r => r.ms === fastest).name;

    $('optimalStatus').textContent =
        results[1].cost === optimum ?
        'Greedy matched optimum' :
        'Greedy is suboptimal';

    $('optimalStatus').className =
        results[1].cost === optimum ?
        'green' :
        'amber';

    $('resultRows').innerHTML = results.map((r, i) => `
        <tr>
            <td>
                <span
                    class="dot"
                    style="background:${palette[i]}">
                </span>
                ${r.name}
            </td>

            <td>${fmt(r.cost)} min</td>

            <td>${r.ms.toFixed(3)} ms</td>

            <td>${r.stats.nodes.toLocaleString()}</td>

            <td>${r.stats.pruned.toLocaleString()}</td>

            <td>
                <span class="pill ${r.cost === optimum ? 'ok' : 'warn'}">
                    ${r.cost === optimum ? 'Optimal cost' : 'Heuristic gap'}
                </span>
            </td>
        </tr>
    `).join('');

    drawBars();

    renderAlgorithm();

    $('runStamp').textContent =
        'Last run: ' + new Date().toLocaleTimeString();
}


// DISPLAY SELECTED ALGORITHM
function renderAlgorithm() {
    const info = algorithmInfo[selected];

    const r = results[selected];

    if (!info) return;

    document.querySelectorAll('[data-algo]').forEach(b => {
        b.classList.toggle(
            'active', +b.dataset.algo === selected
        );
    });

    $('algoTitle').textContent = info.title;
    $('algoType').textContent = info.type;
    $('algoDesc').textContent = info.description;
    $('algoTime').textContent = info.time;
    $('algoSpace').textContent = info.space;

    $('algoGuarantee').textContent =
        info.optimal ?
        'Guaranteed optimal' :
        'Not guaranteed optimal';

    $('pseudocode').textContent = info.pseudo;

    if (!r) {
        $('algoResult').textContent = '—';

        $('assignment').innerHTML =
            '<p class="muted">Run the algorithms to see an assignment.</p>';

        $('trace').innerHTML =
            '<p class="muted">Execution steps will appear here.</p>';

        return;
    }

    $('algoResult').textContent =
        fmt(r.cost) + ' min';

    $('assignment').innerHTML =
        r.assignment.map((j, i) => `
            <div class="assignment">
                <span class="amb">A${i + 1}</span>

                <span class="connector">⟶</span>

                <span class="inc">E${j + 1}</span>

                <strong>${fmt(matrix[i][j])} min</strong>
            </div>
        `).join('');

    $('trace').innerHTML =
        r.steps.length ?
        r.steps.slice(0, 75).map((s, i) => `
                <div class="trace-line">
                    <span>${i + 1}</span>
                    ${escapeHTML(s)}
                </div>
            `).join('') :
        '<p class="muted">No intermediate improvements recorded.</p>';
}


// PREVENT HTML INJECTION IN TRACE
function escapeHTML(s) {
    return s.replace(/[&<>"']/g, ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[ch]));
}


// RUN ALL FOUR ALGORITHMS
function runAll() {
    try {
        const m = readInputs();

        const n = m.length;

        if (n > 9) {
            throw Error(
                'Use at most 9 incidents to compare all four algorithms. DP alone supports up to 12.'
            );
        }

        $('runBtn').disabled = true;

        results = algorithms.map(fn => {
            const t = performance.now();

            const r = fn(m);

            r.ms = performance.now() - t;

            return r;
        });

        // CHECK EXACT ALGORITHM RESULTS
        const exact = results.filter(
            (_, i) => i !== 1
        );

        if (!exact.every(
                r => Math.abs(r.cost - exact[0].cost) < 1e-8
            )) {
            throw Error(
                'Correctness check failed: exact algorithms disagree.'
            );
        }

        renderResults();

        notify(
            `All four algorithms completed. Exact optimum: ${fmt(results[2].cost)} minutes.`,
            'success'
        );

    } catch (e) {
        notify(e.message, 'error');

    } finally {
        $('runBtn').disabled = false;
    }
}


// EXPORT RESULTS TO CSV
function exportCSV() {
    if (!results.length) {
        notify(
            'Run the algorithms before exporting.',
            'error'
        );

        return;
    }

    const rows = [
        [
            'Algorithm',
            'Total minutes',
            'Execution ms',
            'Nodes or transitions',
            'Pruned',
            'Assignment'
        ],

        ...results.map(r => [
            r.name,
            r.cost,
            r.ms.toFixed(6),
            r.stats.nodes,
            r.stats.pruned,
            r.assignment.map(
                (j, i) => `A${i + 1}-E${j + 1}`
            ).join(' ')
        ])
    ];

    const csv = rows.map(r =>
        r.map(x =>
            '"' + String(x).replace(/"/g, '""') + '"'
        ).join(',')
    ).join('\r\n');

    const a = document.createElement('a');

    a.href = URL.createObjectURL(
        new Blob([csv], { type: 'text/csv' })
    );

    a.download = 'dispatch-x-results.csv';

    a.click();

    setTimeout(
        () => URL.revokeObjectURL(a.href),
        1000
    );
}


// PAGE NAVIGATION BUTTONS
document.querySelectorAll('[data-page]').forEach(b => {
    b.addEventListener('click', () => {
        nav(b.dataset.page);
    });
});


// ALGORITHM TAB BUTTONS
document.querySelectorAll('[data-algo]').forEach(b => {
    b.addEventListener('click', () => {
        selected = Number(b.dataset.algo);

        renderAlgorithm();
    });
});


// SAMPLE MATRIX BUTTONS
document.querySelectorAll('[data-sample]').forEach(b => {
    b.addEventListener('click', () => {
        loadSample(b.dataset.sample);
    });
});


// MATRIX SIZE
$('size').addEventListener(
    'change',
    updateSize
);


// RANDOMIZE BUTTON
$('randomBtn').addEventListener(
    'click',
    randomize
);


// RUN ALL BUTTON
$('runBtn').addEventListener(
    'click',
    runAll
);


// EXPORT CSV BUTTON
$('exportBtn').addEventListener(
    'click',
    exportCSV
);


// LIGHT / DARK THEME
$('themeBtn').addEventListener('click', () => {
    document.body.classList.toggle('light');
});


// MOBILE MENU
$('menuBtn').addEventListener('click', () => {
    document.body.classList.toggle('menu-open');
});


// INITIAL PAGE LOAD
renderInputs();

renderAlgorithm();

runAll();