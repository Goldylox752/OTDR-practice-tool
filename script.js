// ==========================================
// OTDR PRACTICE TOOL - VERSION 3
// dB + dBm TRAINING
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
// FIBRE EVENT DATABASE
// ==========================================

const events = [
    {
        type: "connector",
        name: "Connector",
        minLoss: 0.20,
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
    },

    {
        type: "break",
        name: "Fibre Break",
        minLoss: 10.00,
        maxLoss: 30.00,
        reflection: true
    }
];

// ==========================================
// GAME VARIABLES
// ==========================================

let currentEvent = null;

let score = 0;
let questions = 0;

// ==========================================
// RANDOM NUMBER
// ==========================================

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// ==========================================
// GENERATE EVENT
// ==========================================

function generateEvent() {

    const randomIndex =
        Math.floor(Math.random() * events.length);

    currentEvent = {
        ...events[randomIndex]
    };

    // Event distance
    currentEvent.distance =
        Number(randomNumber(0.5, 5.0).toFixed(2));

    // Event loss
    currentEvent.loss =
        Number(
            randomNumber(
                currentEvent.minLoss,
                currentEvent.maxLoss
            ).toFixed(2)
        );

    // Simulated launch power
    currentEvent.launchPower =
        Number(
            randomNumber(-2, 0).toFixed(2)
        );

    // Power after event
    currentEvent.receivedPower =
        Number(
            (
                currentEvent.launchPower -
                currentEvent.loss
            ).toFixed(2)
        );
}

// ==========================================
// GENERATE TRACE
// ==========================================

function generateTrace() {

    generateEvent();

    const eventPosition =
        (currentEvent.distance / 5) * 100;

    let tracePoints = `
        0% 50%,
        10% 50%,
        20% 49%,
        30% 51%,
        40% 50%,
        ${eventPosition}% 50%,
        100% 50%
    `;

    // Connector
    if (currentEvent.type === "connector") {

        tracePoints = `
            0% 50%,
            20% 50%,
            ${eventPosition}% 50%,
            ${eventPosition + 1}% 58%,
            ${eventPosition + 2}% 58%,
            100% 58%
        `;
    }

    // Fusion splice
    if (currentEvent.type === "splice") {

        tracePoints = `
            0% 50%,
            20% 50%,
            ${eventPosition}% 50%,
            ${eventPosition + 1}% 54%,
            ${eventPosition + 2}% 54%,
            100% 54%
        `;
    }

    // Bend
    if (currentEvent.type === "bend") {

        tracePoints = `
            0% 50%,
            20% 50%,
            ${eventPosition}% 50%,
            ${eventPosition + 3}% 62%,
            ${eventPosition + 7}% 62%,
            100% 62%
        `;
    }

    // Fibre break
    if (currentEvent.type === "break") {

        tracePoints = `
            0% 50%,
            20% 50%,
            ${eventPosition}% 50%,
            ${eventPosition + 1}% 15%,
            ${eventPosition + 2}% 15%,
            100% 15%
        `;
    }

    traceLine.style.clipPath =
        `polygon(${tracePoints})`;

    question.textContent =
        "What event occurred on this fibre?";

    result.textContent = "";

    answerButtons.forEach(button => {
        button.disabled = false;
    });
}

// ==========================================
// CHECK ANSWER
// ==========================================

function checkAnswer(selectedAnswer) {

    questions++;

    answerButtons.forEach(button => {
        button.disabled = true;
    });

    if (selectedAnswer === currentEvent.type) {

        score++;

        result.textContent =
            `✅ Correct! ${currentEvent.name} detected at ` +
            `${currentEvent.distance} km. ` +
            `Event loss: ${currentEvent.loss} dB. ` +
            `Received power: ${currentEvent.receivedPower} dBm.`;

    } else {

        result.textContent =
            `❌ Incorrect. The event was a ` +
            `${currentEvent.name} at ` +
            `${currentEvent.distance} km. ` +
            `Loss: ${currentEvent.loss} dB. ` +
            `Received power: ${currentEvent.receivedPower} dBm.`;
    }

    updateStats();
}

// ==========================================
// UPDATE SCORE
// ==========================================

function updateStats() {

    scoreDisplay.textContent = score;

    questionsDisplay.textContent = questions;

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

    button.addEventListener("click", () => {

        const selectedAnswer =
            button.dataset.answer;

        checkAnswer(selectedAnswer);

    });

});

// ==========================================
// NEXT TRACE
// ==========================================

nextButton.addEventListener("click", () => {

    generateTrace();

});

// ==========================================
// START
// ==========================================

generateTrace();