let originalFileName = "";

function showUploadSuccess() {
    const fileInput = document.getElementById("svgFileInput");
    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    const fileName = file.name;
    const fileSize = file.size;
    let displaySize;

    if (fileSize < 1024) {
        displaySize = `${fileSize} B`;
    } else if (fileSize < 1048576) {
        displaySize = `${(fileSize / 1024).toFixed(2)} KB`;
    } else if (fileSize < 1073741824) {
        displaySize = `${(fileSize / 1048576).toFixed(2)} MB`;
    } else {
        displaySize = `${(fileSize / 1073741824).toFixed(2)} GB`;
    }

    const fileLabel = document.querySelector(".file-label");
    fileLabel.textContent = `${fileName} (${displaySize})`;
}

function convertSvgToPng() {
    const fileInput = document.getElementById("svgFileInput");
    const downloadLink = document.getElementById("downloadLink");
    const downloadPng = document.getElementById("downloadPng");

    if (fileInput.files.length === 0) {
        alert("Please select an SVG file first.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const svgData = e.target.result;
        const img = new Image();
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);

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

                addToHistory(`${originalFileName}.svg -> ${originalFileName}.png`);
            }, "image/png");
        };
    };

    reader.readAsText(file);
}

function addToHistory(fileName) {
    let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];

    const conversionEntry = {
        fileName: fileName,
        date: new Date().toLocaleString()
    };

    history.push(conversionEntry);
    localStorage.setItem("conversionHistory", JSON.stringify(history));
}

function handleDrop(event) {
    event.preventDefault();
    const fileInput = document.getElementById("svgFileInput");
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
