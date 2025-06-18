document.addEventListener("DOMContentLoaded", () => {
	const orderForm = document.getElementById("order-form");
	orderForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		const formData = new FormData(orderForm);
		const total_price = formData.get("total_price");
		const phone = formData.get("phone");
		try {
			const response = await fetch("/api/orders", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ total_price, phone }),
			});

			const result = await response.json();
			if (response.ok) {
				alert("Заказ успешно оформлен!");
				window.location.href = "/dost";
			} else {
				throw new Error(result.message || "Ошибка при оформлении заказа");
			}
		} catch (error) {
			console.error("Ошибка:", error);
			alert(error.message);
		}
	});
});
document.addEventListener('DOMContentLoaded', function() {
  const burgerMenu = document.querySelector('.burger-menu');
  const nav = document.querySelector('.nav');
  
  burgerMenu.addEventListener('click', function() {
    this.classList.toggle('active');
    nav.classList.toggle('active');
    
    // Анимация бургер-меню в крестик
    const spans = this.querySelectorAll('span');
    if (nav.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
});
