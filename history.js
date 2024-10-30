function saveConversionHistory(fileName) {
    const history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
    const currentDate = new Date().toLocaleDateString();
    console.log("Tanggal yang disimpan:", currentDate);
    history.push({ fileName: fileName, date: currentDate });
    localStorage.setItem("conversionHistory", JSON.stringify(history));
}

function displayConversionHistory() {
    const conversionHistory = JSON.parse(localStorage.getItem("conversionHistory")) || [];
    const historyContainer = document.getElementById("conversionHistoryList");

    historyContainer.innerHTML = "";

    if (conversionHistory.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 2;
        cell.textContent = "Tidak ada riwayat konversi.";
        row.appendChild(cell);
        historyContainer.appendChild(row);
    } else {
        conversionHistory.forEach(item => {
            const row = document.createElement("tr");
            const fileNameCell = document.createElement("td");
            const dateCell = document.createElement("td");

            fileNameCell.textContent = item.fileName;
            dateCell.textContent = item.date;

            row.appendChild(fileNameCell);
            row.appendChild(dateCell);
            historyContainer.appendChild(row);
        });
    }
}

function hapusRiwayat() {
    if (confirm("Apakah Anda yakin ingin menghapus semua riwayat konversi?")) {
        localStorage.removeItem("conversionHistory");
        displayConversionHistory();
        console.log("Riwayat konversi telah dihapus.");
    }
}

document.addEventListener("DOMContentLoaded", displayConversionHistory);
