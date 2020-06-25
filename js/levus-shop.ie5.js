// 25-06-2020
"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BASKET = "basket";

var Basket = /*#__PURE__*/function () {
  function Basket() {
    _classCallCheck(this, Basket);
  }

  _createClass(Basket, null, [{
    key: "getQuantity",
    value: function getQuantity() {
      return document.querySelector("#basket-quantity");
    }
  }, {
    key: "getSum",
    value: function getSum() {
      return document.querySelector("#basket-sum");
    }
  }, {
    key: "getGoods",
    value: function getGoods() {
      return document.querySelector("#basket-goods");
    }
  }, {
    key: "getClear",
    value: function getClear() {
      return document.querySelector("#basket-clear");
    }
  }, {
    key: "viewQuantity",
    value: function viewQuantity() {
      return Storage.get().reduce(function (e, t) {
        return e += +t.number;
      }, 0);
    }
  }, {
    key: "viewSum",
    value: function viewSum() {
      return Storage.get().reduce(function (e, t) {
        return e += t.price * t.number;
      }, 0);
    }
  }, {
    key: "viewGoods",
    value: function viewGoods() {
      return Storage.get().reduce(function (e, t, a) {
        return e += "<p data-id=\"".concat(a, "\"><i></i><b>").concat(t.name, "</b>, ").concat(t.size, ": ").concat(t.price, ", ").concat(t.number, "</p>");
      }, "");
    }
  }, {
    key: "removeGoods",
    value: function removeGoods(e) {
      if ("I" === e.target.tagName) {
        var t = e.target.parentNode.dataset.id;
        Storage.remove(t), Basket.reload(), Checkout.reload(), Form.reload();
      }
    }
  }, {
    key: "clearBasket",
    value: function clearBasket() {
      Storage.clear(), Checkout.reload(), Form.reload(), Basket.getQuantity().innerHTML = 0, Basket.getSum().innerHTML = 0, Basket.getGoods().innerHTML = "";
    }
  }, {
    key: "reload",
    value: function reload() {
      Basket.getQuantity() && (Storage.has() ? (Basket.getQuantity().innerHTML = Basket.viewQuantity(), Basket.getSum().innerHTML = Basket.viewSum(), Basket.getGoods().innerHTML = Basket.viewGoods()) : (Basket.getQuantity().innerHTML = 0, Basket.getSum().innerHTML = 0, Basket.getGoods().innerHTML = ""));
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
      return document.querySelectorAll(".button");
    }
  }, {
    key: "toBasket",
    value: function toBasket() {
      var e = {
        name: this.dataset.name,
        size: this.dataset.size,
        price: this.dataset.price,
        number: "1",
        img: this.dataset.img
      };
      Storage.has() ? Storage.add(e) : Storage.set(e), Basket.reload();
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
      return null !== localStorage.getItem(BASKET);
    }
  }, {
    key: "get",
    value: function get() {
      return JSON.parse(localStorage.getItem(BASKET));
    }
  }, {
    key: "set",
    value: function set(e) {
      if (Array.isArray(e)) localStorage.setItem(BASKET, JSON.stringify(e));else {
        var t = [];
        t.push(e), localStorage.setItem(BASKET, JSON.stringify(t));
      }
    }
  }, {
    key: "add",
    value: function add(e) {
      var t = JSON.parse(localStorage.getItem(BASKET));

      if (t.find(function (t) {
        return t.name === e.name;
      })) {
        t.find(function (t) {
          return t.name === e.name;
        }).number++;
      } else t.push(e);

      localStorage.setItem(BASKET, JSON.stringify(t));
    }
  }, {
    key: "clear",
    value: function clear() {
      localStorage.clear(BASKET);
    }
  }, {
    key: "remove",
    value: function remove(e) {
      var t = JSON.parse(localStorage.getItem(BASKET));
      t.splice(e, 1), 0 === t.length ? localStorage.removeItem(BASKET) : localStorage.setItem(BASKET, JSON.stringify(t));
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
      return document.querySelector("#order-goods");
    }
  }, {
    key: "getOrderSum",
    value: function getOrderSum() {
      return document.querySelector("#order-sum");
    }
  }, {
    key: "viewGoods",
    value: function viewGoods() {
      if (Storage.has()) {
        return Storage.get().reduce(function (e, t, a) {
          return e + "<div data-id=\"".concat(a, "\" class=\"product\"><div class=\"product-img\"><img src=\"").concat(t.img, "\" alt=\"\"></div><div class=\"product-name\">").concat(t.name, "</div><div class=\"product-size\">").concat(t.size, "</div><div class=\"product-price\"><small>").concat(t.price, "\u0433\u0440\u043D</small><p>").concat(t.price * t.number, "\u0433\u0440\u043D</p></div><div class=\"product-quantity\"><span class=\"minus\"></span><span class=\"number\">").concat(t.number, "</span><span class=\"plus\"></span></div><div class=\"product-delete\"><i></i></div></div>");
        }, "");
      }
    }
  }, {
    key: "viewSum",
    value: function viewSum() {
      if (Storage.has()) return Storage.get().map(function (e) {
        return e.price * e.number;
      }).reduce(function (e, t) {
        return e + +t;
      }, 0);
    }
  }, {
    key: "changeGoods",
    value: function changeGoods(e) {
      var t = e.target.parentNode.parentNode.dataset.id,
          a = Storage.get();
      "I" === e.target.tagName ? (a.splice(t, 1), 0 === a.length ? Storage.clear() : Storage.set(a)) : "minus" === e.target.className ? a[t].number > 1 ? a[t].number-- : a.splice(t, 1) : "plus" === e.target.className && a[t].number++, Storage.set(a), Checkout.reload(), Basket.reload(), Form.reload();
    }
  }, {
    key: "reload",
    value: function reload() {
      null !== Checkout.getOrderGoods() && (Storage.has() ? (Checkout.getOrderGoods().innerHTML = Checkout.viewGoods(), Checkout.getOrderSum().innerHTML = Checkout.viewSum(), Form.reload()) : (Checkout.getOrderGoods().innerHTML = "", Checkout.getOrderSum().innerHTML = ""));
    }
  }]);

  return Checkout;
}();

var Form = /*#__PURE__*/function () {
  function Form() {
    _classCallCheck(this, Form);
  }

  _createClass(Form, null, [{
    key: "reload",
    value: function reload() {
      null !== document.querySelector("#order-form") && (Storage.has() ? document.querySelector("#order-form").innerHTML = '<form><p><input type="text" placeholder="Ім\'я"></p><p><textarea placeholder="Примітка"></textarea></p><input type="submit" value="Замовити!"></form>' : document.querySelector("#order-form").innerHTML = "");
    }
  }]);

  return Form;
}();

Items.getItems().forEach(function (e) {
  return e.addEventListener("click", Items.toBasket);
}), Basket.getClear() && Basket.getClear().addEventListener("click", Basket.clearBasket), Basket.reload(), Basket.getGoods() && Basket.getGoods().addEventListener("click", Basket.removeGoods), Checkout.reload(), Checkout.getOrderGoods() && Checkout.getOrderGoods().addEventListener("click", function (e) {
  return Checkout.changeGoods(e);
});