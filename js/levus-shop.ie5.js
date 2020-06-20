// 20-06-2020 
"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BASKET = 'basket';

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
    }

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
    }

  }, {
    key: "removeGoods",
    value: function removeGoods(e) {
      if (e.target.tagName === 'I') {
        var id = e.target.parentNode.dataset.id;
        Storage.remove(id);
        Basket.reload();
        Checkout.reload();
      }
    }

  }, {
    key: "clearBasket",
    value: function clearBasket() {
      Storage.clear();
      Basket.getQuantity().innerHTML = 0;
      Basket.getSum().innerHTML = 0;
      Basket.getGoods().innerHTML = '';
    } 

  }, {
    key: "reload",
    value: function reload() {
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
}();

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
      var content = {
        name: this.dataset.name,
        size: this.dataset.size,
        price: this.dataset.price,
        number: "1",
        img: this.dataset.img
      };

      if (Storage.has()) {
        Storage.add(content);
      } else {
        Storage.set(content);
      }

      Basket.reload();
    }
  }]);

  return Items;
}();

var Storage = /*#__PURE__*/function () {
  function Storage() {
    _classCallCheck(this, Storage);
  }

  _createClass(Storage, null, [{
    key: "has",
    value: function has() {
      if (localStorage.getItem(BASKET) !== null) {
        return true;
      } else {
        return false;
      }
    } 

  }, {
    key: "get",
    value: function get() {
      return JSON.parse(localStorage.getItem(BASKET));
    } 

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
    } 

  }, {
    key: "add",
    value: function add(value) {
      var data = JSON.parse(localStorage.getItem(BASKET));

      if (data.find(function (item) {
        return item.name === value.name;
      })) {
        var checked = data.find(function (item) {
          return item.name === value.name;
        });
        checked.number++;
      } else {
        data.push(value);
      }

      localStorage.setItem(BASKET, JSON.stringify(data));
    } 

  }, {
    key: "clear",
    value: function clear() {
      localStorage.clear(BASKET);
    } 

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
}();

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
    } 

  }, {
    key: "viewGoods",
    value: function viewGoods() {
      if (Storage.has()) {
        var data = Storage.get().reduce(function (sum, item, i) {
          return sum + "<div data-id=\"".concat(i, "\" class=\"product\"><div class=\"product-img\"><img src=\"").concat(item.img, "\" alt=\"\"></div><div class=\"product-name\">").concat(item.name, "</div><div class=\"product-size\">").concat(item.size, "</div><div class=\"product-price\"><small>").concat(item.price, "\u0433\u0440\u043D</small> <p>").concat(item.price * item.number, "\u0433\u0440\u043D</p></div><div class=\"product-quantity\"><span class=\"minus\"></span><span class=\"number\">").concat(item.number, "</span><span class=\"plus\"></span></div><div class=\"product-delete\"><i></i></div></div>");
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
    } 

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
    } 

  }, {
    key: "reload",
    value: function reload() {
      if (Checkout.getOrderGoods() !== null) {
        if (Storage.has()) {
          Checkout.getOrderGoods().innerHTML = Checkout.viewGoods();
          Checkout.getOrderSum().innerHTML = Checkout.viewSum();
        } else {
          Checkout.getOrderGoods().innerHTML = '';
          Checkout.getOrderSum().innerHTML = '';
        }
      }
    }
  }]);

  return Checkout;
}();


Items.getItems().forEach(function (item) {
  return item.addEventListener('click', Items.toBasket);
}); 

Basket.getClear() && Basket.getClear().addEventListener('click', Basket.clearBasket);

Basket.reload();

Basket.getGoods() && Basket.getGoods().addEventListener('click', Basket.removeGoods);

Checkout.reload();

Checkout.getOrderGoods().addEventListener('click', function (e) {
  return Checkout.changeGoods(e);
});