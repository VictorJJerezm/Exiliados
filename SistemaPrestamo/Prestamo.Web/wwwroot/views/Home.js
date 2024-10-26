document.addEventListener("DOMContentLoaded", function () {
    // Mostrar el overlay de carga
    $.LoadingOverlay("show");

    // Llamada para obtener el resumen
    fetch("/Home/ObtenerResumen", {
        method: "GET",
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
    }).then(response => {
        return response.ok ? response.json() : Promise.reject(response);
    }).then(responseJson => {
        // Ocultar el overlay de carga
        $.LoadingOverlay("hide");
        if (responseJson.data != undefined) {
            const r = responseJson.data;
            $("#spInteresAcumulado").text(r.interesAcumulado);
            $("#spPrestamosCancelados").text(r.prestamosCancelados);
            $("#spPrestamosPendientes").text(r.prestamosPendientes);
            $("#spTotalClientes").text(r.totalClientes);
        }
    }).catch((error) => {
        // Ocultar el overlay de carga en caso de error
        $.LoadingOverlay("hide");
        Swal.fire({
            title: "Error!",
            text: "No se pudo cargar el resumen.",
            icon: "warning"
        });
    });

    // FUNCIONALIDAD EXTRA: Mostrar la hora en tiempo real
    function actualizarReloj() {
        const now = new Date();
        const horas = now.getHours().toString().padStart(2, '0');
        const minutos = now.getMinutes().toString().padStart(2, '0');
        const segundos = now.getSeconds().toString().padStart(2, '0');
        const tiempoActual = `${horas}:${minutos}:${segundos}`;
        document.getElementById('reloj').innerText = tiempoActual;
    }
    setInterval(actualizarReloj, 1000);  // Actualiza el reloj cada segundo

    // FUNCIONALIDAD EXTRA: Implementar un mini calendario con flatpickr
    flatpickr("#fecha", {
        dateFormat: "Y-m-d",  // Formato de la fecha
        altInput: true,
        altFormat: "F j, Y",
        allowInput: true
    });

    // FUNCIONALIDAD DE NOTAS
    const notesContainer = document.getElementById("notes-container");
    const addNoteBtn = document.getElementById("add-note-btn");

    // Función para crear una nueva nota
    function createNote(content = '') {
        const note = document.createElement("div");
        note.classList.add("note");

        note.innerHTML = `
            <textarea>${content}</textarea>
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">Eliminar</button>
        `;

        // Funcionalidad para editar la nota
        const editBtn = note.querySelector(".edit-btn");
        editBtn.addEventListener("click", () => {
            const textarea = note.querySelector("textarea");
            textarea.disabled = !textarea.disabled; // Habilitar/Deshabilitar edición
            if (!textarea.disabled) {
                textarea.focus(); // Enfocar el textarea al habilitar edición
            }
            saveNotes(); // Guardar cambios después de editar
        });

        // Funcionalidad para eliminar la nota
        const deleteBtn = note.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => {
            notesContainer.removeChild(note);
            saveNotes(); // Guardar cambios después de eliminar
        });

        notesContainer.appendChild(note);
        saveNotes(); // Guardar la nueva nota
    }

    // Función para guardar las notas en localStorage
    function saveNotes() {
        const notes = [];
        notesContainer.querySelectorAll("textarea").forEach(note => {
            notes.push(note.value); // Guardar el contenido del textarea
        });
        localStorage.setItem("notes", JSON.stringify(notes)); // Guardar las notas como un array de strings
    }

    // Función para cargar las notas desde localStorage
    function loadNotes() {
        const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
        savedNotes.forEach(noteContent => {
            createNote(noteContent); // Cargar las notas guardadas
        });
    }

    // Agregar una nueva nota al hacer clic en el botón
    addNoteBtn.addEventListener("click", () => {
        createNote(); // Crear una nueva nota vacía
    });

    // Cargar notas guardadas al cargar la página
    loadNotes();

    // Llamada para obtener los cupones disponibles
    fetch("/Home/ObtenerCupones", {
        method: "GET",
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
    }).then(response => {
        return response.ok ? response.json() : Promise.reject(response);
    }).then(cupones => {
        // Ocultar el overlay de carga
        $.LoadingOverlay("hide");

        const cuponesList = document.getElementById('cupones-list');

        if (cupones && cupones.length > 0) {
            cupones.forEach(cupon => {
                const li = document.createElement('li');
                li.textContent = `Cupón: ${cupon.nombre} - Descuento: ${cupon.descuento}%`;
                cuponesList.appendChild(li);
            });
        } else {
            cuponesList.innerHTML = '<li>No hay cupones disponibles en este momento.</li>';
        }
    });
});
