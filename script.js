// OTDR Practice Tool

const answerButtons = document.querySelectorAll(".answer-btn");
const nextButton = document.getElementById("next-btn");

const result = document.getElementById("result");
const scoreDisplay = document.getElementById("score");
const questionsDisplay = document.getElementById("questions");
const accuracyDisplay = document.getElementById("accuracy");

const traceLine = document.getElementById("trace-line");
const question = document.getElementById("question");

// Possible OTDR events
const events = [
    {
        type: "connector",
        name: "Connector",
        description: "A connector event causes a noticeable loss and reflection.",
        position: 25
    },
    {
        type: "splice",
        name: "Splice",
        description: "A fusion splice normally creates a small loss with little reflection.",
        position: 45
    },
    {
        type: "bend",
        name: "Bend",
        description: "A fibre bend can cause increased optical loss.",
        position: 65
    },
    {
        type: "break",
        name: "Fibre Break",
        description: "A fibre break causes a major loss and the trace ends.",
        position: 85
    }
];

let currentEvent;
let score = 0;
let questions = 0;

// Generate a new OTDR trace
function generateTrace() {

    currentEvent = events[Math.floor(Math.random() * events.length)];

    // Reset result
    result.textContent = "";

    // Enable answer buttons
    answerButtons.forEach(button => {
        button.disabled = false;
    });

    // Create a random trace shape
    const position = currentEvent.position;

    let traceShape = `
        0% 50%,
        5% 49%,
        10% 51%,
        15% 50%,
        20% 49%,
        ${position - 8}% 50%,
        ${position}% 50%,
        ${position + 2}% 50%,
        100% 50%
    `;

    // Special trace behavior for a break
    if (currentEvent.type === "break") {
        traceShape = `
            0% 50%,
            10% 49%,
            20% 51%,
            30% 50%,
            40% 49%,
            50% 51%,
            60% 50%,
            70% 49%,
            80% 50%,
            ${position}% 50%,
            ${position + 1}% 15%,
            ${position + 2}% 15%,
            100% 15%
        `;
    }

    traceLine.style.clipPath = `polygon(${traceShape})`;

    question.textContent = "What event occurred on this fibre?";
}

// Check the user's answer
function checkAnswer(selectedAnswer) {

    questions++;

    // Disable buttons after answering
    answerButtons.forEach(button => {
        button.disabled = true;
    });

    if (selectedAnswer === currentEvent.type) {

        score++;

        result.textContent = `✅ Correct! ${currentEvent.description}`;

    } else {

        result.textContent =
            `❌ Not quite. The correct answer was ${currentEvent.name}. ${currentEvent.description}`;
    }

    updateStats();
}

// Update score and accuracy
function updateStats() {

    scoreDisplay.textContent = score;
    questionsDisplay.textContent = questions;

    const accuracy =
        questions === 0
            ? 0
            : Math.round((score / questions) * 100);

    accuracyDisplay.textContent = `${accuracy}%`;
}

// Answer button events
answerButtons.forEach(button => {

    button.addEventListener("click", () => {

        const selectedAnswer = button.dataset.answer;

        checkAnswer(selectedAnswer);

    });

});

// Next trace button
nextButton.addEventListener("click", () => {

    generateTrace();

});

// Start the first trace
generateTrace();