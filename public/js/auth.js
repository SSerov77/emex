document.addEventListener("DOMContentLoaded", () => {
	// Открытие попапа при нажатии на "Войти"

	const login_link = document.getElementById("login-link");
	if (login_link) {
		login_link.addEventListener("click", function (event) {
			event.preventDefault();
			document.getElementById("auth-popup").style.display = "flex";
			document.getElementById("auth-login-form").style.display = "block";
			document.getElementById("auth-register-form").style.display = "none";
		});
	}

	// Закрытие попапа при нажатии на крестик
	document.querySelector(".auth-close-popup").addEventListener("click", function () {
		document.getElementById("auth-popup").style.display = "none";
	});

	// Переключение на форму регистрации
	document.getElementById("auth-show-register").addEventListener("click", function (event) {
		event.preventDefault();
		document.getElementById("auth-login-form").style.display = "none";
		document.getElementById("auth-register-form").style.display = "block";
	});

	// Переключение на форму авторизации
	document.getElementById("auth-show-login").addEventListener("click", function (event) {
		event.preventDefault();
		document.getElementById("auth-register-form").style.display = "none";
		document.getElementById("auth-login-form").style.display = "block";
	});

	// Обработка формы авторизации
	document.getElementById("auth-login").addEventListener("submit", function (event) {
		event.preventDefault();
		const email = document.getElementById("auth-login-email").value;
		const password = document.getElementById("auth-login-password").value;

		// Отправка данных на сервер
		fetch("/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.user) {
					location.reload();
				} else {
					alert("Ошибка авторизации: " + data.message);
				}
			})
			.catch((error) => {
				console.error("Ошибка:", error);
			});
	});

	// Обработка формы регистрации
	document.getElementById("auth-register").addEventListener("submit", function (event) {
		event.preventDefault();

		const username = document.getElementById("auth-register-username").value;
		const email = document.getElementById("auth-register-email").value;
		const password = document.getElementById("auth-register-password").value;
		const passwordConfirm = document.getElementById("auth-register-password-confirm").value;
		const errorMessage = document.getElementById("auth-register-error");

		// Проверка совпадения паролей
		if (password !== passwordConfirm) {
			errorMessage.style.display = "block";
			return; // Остановить выполнение функции, если пароли не совпадают
		} else {
			errorMessage.style.display = "none";
		}

		// Отправка данных на сервер
		fetch("/api/auth/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, email, password }),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.user) {
					location.reload();
				} else {
					alert("Ошибка регистрации: " + data.message);
				}
			})
			.catch((error) => {
				console.error("Ошибка:", error);
			});
	});
});
