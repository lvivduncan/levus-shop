// basket.js 17-06-2020
{
	// check basket
	if (document.querySelector('#basket')) {

		// wiev quantity goods
		const quantity = document.querySelector('#basket-quantity');

		// view sum
		const sum = document.querySelector('#basket-sum');

		// view selected goods
		const selected = document.querySelector('#basket-goods');

		// all buttons click
		document.querySelectorAll('button').forEach(button => button.addEventListener('click', addGoods));

		// clear localStorage
		document.querySelector('#basket-clear').addEventListener('click', clearStorage);

		// delete goods one by one
		selected.addEventListener('click', e => removeGoods(e));

		// view sum
		viewSum();

		// view quantity
		viewQuantity();

		// view selected goods
		viewSelected();

		// add to localStorage
		function addGoods() {

			// temporary array
			const content = { name: this.dataset.name, size: this.dataset.size, price: this.dataset.price, number: "1", img: this.dataset.img };

			// check localStorage and add data to localStorage
			if (localStorage.getItem('basket') === null) {

				// create array for data
				const data = [];

				// push object with 3 items to array
				data.push(content);

				// add data to localStorage
				localStorage.setItem('basket', JSON.stringify(data));

				// reload 
				viewQuantity();
				viewSum();
				viewSelected();
			} else {

				// load data from localStorage
				const data = JSON.parse(localStorage.getItem('basket'));

				// new name 
				const name = this.dataset.name;

				if (data.find(item => item.name == name)) {
					// checked
					const checked = data.find(item => item.name === name);

					// add 1
					checked.number++;
				} else {

					// push object with 5 items to array
					data.push(content);
				}

				// add data to localStorage
				localStorage.setItem('basket', JSON.stringify(data));

				// reload 
				viewQuantity();
				viewSum();
				viewSelected();
			}
		}

		// return quantity goods
		function viewQuantity() {
			if (localStorage.getItem('basket') === null) {
				quantity.innerHTML = 0;
			} else {
				quantity.innerHTML = JSON.parse(localStorage.getItem('basket')).reduce((sum, item) => sum += +item.number, 0);
			}
		}

		// return sum
		function viewSum() {
			if (localStorage.getItem('basket') === null) {
				sum.innerHTML = 0;
			} else {
				sum.innerHTML = JSON.parse(localStorage.getItem('basket')).map(item => item.price * item.number).reduce((sum, item) => sum + +item, 0) + 'грн';
			}
		}

		// clear localStorage
		function clearStorage() {
			localStorage.clear('basket');

			// reload
			viewSum();
			viewQuantity();
			viewSelected();
		}

		// view selected goods
		function viewSelected() {
			if (localStorage.getItem('basket') === null) {
				selected.innerHTML = '';
			} else {
				selected.innerHTML =
					JSON.parse(localStorage.getItem('basket'))
						.reduce((sum, item, i) => sum + `
							<p data-id="${i}">
								<i></i> 
								${item.name} 
								[${item.number}]: 
								${item.size} - 
								${item.price}грн
							</p>`, '');
			}
		}

		// delete goods from basket
		function removeGoods(e) {
			if (e.target.tagName === 'I') {

				// id goods
				const id = e.target.parentNode.dataset.id;

				// goods from storage
				const data = JSON.parse(localStorage.getItem('basket'));

				// remove item
				data.splice(id, 1);

				// claer storage or return data to localStorage
				if (data.length === 0) {
					localStorage.removeItem('basket');
				} else {
					localStorage.setItem('basket', JSON.stringify(data));
				}

				// reload
				viewSum();
				viewQuantity();
				viewSelected();
			}
		}
	}

	// check #order-goods
	if (document.querySelector('#order-goods')) {

		// table
		const order = document.querySelector('#order-goods');

		const sum = document.querySelector('#order-sum');

		// delete goods one by one
		order.addEventListener('click', e => change(e));

		view();

		// view all ordered goods 
		function view() {
			if (localStorage.getItem('basket') === null) {
				order.innerHTML = '';
			} else {
				order.innerHTML =
					JSON.parse(localStorage.getItem('basket'))
						.reduce((sum, item, i) => sum + `
							<p data-id="${i}">
								<img src="${item.img}" alt="">
								<i></i>
								<b>${item.name}</b>
								<span>${item.size} </span>
								<span><b>${item.price}</b>грн </span>
								<span class="minus"></span>
								<span class="number">${item.number}</span>
								<span class="plus"></span>
							</p>`, '');
			}
		}

		// change quantity goods
		function change(e) {

			// id goods
			const id = e.target.parentNode.dataset.id;

			// goods from storage
			const data = JSON.parse(localStorage.getItem('basket'));

			// to delete
			if (e.target.tagName === 'I') {

				// remove item
				data.splice(id, 1);

				// claer storage or return data to localStorage
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
			}

			// return data to localStorage
			localStorage.setItem('basket', JSON.stringify(data));

			// reload
			view();
			viewSum();
		}

		// return sum
		function viewSum() {
			if (localStorage.getItem('basket') === null) {
				sum.innerHTML = 0;
			} else {
				sum.innerHTML = JSON.parse(localStorage.getItem('basket')).map(item => item.price * item.number).reduce((sum, item) => sum + +item, 0) + 'грн';
			}
		}

	}
}