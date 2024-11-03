document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("contextmenu", function(event) {
        event.preventDefault();
    });
    const purposeSelect = document.getElementById("purpose");
    const kedinasanFields = document.getElementById("kedinasanFields");
    const guestForm = document.getElementById("guestForm");
    const toggleGuestListButton = document.getElementById("toggleGuestList");
    const guestTable = document.getElementById("guestTable");
    const guestTableBody = document.getElementById("guestTableBody");

        removeOldGuests();
    loadGuests();

        purposeSelect.addEventListener("change", function () {
        kedinasanFields.style.display = this.value === "kedinasan" ? "block" : "none";
    });

        guestForm.addEventListener("submit", function (event) {
        event.preventDefault();

                const date = document.getElementById("date").value;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const name = document.getElementById("name").value;
        const purpose = purposeSelect.value;
        const nip = document.getElementById("nip").value || "-";
        const position = document.getElementById("position").value || "-";
        const institution = document.getElementById("institution").value || "-";
        const book = document.getElementById("book").value;

        const guest = { date, time, name, purpose, nip, position, institution, book };

                saveGuest(guest);
        swal({
            title: "Data Tamu Tercatat!",
            text: `Tanggal: ${date}\nWaktu: ${time}\nNama: ${name}\nKedinasan/Umum: ${purpose}\n${purpose === 'Kedinasan' ? `NIP: ${nip}\nJabatan: ${position}\nInstansi: ${institution}\n` : ''}Tujuan Kunjungan: ${book}`,
            icon: "success",
            buttons: true,
        }).then((willAdd) => {
            if (willAdd) {
                loadGuests();
                guestForm.reset();
                kedinasanFields.style.display = "none";
            }
        });
    });

   document.getElementById("toggleGuestList").addEventListener("click", function() {
    const guestTable = document.getElementById("guestTable");
    const actionButtons = document.getElementById("actionButtons");

        guestTable.classList.toggle("d-none");

        if (!guestTable.classList.contains("d-none")) {
        actionButtons.classList.remove("d-none");     } else {
        actionButtons.classList.add("d-none");     }
});


          document.getElementById("printButton").addEventListener("click", printGuestList);

     function printGuestList() {
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
        document.head.removeChild(style);     }   
  
    function loadGuests() {
        guestTableBody.innerHTML = "";     
        const guests = JSON.parse(localStorage.getItem("guests")) || [];     
        guests.forEach(guest => {
            const row = `<tr>
                <td style="text-align: left;">${guest.date} ${guest.time}</td>
                <td style="text-align: left;">${guest.name}</td>
                <td style="text-align: left;">${guest.purpose}</td>
                <td style="text-align: left;">${guest.nip}</td>
                <td style="text-align: left;">${guest.position}</td>
                <td style="text-align: left;">${guest.institution}</td>
                <td style="text-align: left;">${guest.book}</td>
            </tr>`;
            guestTableBody.insertAdjacentHTML("beforeend", row);         });
    }   

    function removeOldGuests() {
            }

    function saveGuest(guest) {
        const guests = JSON.parse(localStorage.getItem("guests")) || [];         guests.push(guest);         localStorage.setItem("guests", JSON.stringify(guests));     }
});
