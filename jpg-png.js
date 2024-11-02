let originalFileName = "";

function showUploadSuccess() {
    const fileInput = document.getElementById("jpgFileInput");
    const fileName = fileInput.files[0].name;
    const fileLabel = document.querySelector(".file-label");
    fileLabel.textContent = `${fileName}`;
    originalFileName = fileName.replace(/\.[^/.]+$/, "");
}

function convertJpgToPng() {
    const fileInput = document.getElementById("jpgFileInput");
    const downloadLink = document.getElementById("downloadLink");
    const downloadPng = document.getElementById("downloadPng");

    if (fileInput.files.length === 0) {
        alert("Please select a JPG file first.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(function (blob) {
                const url = URL.createObjectURL(blob);
                downloadPng.href = url;
                downloadPng.download = `${originalFileName}.png`;
                downloadLink.style.display = "block";

                addToHistory(`${originalFileName}.jpg -> ${originalFileName}.png`);
            }, "image/png");
        };
    };

    reader.readAsDataURL(file);
}

function addToHistory(fileName) {
    let history = JSON.parse(localStorage.getItem('conversionHistory')) || [];

    const conversionEntry = {
        fileName: fileName,
        date: new Date().toLocaleString()
    };  

    history.push(conversionEntry);
    localStorage.setItem('conversionHistory', JSON.stringify(history));
}

function handleDrop(event) {
    event.preventDefault();
    const fileInput = document.getElementById("jpgFileInput");
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        showUploadSuccess();
    }
}

function handleDragOver(event) {
    event.preventDefault();
}

document.getElementById("drop-area").addEventListener("dragover", handleDragOver);
document.getElementById("drop-area").addEventListener("drop", handleDrop);

document.addEventListener("DOMContentLoaded", function() {
    const historyTable = document.querySelector(".history");
    const history = JSON.parse(localStorage.getItem("conversionHistory")) || [];

    history.forEach((item, index) => {
        const row = document.createElement("tr");
        const cellIndex = document.createElement("td");
        const cellFile = document.createElement("td");
        const cellDate = document.createElement("td");

        cellIndex.textContent = index + 1;
        cellFile.textContent = item.fileName;
        cellDate.textContent = item.date;

        row.appendChild(cellIndex);
        row.appendChild(cellFile);
        row.appendChild(cellDate);
        historyTable.appendChild(row);
    });
});
