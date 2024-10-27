let originalFileName = "";

function showUploadSuccess() {
    const fileInput = document.getElementById("webpFileInput");
    const file = fileInput.files[0];
    originalFileName = file.name.replace(/\.[^/.]+$/, ""); 
    const successMsg = document.getElementById("uploadSuccessMsg");
    successMsg.textContent = `${file.name} sukses di-upload!`;
    successMsg.style.display = "block";
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
            }, "image/png");
        };
    };

    reader.readAsDataURL(file);
}
