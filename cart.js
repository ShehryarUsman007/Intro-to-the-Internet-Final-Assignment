// Initialize when content is loaded
document.addEventListener('DOMContentLoaded', function() {
    var cartItems = JSON.parse(localStorage.getItem('cart')) || [];
	//Render cart items to web page
    function renderCart() {
        const cartTable = document.getElementById('cartitems');
        const cartTotal = document.getElementById('carttotal');
        cartTable.innerHTML = '';
        var total = 0;
		// Handle empty cart
        if (cartItems.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="7">Your cart is empty.</td>`;
            cartTable.appendChild(row);
            cartTotal.textContent = '$0.00';
            return;
        }
		// Loop through cart items and create rows in our table
        cartItems.forEach(function(item, index) {
            const row = document.createElement('tr');
            const itemTotal = (item.price * item.quantity).toFixed(2);
            const genderText = item.gender === 'M' ? "Men's" : "Women's";
            
            row.innerHTML = `
                <td>${item.name} (${item.design})</td>
                <td>${item.size}</td>
                <td>${genderText}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <button class="qtybtn" data-index="${index}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="qtybtn" data-index="${index}" data-action="increase">+</button>
                </td>
                <td>$${itemTotal}</td>
                <td><button class="removebtn" data-index="${index}">Remove</button></td>
            `;
            cartTable.appendChild(row);
            total += item.price * item.quantity;
        });
		// Update total price of items
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
	// Quantity button handling
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('qtybtn')) {
            var index = parseInt(e.target.dataset.index);
            var action = e.target.dataset.action;
            
            if (action === 'increase') {
                cartItems[index].quantity++;
            } else if (action === 'decrease') {
                if (cartItems[index].quantity > 1) {
                    cartItems[index].quantity--;
                } else {
                    cartItems.splice(index, 1);
                }
            }
            //update and re-render cart
            localStorage.setItem('cart', JSON.stringify(cartItems));
            renderCart();
        }
    });
	// Using the remove button
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('removebtn')) {
            var index = parseInt(e.target.dataset.index);
            cartItems.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cartItems));
            renderCart();
        }
    });
	// Handling form submission
    var deliveryForm = document.getElementById('deliveryform');
    var orderConfirm = document.getElementById('orderconfirm');
    var deliveryAddress = document.querySelector('.deliveryaddress');

    deliveryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var address = document.getElementById('address').value;
        deliveryAddress.textContent = address;
        
        deliveryForm.classList.add('hidden');
        orderConfirm.classList.remove('hidden');
        
        localStorage.removeItem('cart');
        cartItems = [];
    });
	// Initial cart render
    renderCart();
});