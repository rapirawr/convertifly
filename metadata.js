let originalFileName = "";

function showUploadSuccess() {
    const fileInput = document.getElementById("metadataFileInput");
    const file = fileInput.files[0];

    if (file) {
        const fileName = file.name;
        const fileSize = file.size;
        let displaySize;

        if (fileSize < 1024) {
            displaySize = `${fileSize} B`;
        } else if (fileSize < 1048576) {
            displaySize = `${(fileSize / 1024).toFixed(2)} KB`;
        } else {
            displaySize = `${(fileSize / 1048576).toFixed(2)} MB`;
        }

        const fileLabel = document.querySelector(".file-label");
        fileLabel.textContent = `${fileName} (${displaySize})`;
        originalFileName = fileName.replace(/\.[^/.]+$/, "");
        document.getElementById("uploadSuccessMsg").style.display = "block";
        document.getElementById("metadataInputs").style.display = "block";
    } else {
        document.getElementById("uploadSuccessMsg").style.display = "none";
        document.getElementById("metadataInputs").style.display = "none";
    }
}

function changeMetadata() {
    const title = document.getElementById("title").value;
    const fileInput = document.getElementById("metadataFileInput");
    const file = fileInput.files[0];

    const reader = new FileReader();
    reader.onload = function(event) {
        const image = new Image();
        image.src = event.target.result;

        image.onload = function() {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0);

            const newImageDataUrl = canvas.toDataURL("image/jpeg");
            const newSizeInBytes = getNewFileSize();
            const adjustedImageDataUrl = adjustImageDataSize(newImageDataUrl, newSizeInBytes);

            const successMessage = document.getElementById("successMessage");
            const downloadLink = document.getElementById("downloadUpdatedFile");

            setTimeout(() => {
                successMessage.style.display = "block";
                downloadLink.href = adjustedImageDataUrl;
                downloadLink.download = `${title}.jpg`;
                downloadLink.style.display = "block";
                addToHistory(`${originalFileName} (Updated Metadata)`);
            }, 500);
        }
    };
    reader.readAsDataURL(file);
}

function adjustImageDataSize(dataUrl, targetSize) {
    const base64Data = dataUrl.split(',')[1];
    const currentSize = (base64Data.length * 3) / 4;

    if (currentSize >= targetSize) {
        return dataUrl; 
    }

    const paddingSize = targetSize - currentSize;
    const paddingData = new Uint8Array(paddingSize).fill(65);

    const originalData = atob(base64Data);
    const combinedData = new Uint8Array(originalData.length + paddingData.length);
    
    for (let i = 0; i < originalData.length; i++) {
        combinedData[i] = originalData.charCodeAt(i);
    }

    for (let i = 0; i < paddingData.length; i++) {
        combinedData[originalData.length + i] = paddingData[i];
    }

    const blob = new Blob([combinedData], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
}

function getNewFileSize() {
    const bytesInput = document.getElementById("bytes").value;
    const byteUnits = document.getElementById("byteUnits").value;

    let newSizeInBytes = parseInt(bytesInput, 10);

    if (byteUnits === "kb") {
        newSizeInBytes *= 1024;
    } else if (byteUnits === "mb") {
        newSizeInBytes *= 1048576;
    } else if (byteUnits === "gb") {
        newSizeInBytes *= 1073741824;
    } else if (byteUnits === "tb") {
        newSizeInBytes *= 1099511627776;
    }

    return newSizeInBytes;
}

function addToHistory(fileName) {
    let history = JSON.parse(localStorage.getItem('metadataHistory')) || [];
    const historyEntry = {
        fileName: fileName,
        date: new Date().toLocaleString()
    };

    history.push(historyEntry);
    localStorage.setItem('metadataHistory', JSON.stringify(history));
}

document.addEventListener("DOMContentLoaded", function() {
    const historyTable = document.querySelector(".history");
    const history = JSON.parse(localStorage.getItem("metadataHistory")) || [];

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

