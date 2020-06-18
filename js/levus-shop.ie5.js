"use strict";

// basket.js 17-06-2020
(function(){
  // check basket
  if (document.querySelector('#basket')) {
    // add to localStorage
    var addGoods = function addGoods() {
      // temporary array
      var content = {
        name: this.dataset.name,
        size: this.dataset.size,
        price: this.dataset.price,
        number: "1",
        img: this.dataset.img
      }; // check localStorage and add data to localStorage

      if (localStorage.getItem('basket') === null) {
        // create array for data
        var data = []; // push object with 3 items to array

        data.push(content); // add data to localStorage

        localStorage.setItem('basket', JSON.stringify(data)); // reload 

        viewQuantity();
        viewSum();
        viewSelected();
      } else {
        // load data from localStorage
        var _data = JSON.parse(localStorage.getItem('basket')); // new name 

        var name = this.dataset.name;

        if (_data.find(function (item) {
          return item.name == name;
        })) {
          // checked
          var checked = _data.find(function (item) {
            return item.name === name;
          }); // add 1

          checked.number++;
        } else {
          // push object with 5 items to array
          _data.push(content);
        } // add data to localStorage

        localStorage.setItem('basket', JSON.stringify(_data)); // reload 

        viewQuantity();
        viewSum();
        viewSelected();
      }
    }; // return quantity goods

    var viewQuantity = function viewQuantity() {
      if (localStorage.getItem('basket') === null) {
        quantity.innerHTML = 0;
      } else {
        quantity.innerHTML = JSON.parse(localStorage.getItem('basket')).reduce(function (sum, item) {
          return sum += +item.number;
        }, 0);
      }
    }; // return sum

    var viewSum = function viewSum() {
      if (localStorage.getItem('basket') === null) {
        sum.innerHTML = 0;
      } else {
        sum.innerHTML = JSON.parse(localStorage.getItem('basket')).map(function (item) {
          return item.price * item.number;
        }).reduce(function (sum, item) {
          return sum + +item;
        }, 0) + 'грн';
      }
    }; // clear localStorage

    var clearStorage = function clearStorage() {
      localStorage.clear('basket'); // reload

      viewSum();
      viewQuantity();
      viewSelected();
    }; // view selected goods

    var viewSelected = function viewSelected() {
      if (localStorage.getItem('basket') === null) {
        selected.innerHTML = '';
      } else {
        selected.innerHTML = JSON.parse(localStorage.getItem('basket')).reduce(function (sum, item, i) {
          return sum + "<p data-id=\"".concat(i, "\"><i></i>").concat(item.name, " [").concat(item.number, "]: ").concat(item.size, " - ").concat(item.price, "\u0433\u0440\u043D</p>");
        }, '');
      }
    }; // delete goods from basket

    var removeGoods = function removeGoods(e) {
      if (e.target.tagName === 'I') {
        // id goods
        var id = e.target.parentNode.dataset.id; // goods from storage

        var data = JSON.parse(localStorage.getItem('basket')); // remove item

        data.splice(id, 1); // claer storage or return data to localStorage

        if (data.length === 0) {
          localStorage.removeItem('basket');
        } else {
          localStorage.setItem('basket', JSON.stringify(data));
        } // reload

        viewSum();
        viewQuantity();
        viewSelected();
      }
    };

    // wiev quantity goods
    var quantity = document.querySelector('#basket-quantity'); // view sum

    var sum = document.querySelector('#basket-sum'); // view selected goods

    var selected = document.querySelector('#basket-goods'); // all buttons click

    document.querySelectorAll('button').forEach(function (button) {
      return button.addEventListener('click', addGoods);
    }); // clear localStorage

    document.querySelector('#basket-clear').addEventListener('click', clearStorage); // delete goods one by one

    selected.addEventListener('click', function (e) {
      return removeGoods(e);
    }); // view sum

    viewSum(); // view quantity

    viewQuantity(); // view selected goods

    viewSelected();
  } // check #order-goods

  if (document.querySelector('#order-goods')) {
    // view all ordered goods 
    var viewGoods = function viewGoods() {
      if (localStorage.getItem('basket') === null) {
        order.innerHTML = '';
      } else {
        order.innerHTML = JSON.parse(localStorage.getItem('basket')).reduce(function (sum, item, i) {
          return sum + "<p data-id=\"".concat(i, "\"><img src=\"").concat(item.img, "\" alt=\"\"><i></i><b>").concat(item.name, "</b><span>").concat(item.size, " </span><span><b>").concat(item.price, "</b>\u0433\u0440\u043D </span><span class=\"minus\"></span><span class=\"number\">").concat(item.number, "</span><span class=\"plus\"></span></p>");
        }, '');
      }
    }; // change quantity goods

    var changeGoods = function changeGoods(e) {
      // id goods
      var id = e.target.parentNode.dataset.id; // goods from storage

      var data = JSON.parse(localStorage.getItem('basket')); // to delete

      if (e.target.tagName === 'I') {
        // remove item
        data.splice(id, 1); // claer storage or return data to localStorage

        if (data.length === 0) {
          localStorage.removeItem('basket');
        } else {
          localStorage.setItem('basket', JSON.stringify(data));
        }
      } else if (e.target.className === 'minus') {
        if (data[id].number > 1) {
          data[id].number--;
        } else {
          // remove item
          data.splice(id, 1);
        }
      } else if (e.target.className === 'plus') {
        data[id].number++;
      } // return data to localStorage

      localStorage.setItem('basket', JSON.stringify(data)); // reload

      viewGoods();

      _viewSum();
    }; // return sum

    var _viewSum = function _viewSum() {
      if (localStorage.getItem('basket') === null) {
        _sum.innerHTML = 0;
      } else {
        _sum.innerHTML = JSON.parse(localStorage.getItem('basket')).map(function (item) {
          return item.price * item.number;
        }).reduce(function (sum, item) {
          return sum + +item;
        }, 0) + 'грн';
      }
    };

    // table
    var order = document.querySelector('#order-goods');

    var _sum = document.querySelector('#order-sum'); // delete goods one by one

    order.addEventListener('click', function (e) {
      return changeGoods(e);
    });
    viewGoods();

    _viewSum();
  }
})();