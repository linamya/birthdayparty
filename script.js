document.addEventListener("DOMContentLoaded", () => {
    const envelope = document.getElementById("envelope-overlay");
    const bgMusic = document.getElementById("bg-music");
    const openModalImg = document.getElementById("open-modal-img");
    const modalForm = document.getElementById("modal-form");
    const closeModal = document.getElementById("close-modal");
    const rsvpForm = document.getElementById("rsvp-form");

    // Открытие конверта и воспроизведение музыки
    envelope.addEventListener("click", () => {
        envelope.classList.add("open");
        
        // Устанавливаем стартовое время на 7 секунд
        bgMusic.currentTime = 7;

        // Старт фоновой музыки
        bgMusic.play().catch(error => {
            console.log("Автовоспроизведение блокировано браузером:", error);
        });

        // Скрытие конверта после завершения анимации
        setTimeout(() => {
            envelope.style.display = "none";
        }, 800);
    });

    // Открытие анкеты по клику на 4-й блок (фото 4)
    openModalImg.addEventListener("click", () => {
        modalForm.style.display = "flex";
    });

    // Закрытие анкеты по крестику
    closeModal.addEventListener("click", () => {
        modalForm.style.display = "none";
    });

    // Закрытие анкеты при клике вне зоны формы
    window.addEventListener("click", (event) => {
        if (event.target === modalForm) {
            modalForm.style.display = "none";
        }
    });

   // Обработка отправки анкеты
rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = rsvpForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'ОТПРАВКА...';

    // Сбор данных формы
    const formData = new FormData(rsvpForm);
    const payload = {
        fullname: formData.get('fullname'),
        attendance: formData.get('attendance')
    };

    // Укажите ссылку на ваш deployed Cloudflare Worker
    const WORKER_URL = 'https://pinktg.awsjfe.workers.dev/';

    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Спасибо! Ваш ответ отправлен.");
            modalForm.style.display = "none";
            rsvpForm.reset();
        } else {
            alert("Произошла ошибка при отправке. Попробуйте еще раз.");
        }
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Не удалось отправить форму. Проверьте соединение с интернетом.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'ОТПРАВИТЬ';
    }
});
});