// 19-06-2020 

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
	static removeGoods(e){
		if (e.target.tagName === 'I'){
			const id = e.target.parentNode.dataset.id;
			
			Storage.remove(id);
			Basket.reload();
		}
	}

	// очистка кошика
	static clearBasket() {
		Storage.clear();
		Basket.getQuantity().innerHTML = 0;
		Basket.getSum().innerHTML = 0;
		Basket.getGoods().innerHTML = '';
	}

	// 1 метод, який оновлює дані у кошикові
	static reload() {
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
		// масив для сховища
		const data = [];
		// додали дані
		data.push(value);
		// надсилаємо у сховище
		localStorage.setItem(BASKET, JSON.stringify(data));
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
	static remove(id){
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
class Checkout{

}

// клік на кнопці "button"
Items.getItems().forEach(item => item.addEventListener('click', Items.toBasket));

// очистити кошик
Basket.getClear().addEventListener('click', Basket.clearBasket);

// оновлюємо кошик при завантаженні сторінки
Basket.reload();

// видаляємо товари з кошика
Basket.getGoods().addEventListener('click', Basket.removeGoods)