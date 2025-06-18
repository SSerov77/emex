document.addEventListener("DOMContentLoaded", () => {
	const buttons = document.querySelectorAll(".btn");
	const delete_buttons = document.querySelectorAll(".delete-button");
	if (buttons) {
		buttons.forEach((b) => {
			b.addEventListener("click", async (e) => {
				e.preventDefault();
				const id = b.getAttribute("data-id");
				try {
					const response = await fetch(`/api/reviews/${id}`, {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
					});
					if (response.ok) {
						b.closest("tr").remove();
					} else {
						const error = await response.json();
						alert(`Ошибка: ${error.message}`);
					}
				} catch (err) {
					console.error("Ошибка при удалении отзыва:", err);
					alert("Произошла ошибка при удалении отзыва");
				}
			});
		});
	}
	if (delete_buttons) {
		delete_buttons.forEach((b) => {
			b.addEventListener("click", async (e) => {
				e.preventDefault();
				const id = b.getAttribute("data-id");
				try {
					const response = await fetch(`/api/products/${id}`, {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
					});
					if (response.ok) {
						b.closest("tr").remove();
					} else {
						const error = await response.json();
						alert(`Ошибка: ${error.message}`);
					}
				} catch (err) {
					console.error("Ошибка при удалении товара:", err);
					alert("Произошла ошибка при удалении товара");
				}
			});
		});
	}
});


// Мобильное меню
document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
    document.querySelector('.sidebar-menu').classList.toggle('active');
});

// Закрытие меню при клике вне его
document.addEventListener('click', function(e) {
    const sidebar = document.querySelector('.sidebar-menu');
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    
    if (!sidebar.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// Обработчик для кнопок удаления (если нужно)
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        const reviewId = this.getAttribute('data-id');
        // Ваш код для удаления отзыва
        console.log('Удалить отзыв с ID:', reviewId);
    });
});

