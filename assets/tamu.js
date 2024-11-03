
function saveGuest(guest) {
    let guests = JSON.parse(localStorage.getItem("guests")) || [];
    guests.push(guest);
    localStorage.setItem("guests", JSON.stringify(guests));
}


function loadGuests() {
    const guestTableBody = document.getElementById("guestTableBody");
    guestTableBody.innerHTML = ""; 
    const guests = JSON.parse(localStorage.getItem("guests")) || [];
    const today = new Date().toISOString().split("T")[0]; 

    
    const todaysGuests = guests.filter(guest => guest.date === today);
    todaysGuests.forEach(guest => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: left;">${guest.date} ${guest.time}</td>
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



function removeOldGuests() {
    
    
}


document.getElementById("resetDataButton").addEventListener("click", resetGuestData);

function resetGuestData() {
    Swal.fire({
        title: 'Yakin nih?',
        text: "Semua daftar tamu akan dihapus!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus daftar tamu!'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("guests"); 
            loadGuests(); 
            Swal.fire(
                'Mantap!',
                'Data tamu berhasil dihapus!',
                'success'
            );
        }
    });
}


document.addEventListener("DOMContentLoaded", () => {
    loadGuests(); 
});


