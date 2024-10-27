function convertPngToIco() {
    const fileInput = document.getElementById('pngFileInput');
    const downloadLink = document.getElementById('downloadLink');
    const downloadIco = document.getElementById('downloadIco');

    if (fileInput.files.length === 0) {
        alert("Please select a PNG file to convert.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const convertedIcoData = event.target.result; 

        const originalFileName = file.name.replace(/\.[^/.]+$/, ""); 
        const icoFileName = `${originalFileName}.ico`; 

        const blob = new Blob([convertedIcoData], { type: 'image/x-icon' });
        const url = URL.createObjectURL(blob);

        downloadIco.href = url; 
        downloadIco.download = icoFileName; 
        downloadIco.style.display = "block"; 

        downloadLink.style.display = "block"; 
    };

    reader.readAsArrayBuffer(file);
}
