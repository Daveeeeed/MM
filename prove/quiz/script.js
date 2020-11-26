const quizData = [
    {
        question: "Quando avvenne la Rivoluzione francese?",
        a: "Tra il 1788 e il 1782",
        b: "Tra il 1778 e il 1799",
        c: "Tra il 1789 e il 1799",
        d: "nessuna delle precedenti",
        correct: "c",
    },
    {
        question: "Da chi era costituita principalmente l'Assemblea Costituente??",
        a: "da borghesi e nobili",
        b: "esclusivamente da borghesi",
        c: "esclusivamente da nobili",
        d: "nessuna delle precedenti",
        correct: "a",
    },
    {
        question: "A chi dichiarò guerra la Franca il 1° Febbraio 1793?",
        a: "Inghilterra e Paesi Bassi",
        b: "Paesi Bassi",
        c: "Inghilterra",
        d: "nessuna delle precedenti",
        correct: "c",
    },
    {
        question: "Qual era lo scopo della politica di Robespierre?",
        a: "alleviare la miseria delle classi più povere",
        b: "far arricchire le classi più agiate",
        c: "diventare il nuovo Re di Francia",
        d: "nessuna delle precedenti",
        correct: "a",
    },
];

const quiz = document.getElementById("quiz");
const answerEls = document.querySelectorAll(".answer");
const questionEl = document.getElementById("question");
const a_text = document.getElementById("a_text");	//prendo le domande dal file html
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const submitBtn = document.getElementById("submit");

let currentQuiz = 0;
let score = 0;

loadQuiz(); //funzione che chiamiamo ogni volta per caricare il quiz

function loadQuiz() {
    deselectAnswers();

    const currentQuizData = quizData[currentQuiz];

    questionEl.innerText = currentQuizData.question;
    a_text.innerText = currentQuizData.a;
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;
}

function getSelected() {	//FUNZIONE per controllare se una domanda è selezionata
    let answer = undefined;

    answerEls.forEach((answerEl) => {
        if (answerEl.checked) {
            answer = answerEl.id;
        }
    });

    return answer;
}

function deselectAnswers() {	//funzione per deselezionare la risposta quando si passa alla domanda successiva
    answerEls.forEach((answerEl) => {
        answerEl.checked = false;
    });
}

submitBtn.addEventListener("click", () => {
    // check to see the answer
    const answer = getSelected();

    if (answer) {
        if (answer === quizData[currentQuiz].correct) {
            score++;
        }

        currentQuiz++;
        if (currentQuiz < quizData.length) { 	//controllo della lunghezza 
            loadQuiz();
        } else {
        	//TODO: VAI AL PROSSIMO LIVELLO
            quiz.innerHTML = `
                <h2>Hai risposto correttamente a ${score} su ${quizData.length} domande.</h2>
                
                <button onclick="location.reload()">Ritenta</button>
            `; //bottone che ricarica la pagina
        }
    }
});