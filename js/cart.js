document.addEventListener('DOMContentLoaded', function() {
    let cart = [];
    const cartPrice = document.querySelector('.cart-price');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartButton = document.querySelector('.cart-button');
    const modal = document.getElementById('cart-modal');
    const closeModal = document.querySelector('.close-modal');
    const emptyCartBtn = document.querySelector('.empty-cart');
    const cartItemsList = document.querySelector('.cart-items-list');
    const modalTotalPrice = document.querySelector('.modal-total-price');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    function addToCart(event) {
        const productCard = event.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = parseFloat(productCard.querySelector('.current-price').textContent.replace('$', '').replace('.', ''));

        const existingItem = cart.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }

        updateCartTotal();
        showNotification(`${productName} añadido al carrito`);
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartPrice.textContent = `$${total.toLocaleString('es-CO')}`;
        modalTotalPrice.textContent = `$${total.toLocaleString('es-CO')}`;
    }

    function updateCartModal() {
        cartItemsList.innerHTML = '';

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <div class="item-quantity">
                        <button class="quantity-btn minus">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                </div>
                <div class="item-price">
                    <span>$${(item.price * item.quantity).toLocaleString('es-CO')}</span>
                    <button class="remove-item">×</button>
                </div>
            `;
            cartItemsList.appendChild(itemElement);

            const plusBtn = itemElement.querySelector('.plus');
            const minusBtn = itemElement.querySelector('.minus');
            const removeBtn = itemElement.querySelector('.remove-item');

            plusBtn.addEventListener('click', () => updateItemQuantity(item, 1));
            minusBtn.addEventListener('click', () => updateItemQuantity(item, -1));
            removeBtn.addEventListener('click', () => removeItem(item));
        });
    }

    function updateItemQuantity(item, change) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(item);
        } else {
            updateCartTotal();
            updateCartModal();
        }
    }

    function removeItem(item) {
        cart = cart.filter(i => i !== item);
        updateCartTotal();
        updateCartModal();
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    cartButton.addEventListener('click', function() {
        updateCartModal();
        modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    emptyCartBtn.addEventListener('click', function() {
        cart = [];
        updateCartTotal();
        updateCartModal();
        showNotification('Carrito vaciado');
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});