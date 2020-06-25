// 20-06-2020 

// назва сховища
const BASKET = 'basket';

// клас, що відповідає за кошик на сторінці -- загальна ціна, кількість товарів, товари тощо
class Basket {

	static getQuantity() {
		return document.querySelector('#basket-quantity');
	}

	static getSum() {
		return document.querySelector('#basket-sum');
	}

	static getGoods() {
		return document.querySelector('#basket-goods');
	}

	static getClear() {
		return document.querySelector('#basket-clear');
	}

	// опрацьовуємо дані
	static viewQuantity() {
		return Storage.get().reduce((sum, item) => sum += +item.number, 0);
	}

	static viewSum() {
		return Storage.get().reduce((sum, item) => sum += item.price * item.number, 0);
	}

	static viewGoods() {
		return Storage.get().reduce((sum, item, i) => sum += `<p data-id="${i}"><i></i><b>${item.name}</b>, ${item.size}: ${item.price}, ${item.number}</p>`, '');
	}

	// видаляємо товари
	static removeGoods(e) {
		if (e.target.tagName === 'I') {
			const id = e.target.parentNode.dataset.id;

			Storage.remove(id);
			Basket.reload();
			Checkout.reload();
			Form.reload();
		}
	}

	// очистка кошика
	static clearBasket() {
		Storage.clear();
		Checkout.reload();
		Form.reload();
		Basket.getQuantity().innerHTML = 0;
		Basket.getSum().innerHTML = 0;
		Basket.getGoods().innerHTML = '';
	}

	// 1 метод, який оновлює дані у кошикові
	static reload() {
		// перевірка чи існує кошик =)
		if (Basket.getQuantity()) {
			if (Storage.has()) {
				Basket.getQuantity().innerHTML = Basket.viewQuantity();
				Basket.getSum().innerHTML = Basket.viewSum();
				Basket.getGoods().innerHTML = Basket.viewGoods();
			} else {
				Basket.getQuantity().innerHTML = 0;
				Basket.getSum().innerHTML = 0;
				Basket.getGoods().innerHTML = '';
			}
		}
	}
}

// клас, який опрацьовує товари на сторінці
class Items {
	static getItems() {
		return document.querySelectorAll('.button');
	}

	static toBasket() {
		// дані з дата-атрибутів
		const content = { name: this.dataset.name, size: this.dataset.size, price: this.dataset.price, number: "1", img: this.dataset.img };

		// якщо дані вже у сховищі є, тоді додаємо до них. або ж надсилаємо перші
		if (Storage.has()) {
			Storage.add(content);
		} else {
			Storage.set(content);
		}

		Basket.reload();
	}
}

// localStorage
class Storage {
	// перевірка чи існує сховище
	static has() {
		if (localStorage.getItem(BASKET) !== null) {
			return true;
		} else {
			return false;
		}
	}

	// отримуємо дані
	static get() {
		return JSON.parse(localStorage.getItem(BASKET));
	}

	// надсилаємо дані
	static set(value) {
		if (Array.isArray(value)) {
			localStorage.setItem(BASKET, JSON.stringify(value));
		} else {
			const data = [];
			data.push(value);
			localStorage.setItem(BASKET, JSON.stringify(data));
		}
	}

	// додаємо дані
	static add(value) {
		// масив зі сховища
		const data = JSON.parse(localStorage.getItem(BASKET));
		// якщо такий товар уже є, то збільшуємо кількість на 1. або ж просто додаємо новий товар
		if (data.find(item => item.name === value.name)) {
			const checked = data.find(item => item.name === value.name);
			checked.number++;
		} else {
			// додали дані
			data.push(value);
		}
		// повертаємо у сховище оновлений масив
		localStorage.setItem(BASKET, JSON.stringify(data));
	}

	// очистка сховища
	static clear() {
		localStorage.clear(BASKET);
	}

	// видаляємо товар
	static remove(id) {
		const data = JSON.parse(localStorage.getItem(BASKET));

		data.splice(id, 1);

		if (data.length === 0) {
			localStorage.removeItem(BASKET);
		} else {
			localStorage.setItem(BASKET, JSON.stringify(data));
		}
	}

}

// оформлення замовлення
class Checkout {

	static getOrderGoods() {
		return document.querySelector('#order-goods');
	}

	static getOrderSum() {
		return document.querySelector('#order-sum');
	}

	// виводимо дані
	static viewGoods() {
		if (Storage.has()) {
			const data = Storage.get()
				.reduce((sum, item, i) => sum + `
					<div data-id="${i}" class="product">
						<div class="product-img">
							<img src="${item.img}" alt="">
						</div>
						<div class="product-name">${item.name}</div>
						<div class="product-size">${item.size}</div>
						<div class="product-price">
							<small>${item.price}грн</small> 
							<p>${item.price * item.number}грн</p>
						</div>
						<div class="product-quantity">
							<span class="minus"></span>
							<span class="number">${item.number}</span>
							<span class="plus"></span>
						</div>
						<div class="product-delete">
							<i></i>
						</div>									
					</div>`, ''); // todo: delete 'грн'
			return data;
		}
	}

	static viewSum() {
		if (Storage.has()) {
			return Storage.get().map(item => item.price * item.number).reduce((sum, item) => sum + +item, 0);
		}
	}

	// метод для роботи з оформленням товарів: видалення і зміна кілкості
	static changeGoods(e) {
		const id = e.target.parentNode.parentNode.dataset.id;

		const data = Storage.get();

		if (e.target.tagName === 'I') {
			data.splice(id, 1);
			data.length === 0 ? Storage.clear() : Storage.set(data);
		} else if (e.target.className === 'minus') {
			data[id].number > 1 ? data[id].number-- : data.splice(id, 1);
		} else if (e.target.className === 'plus') {
			data[id].number++;
		}

		Storage.set(data);
		Checkout.reload();
		Basket.reload();
		Form.reload();
	}

	// 1 метод, який оновлює дані 
	static reload() {
		// якщо не на сторінці оформлення, щоб не було помилки
		if (Checkout.getOrderGoods() !== null) {
			if (Storage.has()) {
				Checkout.getOrderGoods().innerHTML = Checkout.viewGoods();
				Checkout.getOrderSum().innerHTML = Checkout.viewSum();
				Form.reload();
			} else {
				Checkout.getOrderGoods().innerHTML = '';
				Checkout.getOrderSum().innerHTML = '';
			}
		}
	}

}

// форма замовлення
class Form {

	static reload() {
		if (document.querySelector('#order-form') !== null) {
			// якщо у кошикові щось є -- показати форму
			if (Storage.has()) {
				document.querySelector('#order-form').innerHTML = `
					<form>
						<p><input type="text" placeholder="Ім'я"></p>
						<p><textarea placeholder="Примітка"></textarea></p>
						<input type="submit" value="Замовити!">
					</form>
				`;
			} else {
				document.querySelector('#order-form').innerHTML = '';
			}
		}
	}
}

// клік на кнопці "button"
Items.getItems().forEach(item => item.addEventListener('click', Items.toBasket));

// очистити кошик, якщо кнопка очистки існує =)
Basket.getClear() && Basket.getClear().addEventListener('click', Basket.clearBasket);

// оновлюємо кошик при завантаженні сторінки
Basket.reload();

// видаляємо товари з кошика
Basket.getGoods() && Basket.getGoods().addEventListener('click', Basket.removeGoods)

// сторінка оформлення замволення
Checkout.reload();

// видаляємо/змінюємо кількість
Checkout.getOrderGoods() && Checkout.getOrderGoods().addEventListener('click', e => Checkout.changeGoods(e));