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
    // додали дані
    data.push(value);
    // повертаємо у сховище оновлений масив
    localStorage.setItem(BASKET, JSON.stringify(data));
  }
}

// клік на кнопці "button"
Items.getItems().forEach(item => item.addEventListener('click', Items.toBasket));