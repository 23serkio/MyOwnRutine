document.getElementById('addButton').addEventListener('click', function() {
    const word = document.getElementById('wordInput').value;
    const time = parseInt(document.getElementById('timeInput').value, 10);
    const restTime = parseInt(document.getElementById('restInput').value, 10);

    if (word && !isNaN(time) && time >= 6) {
        const li = document.createElement('li');
        li.textContent = `${word} - ${time} segundos`;
        document.getElementById('routineList').appendChild(li);

        // Add rest period if a rest time is specified
        if (!isNaN(restTime) && restTime > 0) {
            const restLi = document.createElement('li');
            restLi.textContent = `Descanso - ${restTime} segundos`;
            document.getElementById('routineList').appendChild(restLi);
        }

        // Clear input fields
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

document.getElementById('startButton').addEventListener('click', function() {
    items = document.querySelectorAll('#routineList li');
    currentIndex = 0;
    paused = false;

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
                if (paused) return; // Stop updating if paused
                countdown--;
                document.getElementById('display').textContent = `Palabra: ${word} - Tiempo restante: ${countdown} segundos`;

                // Play sound when 6 seconds or less remain
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

    showNextItem(); // Start the routine
});

document.getElementById('pauseButton').addEventListener('click', function() {
    paused = true;
});

document.getElementById('playButton').addEventListener('click', function() {
    if (paused) {
        paused = false;
        showNextItem(); // Resume the routine
    }
});

document.getElementById('stopButton').addEventListener('click', function() {
    clearInterval(interval);
    paused = false;
    document.getElementById('display').textContent = 'Rutina finalizada.';
});