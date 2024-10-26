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
        const convertedIcoData = event.target.result; // Placeholder untuk hasil konversi

        // Ambil nama file asli dan buat nama file ICO
        const originalFileName = file.name.replace(/\.[^/.]+$/, ""); // Menghapus ekstensi
        const icoFileName = `${originalFileName}.ico`; // Tambahkan ekstensi .ico

        // Simpan data ICO ke dalam objek Blob untuk unduhan
        const blob = new Blob([convertedIcoData], { type: 'image/x-icon' });
        const url = URL.createObjectURL(blob);

        // Update href downloadIco dan nama file
        downloadIco.href = url; 
        downloadIco.download = icoFileName; // Ganti nama file yang diunduh
        downloadIco.style.display = "block"; // Tampilkan tautan unduhan

        // Tampilkan downloadLink
        downloadLink.style.display = "block"; 
    };

    reader.readAsArrayBuffer(file); // Menggunakan ArrayBuffer untuk contoh
}
