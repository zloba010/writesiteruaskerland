const bookList = document.getElementById("book-list");
const fileInput = document.getElementById("file-input");
const loadButton = document.getElementById("load-button");
const voiceSelect = document.getElementById("voice-select");
const speedRange = document.getElementById("speed-range");
const speedValue = document.getElementById("speed-value");
const speakButton = document.getElementById("speak-button");
const downloadAudioButton = document.getElementById("download-audio-button");
const readingArea = document.getElementById("reading-area");
const bookTitle = document.getElementById("book-title");
const bookContent = document.getElementById("book-content");

let speechSynth = window.speechSynthesis;
let utterance;
let currentBookContent = "";
let currentAudioURL = "";
let bookListArray = JSON.parse(localStorage.getItem("books")) || [];

// Функция для обновления списка книг
function updateBookList() {
    bookList.innerHTML = "";
    bookListArray.forEach((book, index) => {
        const bookItem = document.createElement("div");
        bookItem.textContent = book.title;
        bookItem.onclick = () => loadBook(index);
        bookList.appendChild(bookItem);
    });
}

// Функция для загрузки книги
loadButton.addEventListener("click", () => {
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const content = event.target.result;
        const title = file.name;
        bookListArray.push({ title, content });
        localStorage.setItem("books", JSON.stringify(bookListArray));
        updateBookList();
        fileInput.value = "";  // Сбросить значение input
    };

    if (file) {
        reader.readAsText(file);
    }
});

// Заполнение выбора голосов
function populateVoiceList() {
    const voices = speechSynth.getVoices();
    voiceSelect.innerHTML = "";
    voices.forEach((voice) => {
        const option = document.createElement("option");
        option.value = voice.name;
        option.textContent = voice.name + " (" + voice.lang + ")";
        voiceSelect.appendChild(option);
    });
}

populateVoiceList();
if (speechSynth.onvoiceschanged !== undefined) {
    speechSynth.onvoiceschanged = populateVoiceList;
}

// Функция для загрузки книги
function loadBook(index) {
    const selectedBook = bookListArray[index];
    bookTitle.textContent = selectedBook.title;
    bookContent.textContent = selectedBook.content;
    currentBookContent = selectedBook.content;

    readingArea.style.display = "block";
}

// Синтез и автоматическое перелистывание страниц
speakButton.addEventListener("click", () => {
    if (currentBookContent) {
        utterance = new SpeechSynthesisUtterance(currentBookContent);
        utterance.voice = speechSynth.getVoices().find(voice => voice.name === voiceSelect.value);
        utterance.rate = parseFloat(speedRange.value);

        utterance.onend = () => {
            alert('Чтение завершено');
        };

        speechSynth.speak(utterance);
        currentAudioURL = URL.createObjectURL(new Blob([new TextEncoder().encode(currentBookContent)], { type: 'audio/mpeg' }));
    }
});

// Скачивание аудиофайла
downloadAudioButton.addEventListener("click", () => {
    if (currentAudioURL) {
        const a = document.createElement('a');
        a.href = currentAudioURL;
        a.download = bookTitle.textContent + ".mp3";
        a.click();
    } else {
        alert("Сначала выполните чтение книги.");
    }
});

// Настройка скорости
speedRange.addEventListener("input", () => {
    speedValue.textContent = speedRange.value;
});

// Обновление списка книг при загрузке страницы
updateBookList();