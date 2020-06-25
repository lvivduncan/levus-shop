// 25-06-2020
"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// 20-06-2020 
// назва сховища
var BASKET = 'basket'; // клас, що відповідає за кошик на сторінці -- загальна ціна, кількість товарів, товари тощо

var Basket = /*#__PURE__*/function () {
  function Basket() {
    _classCallCheck(this, Basket);
  }

  _createClass(Basket, null, [{
    key: "getQuantity",
    value: function getQuantity() {
      return document.querySelector('#basket-quantity');
    }
  }, {
    key: "getSum",
    value: function getSum() {
      return document.querySelector('#basket-sum');
    }
  }, {
    key: "getGoods",
    value: function getGoods() {
      return document.querySelector('#basket-goods');
    }
  }, {
    key: "getClear",
    value: function getClear() {
      return document.querySelector('#basket-clear');
    } // опрацьовуємо дані

  }, {
    key: "viewQuantity",
    value: function viewQuantity() {
      return Storage.get().reduce(function (sum, item) {
        return sum += +item.number;
      }, 0);
    }
  }, {
    key: "viewSum",
    value: function viewSum() {
      return Storage.get().reduce(function (sum, item) {
        return sum += item.price * item.number;
      }, 0);
    }
  }, {
    key: "viewGoods",
    value: function viewGoods() {
      return Storage.get().reduce(function (sum, item, i) {
        return sum += "<p data-id=\"".concat(i, "\"><i></i><b>").concat(item.name, "</b>, ").concat(item.size, ": ").concat(item.price, ", ").concat(item.number, "</p>");
      }, '');
    } // видаляємо товари

  }, {
    key: "removeGoods",
    value: function removeGoods(e) {
      if (e.target.tagName === 'I') {
        var id = e.target.parentNode.dataset.id;
        Storage.remove(id);
        Basket.reload();
        Checkout.reload();
        Form.reload();
      }
    } // очистка кошика

  }, {
    key: "clearBasket",
    value: function clearBasket() {
      Storage.clear();
      Checkout.reload();
      Form.reload();
      Basket.getQuantity().innerHTML = 0;
      Basket.getSum().innerHTML = 0;
      Basket.getGoods().innerHTML = '';
    } // 1 метод, який оновлює дані у кошикові

  }, {
    key: "reload",
    value: function reload() {
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
  }]);

  return Basket;
}(); // клас, який опрацьовує товари на сторінці


var Items = /*#__PURE__*/function () {
  function Items() {
    _classCallCheck(this, Items);
  }

  _createClass(Items, null, [{
    key: "getItems",
    value: function getItems() {
      return document.querySelectorAll('.button');
    }
  }, {
    key: "toBasket",
    value: function toBasket() {
      // дані з дата-атрибутів
      var content = {
        name: this.dataset.name,
        size: this.dataset.size,
        price: this.dataset.price,
        number: "1",
        img: this.dataset.img
      }; // якщо дані вже у сховищі є, тоді додаємо до них. або ж надсилаємо перші

      if (Storage.has()) {
        Storage.add(content);
      } else {
        Storage.set(content);
      }

      Basket.reload();
    }
  }]);

  return Items;
}(); // localStorage


var Storage = /*#__PURE__*/function () {
  function Storage() {
    _classCallCheck(this, Storage);
  }

  _createClass(Storage, null, [{
    key: "has",
    // перевірка чи існує сховище
    value: function has() {
      if (localStorage.getItem(BASKET) !== null) {
        return true;
      } else {
        return false;
      }
    } // отримуємо дані

  }, {
    key: "get",
    value: function get() {
      return JSON.parse(localStorage.getItem(BASKET));
    } // надсилаємо дані

  }, {
    key: "set",
    value: function set(value) {
      if (Array.isArray(value)) {
        localStorage.setItem(BASKET, JSON.stringify(value));
      } else {
        var data = [];
        data.push(value);
        localStorage.setItem(BASKET, JSON.stringify(data));
      }
    } // додаємо дані

  }, {
    key: "add",
    value: function add(value) {
      // масив зі сховища
      var data = JSON.parse(localStorage.getItem(BASKET)); // якщо такий товар уже є, то збільшуємо кількість на 1. або ж просто додаємо новий товар

      if (data.find(function (item) {
        return item.name === value.name;
      })) {
        var checked = data.find(function (item) {
          return item.name === value.name;
        });
        checked.number++;
      } else {
        // додали дані
        data.push(value);
      } // повертаємо у сховище оновлений масив


      localStorage.setItem(BASKET, JSON.stringify(data));
    } // очистка сховища

  }, {
    key: "clear",
    value: function clear() {
      localStorage.clear(BASKET);
    } // видаляємо товар

  }, {
    key: "remove",
    value: function remove(id) {
      var data = JSON.parse(localStorage.getItem(BASKET));
      data.splice(id, 1);

      if (data.length === 0) {
        localStorage.removeItem(BASKET);
      } else {
        localStorage.setItem(BASKET, JSON.stringify(data));
      }
    }
  }]);

  return Storage;
}(); // оформлення замовлення


var Checkout = /*#__PURE__*/function () {
  function Checkout() {
    _classCallCheck(this, Checkout);
  }

  _createClass(Checkout, null, [{
    key: "getOrderGoods",
    value: function getOrderGoods() {
      return document.querySelector('#order-goods');
    }
  }, {
    key: "getOrderSum",
    value: function getOrderSum() {
      return document.querySelector('#order-sum');
    } // виводимо дані

  }, {
    key: "viewGoods",
    value: function viewGoods() {
      if (Storage.has()) {
        var data = Storage.get().reduce(function (sum, item, i) {
          return sum + "\n\t\t\t\t\t<div data-id=\"".concat(i, "\" class=\"product\">\n\t\t\t\t\t\t<div class=\"product-img\">\n\t\t\t\t\t\t\t<img src=\"").concat(item.img, "\" alt=\"\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"product-name\">").concat(item.name, "</div>\n\t\t\t\t\t\t<div class=\"product-size\">").concat(item.size, "</div>\n\t\t\t\t\t\t<div class=\"product-price\">\n\t\t\t\t\t\t\t<small>").concat(item.price, "\u0433\u0440\u043D</small> \n\t\t\t\t\t\t\t<p>").concat(item.price * item.number, "\u0433\u0440\u043D</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"product-quantity\">\n\t\t\t\t\t\t\t<span class=\"minus\"></span>\n\t\t\t\t\t\t\t<span class=\"number\">").concat(item.number, "</span>\n\t\t\t\t\t\t\t<span class=\"plus\"></span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"product-delete\">\n\t\t\t\t\t\t\t<i></i>\n\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t</div>");
        }, ''); // todo: delete 'грн'

        return data;
      }
    }
  }, {
    key: "viewSum",
    value: function viewSum() {
      if (Storage.has()) {
        return Storage.get().map(function (item) {
          return item.price * item.number;
        }).reduce(function (sum, item) {
          return sum + +item;
        }, 0);
      }
    } // метод для роботи з оформленням товарів: видалення і зміна кілкості

  }, {
    key: "changeGoods",
    value: function changeGoods(e) {
      var id = e.target.parentNode.parentNode.dataset.id;
      var data = Storage.get();

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
    } // 1 метод, який оновлює дані 

  }, {
    key: "reload",
    value: function reload() {
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
  }]);

  return Checkout;
}(); // форма замовлення


var Form = /*#__PURE__*/function () {
  function Form() {
    _classCallCheck(this, Form);
  }

  _createClass(Form, null, [{
    key: "reload",
    value: function reload() {
      if (document.querySelector('#order-form') !== null) {
        // якщо у кошикові щось є -- показати форму
        if (Storage.has()) {
          document.querySelector('#order-form').innerHTML = "\n\t\t\t\t\t<form>\n\t\t\t\t\t\t<p><input type=\"text\" placeholder=\"\u0406\u043C'\u044F\"></p>\n\t\t\t\t\t\t<p><textarea placeholder=\"\u041F\u0440\u0438\u043C\u0456\u0442\u043A\u0430\"></textarea></p>\n\t\t\t\t\t\t<input type=\"submit\" value=\"\u0417\u0430\u043C\u043E\u0432\u0438\u0442\u0438!\">\n\t\t\t\t\t</form>\n\t\t\t\t";
        } else {
          document.querySelector('#order-form').innerHTML = '';
        }
      }
    }
  }]);

  return Form;
}(); // клік на кнопці "button"


Items.getItems().forEach(function (item) {
  return item.addEventListener('click', Items.toBasket);
}); // очистити кошик, якщо кнопка очистки існує =)

Basket.getClear() && Basket.getClear().addEventListener('click', Basket.clearBasket); // оновлюємо кошик при завантаженні сторінки

Basket.reload(); // видаляємо товари з кошика

Basket.getGoods() && Basket.getGoods().addEventListener('click', Basket.removeGoods); // сторінка оформлення замволення

Checkout.reload(); // видаляємо/змінюємо кількість

Checkout.getOrderGoods() && Checkout.getOrderGoods().addEventListener('click', function (e) {
  return Checkout.changeGoods(e);
});