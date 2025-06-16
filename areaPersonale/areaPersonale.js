const container=document.getElementById("container");
const mokLibri = [{
    titolo: 'Harry Potte',



}
]


async function getLibri() {
            const response = await fetch("http://localhost:8080/api/libri/getAllLibri");
            const libri = await response.json();
            mostraLibri(libri);
    }

    function mostraLibri(libri) {
        container.innerHTML = "";

        libri.forEach(libro => {
            const col = document.createElement("div");
            col.innerHTML = `
                 <div class="card libro-card h-100">
                        <img src="${copertinaUrl}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${libro.titolo}</h5>
                            <p class="card-text"><strong>Autore:</strong> ${libro.autore}</p>
                            <p class="card-text"><strong>Genere:</strong> ${libro.genere}</p>
                            
                            <ul class="list-group list-group-flush mt-3" style="display: none;">
                                <li class="list-group-item"><strong>Editore:</strong> ${libro.casaEditrice}</li>
                                <li class="list-group-item"><strong>ISBN:</strong> ${libro.iban}</li>
                                <li class="list-group-item ${libro.disponibilita ? 'disponibile' : 'non-disponibile'}">
                                    <strong>Disponibilità:</strong> ${libro.disponibilita ? 'Disponibile' : 'Non disponibile'}
                                </li>
                            </ul>
                            
                            <a class="toggle-details mt-2 d-block" onclick="toggleDetails(this)">
                                <i class="fas fa-chevron-down"></i> Mostra dettagli
                            </a>
                        </div>
                    </div>
                `;

            container.appendChild(col);
        });
    }
    document.addEventListener("DOMContentLoaded", getLibri);