const question = document.getElementById("question");
const keys = Array.from(document.getElementsByClassName("key-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple")

    .then( res => {
       
        return res.json();
    })
    .then(loadedQuestions => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };


            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );


            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;

        });
           
            startGame();
    })
    .catch((err) => {
        console.error(err);
    });


// Constants

const correctBonus = 10;
const maxQuestions = 5;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    game.classList.remove("hide");
    loader.classList.add("hide");
  
    getNewQuestion();
};

getNewQuestion = () => {

    if (availableQuestions.length == 0 || questionCounter >= maxQuestions) {
        

    localStorage.setItem('mostRecentScore', score);
    // go to the end page
    return window.location.assign("./end.html");
    
    };

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${maxQuestions}`;

    // update progress bar
    
    progressBarFull.style.width = `${(questionCounter / maxQuestions) * 100}%`;;


    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;
    keys.forEach( key => {
        const number = key.dataset['number'];
    key.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
};

keys.forEach( key => {
    key.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;
        acceptingAnswers = false;
        const selectedKey = e.target;
        const selectedAnswer = selectedKey.dataset["number"];
        
        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
        if (classToApply === "correct") {
            incrementScore(correctBonus);
        };

        selectedKey.parentElement.classList.add(classToApply);

        setTimeout( () => {
            selectedKey.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});


incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};


