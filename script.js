const toggleButton = document.getElementById('toggleTheme');
const saveButton = document.getElementById('saveSite');
const htmlCode = document.getElementById('htmlCode');
const cssCode = document.getElementById('cssCode');
const jsCode = document.getElementById('jsCode');
const iframe = document.getElementById('preview');
const currentTimeElement = document.getElementById('currentTime');
const siteNameElement = document.getElementById('siteName');


// Функция для обновления времени
function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Функция для обновления предпросмотра
function updatePreview() {
  const htmlContent = htmlCode.textContent || htmlCode.innerText;
  const cssContent = `<style>${cssCode.textContent || cssCode.innerText}</style>`;
  const jsContent = `<script>${jsCode.textContent || jsCode.innerText}</script>`;

  iframe.srcdoc = htmlContent + cssContent + jsContent;
}



// Функция для обновления предпросмотра с задержкой
let timeoutId = null;
function debounceUpdatePreview() {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    updatePreview();
    setTimeout(updateSyntaxHighlighting, 10);  // Добавлена задержка перед подсветкой
  }, 0);  // Задержка в 0 мс
}

// Обработчики для изменений в коде
htmlCode.addEventListener('input', debounceUpdatePreview);
cssCode.addEventListener('input', debounceUpdatePreview);
jsCode.addEventListener('input', debounceUpdatePreview);

// Переключение темы
let darkTheme = true;
toggleButton.addEventListener('click', () => {
  darkTheme = !darkTheme;
  document.body.classList.toggle('light-theme', !darkTheme);
});

// Сохранение файлов
saveButton.addEventListener('click', () => {
  const htmlContent = htmlCode.textContent || htmlCode.innerText;
  const cssContent = cssCode.textContent || cssCode.innerText;
  const jsContent = jsCode.textContent || jsCode.innerText;

  const zip = new JSZip();

  zip.folder("resours").file("index.html", htmlContent);
  zip.folder("resours").file("style.css", cssContent);
  zip.folder("resours").file("script.js", jsContent);

  zip.generateAsync({ type: "blob" }).then(function(content) {
    const a = document.createElement('a');
    const url = URL.createObjectURL(content);
    a.href = url;
    a.download = "rename_your_project.zip";
    a.click();
    URL.revokeObjectURL(url);
  });
});

// Обработчик для изменения ширины форм
const resizeHandle = document.getElementById('resizeHandle');
let isResizing = false;

resizeHandle.addEventListener('mousedown', (e) => {
  isResizing = true;
  document.body.style.cursor = 'ew-resize';
});

document.addEventListener('mousemove', (e) => {
  if (isResizing) {
    const newWidth = e.clientX;
    const minWidth = 200; // Минимальная ширина для левой панели
    const maxWidth = window.innerWidth - 300; // Максимальная ширина
    const leftPanel = document.getElementById('formContainer');

    if (newWidth > minWidth && newWidth < maxWidth) {
      leftPanel.style.width = `${newWidth}px`;
    }
  }
});

document.addEventListener('mouseup', () => {
  isResizing = false;
  document.body.style.cursor = 'default';
});

// Обновление времени каждую секунду
setInterval(updateTime, 1000);

// Начальная загрузка
updatePreview();
updateSyntaxHighlighting();


