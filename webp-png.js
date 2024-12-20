let originalFileName = "";

function showUploadSuccess() {
    const fileInput = document.getElementById("webpFileInput");
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


function convertWebpToPng() {
    const fileInput = document.getElementById("webpFileInput");
    const pngDownloadLink = document.getElementById("pngDownloadLink");
    const downloadPng = document.getElementById("downloadPng");

    if (fileInput.files.length === 0) {
        alert("Please select a WEBP file first.");
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
                pngDownloadLink.style.display = "block";

                addToHistory(`${originalFileName}.webp -> ${originalFileName}.png`);
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

document.addEventListener("DOMContentLoaded", function() {
    const dropArea = document.getElementById("dropArea");

    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropArea.classList.add("drag-over");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("drag-over");
    });

    dropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        dropArea.classList.remove("drag-over");

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            document.getElementById("webpFileInput").files = files;
            showUploadSuccess();
        }
    });
});
