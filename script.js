// ==========================================
// OTDR PRACTICE TOOL - VERSION 4
// MULTI-EVENT TROUBLESHOOTING
// ==========================================

const answerButtons = document.querySelectorAll(".answer-btn");
const nextButton = document.getElementById("next-btn");

const result = document.getElementById("result");
const scoreDisplay = document.getElementById("score");
const questionsDisplay = document.getElementById("questions");
const accuracyDisplay = document.getElementById("accuracy");

const traceLine = document.getElementById("trace-line");
const question = document.getElementById("question");

// ==========================================
// EVENT DATABASE
// ==========================================

const eventTypes = [
    {
        type: "connector",
        name: "Connector",
        minLoss: 0.20,
        maxLoss: 0.75
    },

    {
        type: "splice",
        name: "Fusion Splice",
        minLoss: 0.05,
        maxLoss: 0.30
    },

    {
        type: "bend",
        name: "Macrobend",
        minLoss: 0.30,
        maxLoss: 2.00
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
// CREATE MULTIPLE EVENTS
// ==========================================

function generateEvents() {

    fibreEvents = [];

    const numberOfEvents = 3;

    for (let i = 0; i < numberOfEvents; i++) {

        const event =
            eventTypes[
                Math.floor(
                    Math.random() * eventTypes.length
                )
            ];

        const distance =
            randomNumber(
                0.5,
                4.5
            );

        const loss =
            randomNumber(
                event.minLoss,
                event.maxLoss
            );

        fibreEvents.push({

            type: event.type,

            name: event.name,

            distance:
                Number(
                    distance.toFixed(2)
                ),

            loss:
                Number(
                    loss.toFixed(2)
                )

        });

    }

    // Sort events by distance

    fibreEvents.sort(
        (a, b) =>
            a.distance - b.distance
    );

    // Choose the event with highest loss

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
// DRAW TRACE
// ==========================================

function generateTrace() {

    generateEvents();

    let points = [];

    points.push("0% 50%");

    fibreEvents.forEach(event => {

        const position =
            (event.distance / 5) * 100;

        points.push(
            `${position}% 50%`
        );

        const drop =
            Math.min(
                50 + event.loss * 8,
                85
            );

        points.push(
            `${position + 1}% ${drop}%`
        );

    });

    points.push("100% 85%");

    traceLine.style.clipPath =
        `polygon(${points.join(",")})`;

    question.textContent =
        "Which event has the highest loss?";

    result.textContent = "";

    answerButtons.forEach(button => {

        button.disabled = false;

    });

}

// ==========================================
// CHECK ANSWER
// ==========================================

function checkAnswer(answer) {

    questions++;

    answerButtons.forEach(button => {

        button.disabled = true;

    });

    const selectedEvent =
        fibreEvents.find(
            event =>
                event.type === answer
        );

    if (
        selectedEvent &&
        selectedEvent.type === problemEvent.type
    ) {

        score++;

        result.textContent =
            `✅ Correct! The highest-loss event ` +
            `is the ${problemEvent.name} at ` +
            `${problemEvent.distance} km ` +
            `with ${problemEvent.loss} dB loss.`;

    } else {

        result.textContent =
            `❌ Not quite. The highest-loss event ` +
            `is the ${problemEvent.name} at ` +
            `${problemEvent.distance} km ` +
            `with ${problemEvent.loss} dB loss.`;

    }

    updateStats();

}

// ==========================================
// SCORE
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

            const answer =
                button.dataset.answer;

            checkAnswer(answer);

        }
    );

});

// ==========================================
// NEXT TRACE
// ==========================================

nextButton.addEventListener(
    "click",
    () => {

        generateTrace();

    }
);

// ==========================================
// START
// ==========================================

generateTrace();