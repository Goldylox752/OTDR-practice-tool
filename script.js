// ==========================================
// OTDR PRACTICE TOOL - VERSION 5
// REAL-TIME CANVAS TRACE
// ==========================================

const canvas = document.getElementById("otdrCanvas");
const ctx = canvas.getContext("2d");

const answerButtons = document.querySelectorAll(".answer-btn");
const nextButton = document.getElementById("next-btn");

const result = document.getElementById("result");
const scoreDisplay = document.getElementById("score");
const questionsDisplay = document.getElementById("questions");
const accuracyDisplay = document.getElementById("accuracy");

const question = document.getElementById("question");

// ==========================================
// SETTINGS
// ==========================================

const MAX_DISTANCE = 5;
const MIN_DB = -25;
const MAX_DB = 0;

// ==========================================
// EVENT TYPES
// ==========================================

const eventTypes = [
    {
        type: "connector",
        name: "Connector",
        minLoss: 0.2,
        maxLoss: 0.75,
        reflection: true
    },

    {
        type: "splice",
        name: "Fusion Splice",
        minLoss: 0.05,
        maxLoss: 0.30,
        reflection: false
    },

    {
        type: "bend",
        name: "Macrobend",
        minLoss: 0.30,
        maxLoss: 2.00,
        reflection: false
    }
];

// ==========================================
// GAME VARIABLES
// ==========================================

let fibreEvents = [];
let problemEvent = null;

let score = 0;
let questions = 0;

// ==========================================
// RANDOM NUMBER
// ==========================================

function randomNumber(min, max) {

    return Math.random() * (max - min) + min;

}

// ==========================================
// CREATE EVENTS
// ==========================================

function generateEvents() {

    fibreEvents = [];

    for (let i = 0; i < 3; i++) {

        const type =
            eventTypes[
                Math.floor(
                    Math.random() * eventTypes.length
                )
            ];

        const distance =
            randomNumber(0.5, 4.5);

        const loss =
            randomNumber(
                type.minLoss,
                type.maxLoss
            );

        fibreEvents.push({

            type: type.type,

            name: type.name,

            distance:
                Number(distance.toFixed(2)),

            loss:
                Number(loss.toFixed(2)),

            reflection:
                type.reflection

        });
    }

    // Sort events by distance

    fibreEvents.sort(
        (a, b) =>
            a.distance - b.distance
    );

    // Find highest-loss event

    problemEvent =
        fibreEvents.reduce(
            (highest, event) => {

                return event.loss >
                    highest.loss
                    ? event
                    : highest;

            },
            fibreEvents[0]
        );
}

// ==========================================
// RESIZE CANVAS
// ==========================================

function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    const pixelRatio =
        window.devicePixelRatio || 1;

    canvas.width =
        rect.width * pixelRatio;

    canvas.height =
        rect.height * pixelRatio;

    ctx.scale(
        pixelRatio,
        pixelRatio
    );

    drawTrace();

}

// ==========================================
// CONVERT DISTANCE TO X
// ==========================================

function distanceToX(distance) {

    const width =
        canvas.clientWidth;

    return (
        distance / MAX_DISTANCE
    ) * width;

}

// ==========================================
// CONVERT dB TO Y
// ==========================================

function dbToY(db) {

    const height =
        canvas.clientHeight;

    const range =
        MAX_DB - MIN_DB;

    return (
        (MAX_DB - db) /
        range
    ) * height;

}

// ==========================================
// DRAW GRID
// ==========================================

function drawGrid() {

    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;

    ctx.strokeStyle = "#1c3048";
    ctx.lineWidth = 1;

    ctx.font = "12px Arial";
    ctx.fillStyle = "#8fa3bf";

    // Horizontal dB lines

    for (
        let db = 0;
        db >= MIN_DB;
        db -= 5
    ) {

        const y =
            dbToY(db);

        ctx.beginPath();

        ctx.moveTo(45, y);

        ctx.lineTo(
            width,
            y
        );

        ctx.stroke();

        ctx.fillText(
            `${db} dB`,
            5,
            y + 4
        );
    }

    // Vertical distance lines

    for (
        let km = 0;
        km <= MAX_DISTANCE;
        km++
    ) {

        const x =
            distanceToX(km);

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(
            x,
            height
        );

        ctx.stroke();

        ctx.fillText(
            `${km} km`,
            x + 3,
            height - 8
        );
    }
}

// ==========================================
// DRAW OTDR TRACE
// ==========================================

function drawTrace() {

    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    drawGrid();

    // Starting power

    let currentDb = -2;

    ctx.beginPath();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#39ff88";

    ctx.moveTo(
        distanceToX(0),
        dbToY(currentDb)
    );

    // Draw fibre between events

    fibreEvents.forEach(event => {

        const x =
            distanceToX(
                event.distance
            );

        // Fibre travel

        ctx.lineTo(
            x,
            dbToY(currentDb)
        );

        // Event loss

        currentDb -= event.loss;

        ctx.lineTo(
            x,
            dbToY(currentDb)
        );

    });

    // Continue to end

    ctx.lineTo(
        distanceToX(MAX_DISTANCE),
        dbToY(currentDb)
    );

    ctx.stroke();

    // Draw event markers

    fibreEvents.forEach(event => {

        const x =
            distanceToX(
                event.distance
            );

        const y =
            dbToY(
                event.loss
            );

        drawEventMarker(
            event,
            x,
            y
        );
    });
}

// ==========================================
// DRAW EVENT MARKER
// ==========================================

function drawEventMarker(
    event,
    x,
    y
) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        5,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";

    ctx.fill();

    ctx.strokeStyle = "#39ff88";

    ctx.stroke();

}

// ==========================================
// CHECK ANSWER
// ==========================================

function checkAnswer(answer) {

    questions++;

    answerButtons.forEach(button => {
        button.disabled = true;
    });

    if (
        answer ===
        problemEvent.type
    ) {

        score++;

        result.textContent =
            `✅ Correct! ${problemEvent.name} ` +
            `at ${problemEvent.distance} km ` +
            `with ${problemEvent.loss} dB loss.`;

    } else {

        result.textContent =
            `❌ Incorrect. The highest-loss ` +
            `event was a ${problemEvent.name} ` +
            `at ${problemEvent.distance} km ` +
            `with ${problemEvent.loss} dB loss.`;

    }

    updateStats();

}

// ==========================================
// UPDATE SCORE
// ==========================================

function updateStats() {

    scoreDisplay.textContent =
        score;

    questionsDisplay.textContent =
        questions;

    const accuracy =
        questions === 0
            ? 0
            : Math.round(
                (score / questions) * 100
            );

    accuracyDisplay.textContent =
        `${accuracy}%`;
}

// ==========================================
// ANSWER BUTTONS
// ==========================================

answerButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            checkAnswer(
                button.dataset.answer
            );

        }
    );

});

// ==========================================
// NEXT TRACE
// ==========================================

nextButton.addEventListener(
    "click",
    () => {

        generateEvents();

        drawTrace();

        question.textContent =
            "Which event has the highest loss?";

        result.textContent = "";

        answerButtons.forEach(button => {
            button.disabled = false;
        });

    }
);

// ==========================================
// START
// ==========================================

generateEvents();

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);