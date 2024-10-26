let originalFileName = "";

function showUploadSuccess() {
    const fileInput = document.getElementById("jpgFileInput");
    const file = fileInput.files[0];
    originalFileName = file.name.replace(/\.[^/.]+$/, ""); // Menghapus ekstensi dari nama file
    const successMsg = document.getElementById("uploadSuccessMsg");
    successMsg.textContent = `${file.name} sukses di-upload!`;
    successMsg.style.display = "block";
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
                downloadPng.download = `${originalFileName}.png`; // Mengganti ekstensi dengan .png
                downloadLink.style.display = "block";
            }, "image/png");
        };
    };

    reader.readAsDataURL(file);
}
