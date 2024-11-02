let originalFileName = "";

function showUploadSuccess() {
    const fileInput = document.getElementById("imageFileInput");
    const fileName = fileInput.files[0].name;
    const fileLabel = document.querySelector(".file-label");
    fileLabel.textContent = `${fileName}`;
    originalFileName = fileName.replace(/\.[^/.]+$/, "");
}

function compressImage() {
    const fileInput = document.getElementById("imageFileInput");
    const downloadLink = document.getElementById("downloadLink");
    const downloadCompressed = document.getElementById("downloadCompressed");

    if (fileInput.files.length === 0) {
        alert("Silakan pilih file gambar terlebih dahulu.");
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
                downloadCompressed.href = url;
                downloadCompressed.download = `${originalFileName}_compressed.png`;
                downloadLink.style.display = "block";

                addToHistory(`${originalFileName}_compressed.png`);
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
