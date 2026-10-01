// ==========================================
// OTDR PRACTICE TOOL - VERSION 2
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
// OTDR EVENT DATABASE
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
// RANDOM NUMBER FUNCTION
// ==========================================

function randomNumber(min, max) {

    return Math.random() * (max - min) + min;

}


// ==========================================
// GENERATE A NEW OTDR EVENT
// ==========================================

function generateEvent() {

    const randomIndex =
        Math.floor(Math.random() * events.length);

    currentEvent = events[randomIndex];

    // Distance between 0.5 km and 5 km
    const distance =
        randomNumber(0.5, 5.0);

    // Loss based on event type
    const loss =
        randomNumber(
            currentEvent.minLoss,
            currentEvent.maxLoss
        );

    currentEvent.distance =
        Number(distance.toFixed(2));

    currentEvent.loss =
        Number(loss.toFixed(2));

}


// ==========================================
// CREATE OTDR TRACE
// ==========================================

function generateTrace() {

    generateEvent();

    const eventPosition =
        (currentEvent.distance / 5) * 100;


    // Normal trace
    let tracePoints = `
        0% 50%,
        5% 49%,
        10% 51%,
        15% 50%,
        20% 49%,
        25% 51%,
        30% 50%,
        35% 49%,
        40% 51%,
        ${eventPosition}% 50%,
        ${eventPosition + 1}% 50%,
        100% 50%
    `;


    // Connector
    if (currentEvent.type === "connector") {

        tracePoints = `
            0% 50%,
            10% 50%,
            20% 49%,
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
            40% 50%,
            ${eventPosition}% 50%,
            ${eventPosition + 1}% 54%,
            ${eventPosition + 2}% 54%,
            100% 54%
        `;
    }


    // Macrobend
    if (currentEvent.type === "bend") {

        tracePoints = `
            0% 50%,
            20% 50%,
            40% 50%,
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
            15% 50%,
            30% 50%,
            ${eventPosition}% 50%,
            ${eventPosition + 1}% 15%,
            ${eventPosition + 2}% 15%,
            100% 15%
        `;
    }


    traceLine.style.clipPath =
        `polygon(${tracePoints})`;


    // Update question
    question.textContent =
        "What event occurred on this fibre?";


    // Clear previous result
    result.textContent = "";


    // Enable buttons
    answerButtons.forEach(button => {

        button.disabled = false;

    });

}


// ==========================================
// CHECK ANSWER
// ==========================================

function checkAnswer(selectedAnswer) {

    questions++;


    // Disable buttons
    answerButtons.forEach(button => {

        button.disabled = true;

    });


    if (selectedAnswer === currentEvent.type) {

        score++;

        result.textContent =
            `✅ Correct! ${currentEvent.name} detected around ` +
            `${currentEvent.distance} km with approximately ` +
            `${currentEvent.loss} dB loss.`;

    } else {

        result.textContent =
            `❌ Incorrect. The event was a ` +
            `${currentEvent.name} at approximately ` +
            `${currentEvent.distance} km. ` +
            `Estimated loss: ${currentEvent.loss} dB.`;

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
// NEXT TRACE BUTTON
// ==========================================

nextButton.addEventListener("click", () => {

    generateTrace();

});


// ==========================================
// START THE APP
// ==========================================

generateTrace();