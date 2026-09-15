const sampleTexts = [
    "تعتبر البرمجة من أهم المهارات في العصر الحديث حيث تتيح لك كتابة الأكواد وبناء التطبيقات المبتكرة التي تحل المشكلات اليومية وتسهل حياة البشر.",
    "إن النجاح لا يأتي بالصدفة بل هو نتيجة للعمل الجاد والاستمرارية في التعلم وتطوير الذات بشكل مستمر دون التوقف عند العقبات الأولى.",
    "تصميم واجهات المستخدم الحديثة يتطلب فهم عميق لاحتياجات المستخدمين مع مراعاة البساطة والسرعة وسهولة التصفح في كافة الأجهزة المختلفة.",
    "تساعدك ممارسة كتابة الأكواد يوميا على زيادة السرعة وتطوير التفكير المنطقي والقدرة على تصحيح الأخطاء البرمجية بسرعة فائقة وإتقان الأدوات."
];

const TIME_LIMIT = 60;

let timeLeft = TIME_LIMIT;
let timer = null;
let isStarted = false;
let currentText = "";
let correctChars = 0;
let totalErrors = 0;

const textDisplay = document.getElementById('textDisplay');
const textInput = document.getElementById('textInput');
const timerEl = document.getElementById('timer');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const restartBtn = document.getElementById('restartBtn');
const resultModal = document.getElementById('resultModal');
const modalRestartBtn = document.getElementById('modalRestartBtn');
const finalWpm = document.getElementById('finalWpm');
const finalAccuracy = document.getElementById('finalAccuracy');
const finalCorrect = document.getElementById('finalCorrect');
const finalErrors = document.getElementById('finalErrors');

function getRandomText() {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    return sampleTexts[randomIndex];
}

function initTest() {
    clearInterval(timer);
    timeLeft = TIME_LIMIT;
    isStarted = false;
    correctChars = 0;
    totalErrors = 0;

    timerEl.textContent = timeLeft;
    wpmEl.textContent = "0";
    accuracyEl.textContent = "100%";

    textInput.value = "";
    textInput.disabled = false;
    resultModal.classList.remove('active');

    currentText = getRandomText();
    textDisplay.innerHTML = "";

    currentText.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        if (index === 0) span.classList.add('current');
        textDisplay.appendChild(span);
    });

    textInput.focus();
}

function startTimer() {
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerEl.textContent = timeLeft;
            calculateStats();
        } else {
            endTest();
        }
    }, 1000);
}

function handleInput() {
    const typedText = textInput.value;
    const spans = textDisplay.querySelectorAll('span');

    if (!isStarted && typedText.length > 0) {
        isStarted = true;
        startTimer();
    }

    correctChars = 0;
    let errorsInInput = 0;

    spans.forEach((span, index) => {
        const char = typedText[index];

        span.classList.remove('current', 'correct', 'incorrect');

        if (char == null) {
            if (index === typedText.length) {
                span.classList.add('current');
            }
        } else if (char === span.textContent) {
            span.classList.add('correct');
            correctChars++;
        } else {
            span.classList.add('incorrect');
            errorsInInput++;
        }
    });

    totalErrors = errorsInInput;
    calculateStats();

    if (typedText.length >= currentText.length) {
        endTest();
    }
}

function calculateStats() {
    const timeElapsed = TIME_LIMIT - timeLeft;
    const timeInMinutes = timeElapsed > 0 ? timeElapsed / 60 : 1 / 60;

    const wpm = Math.round((correctChars / 5) / timeInMinutes);
    wpmEl.textContent = wpm >= 0 ? wpm : 0;

    const totalTyped = textInput.value.length;
    let accuracy = 100;
    if (totalTyped > 0) {
        accuracy = Math.round(((totalTyped - totalErrors) / totalTyped) * 100);
    }
    accuracyEl.textContent = `${accuracy < 0 ? 0 : accuracy}%`;
}

function endTest() {
    clearInterval(timer);
    textInput.disabled = true;

    const timeInMinutes = (TIME_LIMIT - timeLeft) / 60 || (TIME_LIMIT / 60);
    const finalWpmValue = Math.round((correctChars / 5) / timeInMinutes);
    const totalTyped = textInput.value.length;
    const finalAccValue = totalTyped > 0 ? Math.round(((totalTyped - totalErrors) / totalTyped) * 100) : 100;

    finalWpm.textContent = finalWpmValue >= 0 ? finalWpmValue : 0;
    finalAccuracy.textContent = `${finalAccValue < 0 ? 0 : finalAccValue}%`;
    finalCorrect.textContent = correctChars;
    finalErrors.textContent = totalErrors;

    resultModal.classList.add('active');
}

textInput.addEventListener('input', handleInput);
restartBtn.addEventListener('click', initTest);
modalRestartBtn.addEventListener('click', initTest);

window.addEventListener('load', initTest);