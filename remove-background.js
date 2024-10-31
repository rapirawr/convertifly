let originalFileName = "";

function showUploadSuccess() {
    const fileInput = document.getElementById("bgFileInput");
    const fileName = fileInput.files[0].name;
    const fileLabel = document.querySelector(".file-label");
    fileLabel.textContent = `${fileName}`;
    originalFileName = fileName.replace(/\.[^/.]+$/, "");
}

async function removeBackground() {
    const fileInput = document.getElementById("bgFileInput");
    const downloadLink = document.getElementById("downloadLink");
    const downloadTransparent = document.getElementById("downloadTransparent");

    if (fileInput.files.length === 0) {
        alert("Please select an image file first.");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    try {
        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
                "X-Api-Key": "2V1fwEnNrPqw8tn9qTU7BGie"
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error("Failed to remove background. Please try again.");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        downloadTransparent.href = url;
        downloadTransparent.download = `${originalFileName}-remove-bg.png`;
        downloadLink.style.display = "block";

        addToHistory(`${originalFileName} (background removed)`);
    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
}

function handleDrop(event) {
    event.preventDefault();
    const fileInput = document.getElementById("bgFileInput");
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