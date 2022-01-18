const game = document.querySelector('.game');
const input = document.querySelector('.guess');
const nameInput = document.querySelector('.name');
const popup = document.querySelector('.register-score');
const registerScore = document.querySelector('form');
const message = document.querySelector('.message');
const guesses = document.querySelector('.guesses');
const statsGuesses = document.querySelector('.final-guesses');
const statsTime = document.querySelector('.final-time');
const ranking = document.querySelector('.ranking');
const restart = document.querySelector('.restart');
const time = document.querySelector('.time');
const reset = document.querySelector('.reset');
const scoreBoard = document.querySelector('tbody');
const minutes = document.querySelector('.min');
const seconds = document.querySelector('.sec');
const box1 = document.querySelector('.box-1');
const box2 = document.querySelector('.box-2');
const KEY = 'scoresInfo';
const DISPLAYTIME = 1000;
let numberInput;
let totalGuesses;
let isPlaying = true;
let min = 0;
let sec = 0;
let displaySec = 0;
let displayMin = 0;
let interval;
let finalTime;
let rank;

function timerOutput() {
    sec++;

    if (sec / 60 === 1) {
        sec = 0;
        min++;
    }

    if (sec < 10) {
        displaySec = '0' + sec.toString();
    } else {
        displaySec = sec;
    }

    if (min < 10) {
        displayMin = '0' + min.toString();
    } else {
        displayMin = min;
    }

    time.innerHTML = displayMin + ':' + displaySec;
}

function startTimer() {
    interval = setInterval(timerOutput, 1000);
}

function stopTimer() {
    clearInterval(interval);
}

function restartGame() {
    clearInterval(interval);
    time.style.display = 'none';
    min = 0;
    sec = 0;
    time.innerHTML = '00:00';
    popup.style.display = 'none';
    message.textContent = '';
    input.value = '';
    correctAnswer = Math.round(Math.random() * 100);
    guesses.textContent = 0;
    isPlaying = true;
}

function popupContent(array) {
    totalGuesses = guesses.textContent;
    statsGuesses.textContent = parseInt(totalGuesses) + 1;
    statsTime.textContent = `${min} minutes ${sec} seconds`;

    if (localStorage.getItem(KEY) !== null) {
        let array = JSON.parse(localStorage.getItem(KEY)).map(score => score.score);
        array = array.sort((a, b) => parseInt(a.score) > parseInt(b.score) ? 1 : -1);
        if (array.length == 0) {
            ranking.textContent = '1st'
        }

        if (parseInt(totalGuesses) < array[0]) {
            ranking.textContent = '1st';
        }

    } else {
        ranking.textContent = '1st';
    }
    popup.style.display = 'block';
}

function validateInput() {
    if (isPlaying) {
        if (parseInt(guesses.textContent) < 1) {
            startTimer();
            time.style.display = 'block';
        }
        if (numberInput == correctAnswer) {
            stopTimer();
            audio = new Audio('Success Sound Effect.mp3');
            audio.play();
            message.style.color = 'green';
            message.textContent = 'Correct';
            box1.style.animation = 'animation 3s forwards';
            box2.style.animation = 'animation 3s forwards';
            if (localStorage.getItem(KEY) !== null) {
                let array = JSON.parse(localStorage.getItem(KEY));
                if (array.length >= 3) {
                    for (let i = 0; i < 3; i++) {
                        if (parseInt(guesses.textContent) < parseInt(array[i].score)) {
                            popupContent();
                        }
                    }
                } else {
                    popupContent();
                }
            } else {
                popupContent();
            }
            isPlaying = false;
        } else if (numberInput > correctAnswer) {
            audio = new Audio('fail.mp3');
            audio.play();
            input.value = '';
            message.style.color = 'red';
            message.textContent = 'Number to high';
        } 
        else {
            audio = new Audio('fail.mp3');
            audio.play();
            input.value = '';
            message.style.color = 'red';
            message.textContent = 'Number to low';
        }
        if (numberInput == '') {
            message.textContent = '';
        }
        else {
            totalGuesses = guesses.textContent;
            totalGuesses = parseInt(totalGuesses, 10);
            totalGuesses += 1;
            guesses.textContent = totalGuesses;
        }
    }
}

input.addEventListener('keyup', e => {
    let audio;
    numberInput = input.value;

    if (isPlaying) {
        if (numberInput !== '') {
            message.textContent = '';
        }

        if (isNaN(numberInput)) {
            input.value = '';
            message.style.color = 'red';
            message.textContent = 'Please enter a number';
        }
    }

    if (e.key === 'Enter' && parseInt(numberInput) <= 10) {
        validateInput();
    } else if (parseInt(numberInput) > 10) {
        validateInput();
    }
});

registerScore.addEventListener('submit', e => {
    e.preventDefault();
    popup.style.display = 'none';
    totalGuesses = guesses.textContent;
    finalTime = time.textContent;
    let name = nameInput.value;
    if (nameInput !== '' && isPlaying === false) {
        let highScoreList;

        if (localStorage.getItem(KEY) === null) {
            highScoreList = [];
            localStorage.setItem(KEY, JSON.stringify(highScoreList));
        } else {
            highScoreList = JSON.parse(localStorage.getItem(KEY));
        }
        highScoreList.push({ name: name, score: totalGuesses, time: finalTime });
        localStorage.setItem(KEY, JSON.stringify(highScoreList));

        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <h2>${name}</h2>
            </td>
            <td>
                <h2>${totalGuesses}</h2>
            </td>
            <td>
                <h2>${finalTime}</h2>
            </td>
        `;

        nameInput.value = '';
        restartGame();
    }
    location.reload(true);
});

document.addEventListener('keyup', e => {
    if (e.key == 'Escape') {
        restartGame();
    }
})

restart.addEventListener('click', restartGame);

reset.addEventListener('click', () => {
    localStorage.removeItem(KEY);
    scoreBoard.innerHTML = '';
});

window.addEventListener('load', () => {
    if (localStorage.getItem(KEY) !== null) {
        let array = JSON.parse(localStorage.getItem(KEY));
        array = array.sort((a, b) => (parseInt(a.score) > parseInt(b.score) ? 1 : -1));
        for (let i = 0; i < array.length; i++) {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <h2>${array[i].name}</h2>
                </td>
                <td>
                    <h2>${array[i].score}</h2>
                </td>
                <td>
                    <h2>${array[i].time}</h2>
                </td>
            `;
            scoreBoard.appendChild(tr);

            if (i === 2) {
                break;
            }
        }
    }
});