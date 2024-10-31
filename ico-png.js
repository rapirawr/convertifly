let originalFileName = "";

function showUploadSuccess() {
    const fileInput = document.getElementById("icoFileInput");
    const fileName = fileInput.files[0].name;
    const fileLabel = document.querySelector(".file-label");
    fileLabel.textContent = fileName;
    originalFileName = fileName.replace(/\.[^/.]+$/, "");
}

function convertIcoToPng() {
    const fileInput = document.getElementById("icoFileInput");
    const downloadLink = document.getElementById("downloadLink");
    const downloadPng = document.getElementById("downloadPng");

    if (fileInput.files.length === 0) {
        alert("Please select an ICO file first.");
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
                downloadPng.style.display = "block";

                addToHistory(`${originalFileName}.ico -> ${originalFileName}.png`);
            }, "image/png");
        };
    };

    reader.readAsDataURL(file);
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
}

function handleDrop(event) {
    event.preventDefault();
    const fileInput = document.getElementById("icoFileInput");
    const files = event.dataTransfer.files;

    if (files.length > 0) {
        fileInput.files = files;
        showUploadSuccess();
    }
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

document.addEventListener("DOMContentLoaded", function() {
    const historyTableBody = document.querySelector(".history tbody");
    let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];

    history.forEach((entry, index) => {
        let row = document.createElement("tr");
        let cellIndex = document.createElement("td");
        let cellFile = document.createElement("td");
        let cellDate = document.createElement("td");

        cellIndex.textContent = index + 1;
        cellFile.textContent = entry.fileName;
        cellDate.textContent = entry.date; 

        row.appendChild(cellIndex);
        row.appendChild(cellFile);
        row.appendChild(cellDate);
        historyTableBody.appendChild(row);
    });
});
