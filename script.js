// Variable para almacenar rutinas guardadas
let rutinasGuardadas = JSON.parse(localStorage.getItem('rutinasGuardadas')) || {};

// Función para guardar rutina
function guardarRutina() {
    const nombreRutina = document.getElementById('nombre-rutina').value;
    if (!nombreRutina || !document.getElementById('routineList').hasChildNodes()) {
        alert('Debe ingresar un nombre y crear al menos un ejercicio.');
        return;
    }

    const rutina = [];
    const items = document.querySelectorAll('#routineList li');
    items.forEach(item => rutina.push(item.textContent));

    rutinasGuardadas[nombreRutina] = rutina;

    // Actualizar `localStorage`
    localStorage.setItem('rutinasGuardadas', JSON.stringify(rutinasGuardadas));

    // Actualizar lista de rutinas guardadas
    const option = document.createElement('option');
    option.value = nombreRutina;
    option.textContent = nombreRutina;
    document.getElementById('lista-rutinas').appendChild(option);

    alert(`Rutina '${nombreRutina}' guardada exitosamente.`);
    document.getElementById('nombre-rutina').value = ''; // Limpiar nombre
    document.getElementById('routineList').innerHTML = ''; // Limpiar lista de ejercicios
}

// Función para cargar rutina
function cargarRutina(nombreRutina) {
    if (!rutinasGuardadas[nombreRutina]) return;

    const rutina = rutinasGuardadas[nombreRutina];
    const routineList = document.getElementById('routineList');
    routineList.innerHTML = ''; // Limpiar lista actual

    rutina.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        routineList.appendChild(li);
    });

    alert(`Rutina '${nombreRutina}' cargada exitosamente.`);
}

// Función para eliminar rutina
function eliminarRutina() {
    const nombreRutina = document.getElementById('lista-rutinas').value;
    if (!nombreRutina) {
        alert('Debe seleccionar una rutina para eliminar.');
        return;
    }

    delete rutinasGuardadas[nombreRutina];

    // Actualizar `localStorage`
    localStorage.setItem('rutinasGuardadas', JSON.stringify(rutinasGuardadas));

    // Actualizar lista de rutinas guardadas
    const listaRutinas = document.getElementById('lista-rutinas');
    listaRutinas.removeChild(listaRutinas.querySelector(`option[value="${nombreRutina}"]`));

    // Limpiar la lista de ejercicios
    document.getElementById('routineList').innerHTML = '';

    alert(`Rutina '${nombreRutina}' eliminada exitosamente.`);
}

// Código de tu rutina
document.getElementById('addButton').addEventListener('click', function() {
    const word = document.getElementById('wordInput').value;
    const time = parseInt(document.getElementById('timeInput').value, 10);
    const restTime = parseInt(document.getElementById('restInput').value, 10);

    if (word && !isNaN(time) && time >= 6) {
        const li = document.createElement('li');
        li.textContent = `${word} - ${time} segundos`;
        document.getElementById('routineList').appendChild(li);

        // Añadir periodo de descanso
        if (!isNaN(restTime) && restTime > 0) {
            const restLi = document.createElement('li');
            restLi.textContent = `Descanso - ${restTime} segundos`;
            document.getElementById('routineList').appendChild(restLi);
        }

        // Limpiar campos de entrada
        document.getElementById('wordInput').value = '';
        document.getElementById('timeInput').value = '';
    } else if (time < 6) {
        alert('El tiempo debe ser al menos 6 segundos.');
    }
});

let interval;
let paused = false;
let currentIndex = 0;
let items;

function showNextItem() {
    if (currentIndex < items.length && !paused) {
        const item = items[currentIndex];
        const text = item.textContent;
        const isRest = text.startsWith('Descanso');
        const word = isRest ? 'Descanso' : text.split(' - ')[0];
        const time = isRest ? parseInt(text.split(' - ')[1], 10) * 1000 : parseInt(text.split(' - ')[1], 10) * 1000;

        document.getElementById('display').textContent = `Palabra: ${word} - Tiempo restante: ${time / 1000} segundos`;

        let countdown = time / 1000;
        interval = setInterval(() => {
            if (paused) return; // No actualizar si está en pausa
            countdown--;
            document.getElementById('display').textContent = `Palabra: ${word} - Tiempo restante: ${countdown} segundos`;

            // Reproducir sonido cuando queden 6 segundos o menos
            if (countdown <= 6 && countdown > 5) {
                document.getElementById('alertSound').play();
            }

            if (countdown <= 0) {
                clearInterval(interval);
                currentIndex++;
                showNextItem();
            }
        }, 1000);
    } else {
        document.getElementById('display').textContent = 'Rutina finalizada.';
    }
}

document.getElementById('startButton').addEventListener('click', function() {
    items = document.querySelectorAll('#routineList li');
    currentIndex = 0;
    paused = false;

    showNextItem(); // Iniciar rutina
});

document.getElementById('pauseButton').addEventListener('click', function() {
    paused = true;
});

document.getElementById('playButton').addEventListener('click', function() {
    if (paused) {
        paused = false;
        showNextItem(); // Reanudar rutina
    }
});

document.getElementById('stopButton').addEventListener('click', function() {
    clearInterval(interval);
    paused = false;
    document.getElementById('display').textContent = 'Rutina finalizada.';
});

// Cargar rutinas guardadas en la página
window.onload = function() {
    const listaRutinas = document.getElementById('lista-rutinas');
    Object.keys(rutinasGuardadas).forEach(nombreRutina => {
        const option = document.createElement('option');
        option.value = nombreRutina;
        option.textContent = nombreRutina;
        listaRutinas.appendChild(option);
    });
};