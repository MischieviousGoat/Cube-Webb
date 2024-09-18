// Object containing information about solve
class Solve {
    constructor(time, isPlus2, isDNF, scramble) {
        this.isPlus2 = isPlus2;
        this.isDNF = isDNF;
        this.scramble = scramble;

        if (isDNF) {
            this.time = "DNF";
        } else if (isPlus2) {
            this.time = Number(time) + 2;
        } else {
            this.time = time;
        }
        return this.time, this.isPlus2, this.isDNF, this.scramble;
    }
}

// accesses displays
const timerDisplay = document.getElementById('timerDisplay');
const scrambleDisplay = document.getElementById('scrambleDisplay');
const timeDisplay = document.getElementById('times');

/*
Timer Modes: 
1.) Inspection mode
2.) Timer mode
3.) Stops solve, saves slove, generates new scramble
*/
timerMode = 0;

// Inspection variables
let inspectionTimer = null;
let startInspection = 0;
let elapsedInspection = 0;

// Penalties
let isPlus2 = false;
let isDNF = false;

// Timer variables
let timer = null;
let startTime = 0;
let elapsedTime = 0;

// Scramble generation variables
let moves = ['R', 'U', 'F', 'L', 'B', 'D'];
let directions = ['', "'", '2'];
let scramble = "";
let prevMove;
let prev2Move;
let moveCount = 0;

// Solve Storage
let time = 0;
let times = [];

// Timer mode Variables
let isInspecting = false;
let isSolving = false;
// Used to prevent imediate startInspectionTimer() after stop()
let holdTimer = false;
// Amount of time the start timer is held
let timeHeld = 0;
// Time since timer has stopped
let timeSinceStop = 0;

// Changes timer mode
// function toggleTimer() {
//     timerMode++;
//     switch (timerMode) {
//         case 1:
//             startInspectionTimer();
//             break;
//         case 2:
//             stopInspectionTimer();
//             start();
//             break;
//         case 3:
//             stop();
//             addTime(time, isPlus2, isDNF, scramble);
//             generateScramble();
//             timerMode = 0;
//             break;
//     }
// }

// Starts timer
function start() {
    elapsedTime = 0;
    timerDisplay.textContent = "0.00";
    startTime = Date.now() - elapsedTime;
    timer = setInterval(update, 10);
}

// Stops timer
function stop() {
    clearInterval(timer);
    elapsedTime = Date.now() - startTime;
    time = timerDisplay.textContent;
    addTime(time, isPlus2, isDNF, scramble);
    generateScramble();
}

// Starts inspection timer
function startInspectionTimer() {
    elapsedInspection = 0;
    timerDisplay.textContent = '0';
    startInspection = Date.now() - elapsedInspection;
    inspectionTimer = setInterval(updateInspection, 1000);
}

// Stops inspection timer
function stopInspectionTimer() {
    clearInterval(inspectionTimer);
    elapsedInspection = Date.now() - startInspection;
}

// Updates timer
function update() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;

    // Display calculations
    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
    let seconds = Math.floor(elapsedTime / 1000 % 60);
    let milliseconds = Math.floor(elapsedTime % 1000 / 10);

    // Formatting
    milliseconds = String(milliseconds).padStart(2, "0");
    if (hours > 0) {
        timerDisplay.textContent = `${hours}:${minutes}:${seconds}.${milliseconds}`;
    } else if (minutes > 0) {
        timerDisplay.textContent = `${minutes}:${seconds}.${milliseconds}`;
    } else {
        timerDisplay.textContent = `${seconds}.${milliseconds}`;
    }
}

// Updates inspection timer
function updateInspection() {
    const currentTime = Date.now();
    elapsedInspection = currentTime - startInspection;

    // Checks for penalties
    let seconds = Math.floor(elapsedInspection / (1000));
    if (seconds < 15) {
        timerDisplay.textContent = seconds;
    } else if (seconds < 17 && seconds >= 15) {
        timerDisplay.textContent = '+2';
        isPlus2 = true;
        console.log("+2");
    } else {
        timerDisplay.textContent = 'DNF';
        isDNF = true;
        console.log("DNF");
    }
}

// Adds solve to timeDisplay
function addTime(time, isPlus2, isDNF, scramble) {
    let solve = new Solve(time, isPlus2, isDNF, scramble);
    console.log(solve.time);
    let button = document.createElement("button");
    times += solve;
    button.innerText = solve.time;
    timeDisplay.appendChild(button);
}

// Generates a new 20 move scramble
function generateScramble() {
    scramble = "";
    for (let i = 0; i < 20; i++) {
        let randMove = Math.floor(Math.random() * moves.length);
        let randDir = Math.floor(Math.random() * directions.length);
        if (prevMove != moves[randMove] && prev2Move != moves[randMove]) {
            scramble += moves[randMove] + directions[randDir] + " ";
            prev2Move = prevMove;
            prevMove = moves[randMove];
            moveCount++;
        } else {
            i--;
            continue;
        }
    }
    scrambleDisplay.textContent = scramble;
}

// Keybinds
// document.addEventListener('keydown', (event) => {
//     if(event.key == ' ') {
//         toggleTimer();
//     }
// })

// When key is down...
document.addEventListener('keydown', (event) => {
    if(event.key == ' ') {
        if (isInspecting && !isSolving) { // starts to track time the start timer is held
            holdTimer = true;
            console.log("on");
        } else if (!isInspecting && isSolving) { // stops timer
            stop();
            isSolving = false;
            timeSinceStop = 0;
        }
    }
})

document.addEventListener('keyup', (event) => {
    if(event.key == ' ') {
        if (!isInspecting && !isSolving && timeSinceStop > 0) { // starts inspection
            startInspectionTimer();
            isInspecting = true;
        } else if (isInspecting && !isSolving) { // starts solve if held start timer for long enough
            holdTimer = false;
            console.log("off");
            if (timeHeld > 0) {
                console.log("exceded");
                stopInspectionTimer();
                isInspecting = false;
                timerDisplay.style.color = 'white';
                start();
                isSolving = true;
            }
            timeHeld = 0;
        }
    }
})

setInterval(function() {
    if (holdTimer) { // updates the amount of time the start timer is held
        timeHeld++;
        console.log(timeHeld);
        if (timeHeld > 0) {
            timerDisplay.style.color = "rgb(95, 255, 55)"; // green
        }
    }

    if (!isSolving) {
        timeSinceStop++;
    }
}, 550) // delay is .55 sec