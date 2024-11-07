
function saveGuest(guest) {
    const url = 'https://script.google.com/macros/s/AKfycbxbPFnIVfM0nvx5BcDpZQtHsf3DfSNJ8Sy7xVciBFakqJHQrp2OIS9eayCw1pk6phmPOg/exec';
    console.log("Sending to:", url);
    console.log("Guest data:", guest); 

    
    const formattedDate = new Date(guest.date).toISOString().split("T")[0];
    guest.date = formattedDate;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(guest),
        mode: 'no-cors' 
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response data:", data); 
        if (data.status === 'success') {
            console.log('Guest data successfully saved to Google Sheets!');
        } else {
            console.error('Error saving guest data!');
        }
    })
    .catch((error) => {
        console.error('Error:', error); 
    });
}


function loadGuests() {
    const url = 'https://script.google.com/macros/s/AKfycbxbPFnIVfM0nvx5BcDpZQtHsf3DfSNJ8Sy7xVciBFakqJHQrp2OIS9eayCw1pk6phmPOg/exec'; 
    const guestTableBody = document.getElementById("guestTableBody");
    guestTableBody.innerHTML = ""; 

    fetch(url) 
        .then(response => response.json())
        .then(guests => {
            if (guests.length === 0) {
                
                const row = document.createElement("tr");
                const cell = row.insertCell(0);
                cell.colSpan = 7;
                cell.textContent = "Tidak ada data tamu untuk hari ini.";
                cell.style.textAlign = "center";
                cell.style.fontStyle = "italic";
                cell.style.color = "#6c757d";
                guestTableBody.appendChild(row);
            } else {
                
                guests.forEach(guest => {
                    const dateObj = new Date(guest.date);
                    const formattedDate = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('en-CA') : guest.date;

                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td style="text-align: left;">${formattedDate}</td>
                        <td style="text-align: left;">${guest.name}</td>
                        <td style="text-align: left;">${guest.purpose}</td>
                        <td style="text-align: left;">${guest.nip}</td>
                        <td style="text-align: left;">${guest.position}</td>
                        <td style="text-align: left;">${guest.institution}</td>
                        <td style="text-align: left;">${guest.book}</td>
                    `;
                    guestTableBody.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error loading guest data:', error));
}


function addGuest(data) {
    const url = 'https://script.google.com/macros/s/AKfycbxbPFnIVfM0nvx5BcDpZQtHsf3DfSNJ8Sy7xVciBFakqJHQrp2OIS9eayCw1pk6phmPOg/exec'; // URL for the web app (for doPost)
    
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data) 
    })
    .then(response => response.json())
    .then(result => {
        console.log('Guest added:', result);
        
        
        loadGuests();
    })
    .catch(error => console.error('Error adding guest:', error));
}


const newGuestData = {
    date: new Date().toISOString(), 
    name: 'John Doe',
    purpose: 'Meeting',
    nip: '12345',
    position: 'Manager',
    institution: 'ABC Corp',
    book: 'Meeting Book'
};

addGuest(newGuestData); 

function resetGuestData() {
    Swal.fire({
        title: 'Are you sure?',
        text: "All guest records will be deleted!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete all records!'
    }).then((result) => {
        if (result.isConfirmed) {
            
            loadGuests(); 
            Swal.fire(
                'Deleted!',
                'All guest records have been deleted.',
                'success'
            );
        }
    });
}


function printGuestList() {
    const guestTable = document.getElementById("guestTable");
    const guestData = guestTable.outerHTML;

    document.getElementById("printGuestTable").innerHTML = guestData;
    document.getElementById("printDate").textContent = new Date().toLocaleDateString();

    const printSection = document.getElementById("printSection");
    printSection.style.display = "block";

    const style = document.createElement("style");
    style.innerHTML = `
        @media print {
            body > *:not(#printSection) {
                display: none;
            }
            #printSection {
                display: block;
            }
        }
    `;
    document.head.appendChild(style);

    window.print(); 

    printSection.style.display = "none"; 
    document.head.removeChild(style); 
}


document.addEventListener("DOMContentLoaded", () => {
    const purposeSelect = document.getElementById("purpose");
    const kedinasanFields = document.getElementById("kedinasanFields");
    const guestForm = document.getElementById("guestForm");
    const toggleGuestListButton = document.getElementById("toggleGuestList");
    const guestTable = document.getElementById("guestTable");

    loadGuests(); 

    
    purposeSelect.addEventListener("change", function () {
        kedinasanFields.style.display = this.value === "kedinasan" ? "block" : "none";
    });

    
    guestForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const date = document.getElementById("date").value;
        const name = document.getElementById("name").value;
        const purpose = purposeSelect.value;
        const nip = document.getElementById("nip").value || "-";
        const position = document.getElementById("position").value || "-";
        const institution = document.getElementById("institution").value || "-";
        const book = document.getElementById("book").value;

        const guest = { date, name, purpose, nip, position, institution, book };

        saveGuest(guest); 
        Swal.fire({
            title: "Tamu berhasil ditambahkan!",
            text: `Tanggal: ${date}\nNama: ${name}\nKedinasan/Umum: ${purpose}\nTujuan: ${book}`,
            icon: "success",
            showConfirmButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                guestForm.reset(); 
                kedinasanFields.style.display = "none"; 
            }
        });
    });

    
    toggleGuestListButton.addEventListener("click", function () {
        guestTable.classList.toggle("d-none");

        const actionButtons = document.getElementById("actionButtons");
        if (!guestTable.classList.contains("d-none")) {
            actionButtons.classList.remove("d-none");
        } else {
            actionButtons.classList.add("d-none");
        }
    });

    
    document.getElementById("resetDataButton").addEventListener("click", resetGuestData);

    
    document.getElementById("printButton").addEventListener("click", printGuestList);
});
