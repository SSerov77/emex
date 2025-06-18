document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".product-form").forEach((form) => {
		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			const formData = new FormData(form);
			const product_id = formData.get("product_id");
			try {
				const response = await fetch("/api/cartproducts", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ product_id: product_id }),
					credentials: "include",
				});
				if (!response.ok) {
					alert("Ошибка при добавлении товара в корзину");
				}
			} catch (error) {
				console.error("Ошибка:", error);
			}
		});
	});
});
// Добавьте этот JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const burgerBtn = document.querySelector('.burger-btn');
  const nav = document.querySelector('.nav');
  
  burgerBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    nav.classList.toggle('active');
    
    // Блокировка скролла при открытом меню
    if (nav.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Закрытие меню при клике на ссылку
  const navLinks = document.querySelectorAll('.nav-ph');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      burgerBtn.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
});
