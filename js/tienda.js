document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.querySelector('.cart-button');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartPrice = document.querySelector('.cart-price');
    let cart = [];
  
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.innerHTML = `
      <div class="cart-modal-content">
        <div class="cart-modal-header">
          <h2>Carrito de Compras</h2>
          <button class="close-modal">&times;</button>
        </div>
        <div class="cart-modal-body">
          <div class="cart-items-list"></div>
        </div>
        <div class="cart-total">Total: $<span class="cart-total-price">0</span></div>
        <div class="cart-modal-footer">
          <button class="empty-cart">Vaciar Carrito</button>
          <button class="checkout-btn">Pagar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  
    const closeModal = modal.querySelector('.close-modal');
    const cartItemsList = modal.querySelector('.cart-items-list');
    const cartTotalPrice = modal.querySelector('.cart-total-price');
    const emptyCartButton = modal.querySelector('.empty-cart');
    const checkoutButton = modal.querySelector('.checkout-btn');
  
    // Function to format price in Colombian Peso format
    function formatPrice(price) {
      return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    }
  
    // Function to parse price from string (handles Colombian format)
    function parsePrice(priceString) {
      // Remove currency symbol and thousands separators, then parse
      return parseFloat(priceString.replace('$', '').replace(/\./g, '').replace(',', '.'));
    }
  
    function updateCart() {
      let total = 0;
      cartItemsList.innerHTML = '';
      
      cart.forEach(item => {
        total += item.price * item.quantity;
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
            $${formatPrice(item.price * item.quantity)}
            <button class="remove-item">&times;</button>
          </div>
        `;
        cartItemsList.appendChild(itemElement);
  
        // Add event listeners for quantity buttons and remove button
        itemElement.querySelector('.minus').addEventListener('click', () => updateQuantity(item, -1));
        itemElement.querySelector('.plus').addEventListener('click', () => updateQuantity(item, 1));
        itemElement.querySelector('.remove-item').addEventListener('click', () => removeItem(item));
      });
  
      cartTotalPrice.textContent = formatPrice(total);
      cartPrice.textContent = `$${formatPrice(total)}`;
    }
  
    function updateQuantity(item, change) {
      const index = cart.findIndex(i => i.name === item.name);
      if (index !== -1) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
        updateCart();
        saveCartToLocalStorage();
      }
    }
  
    function removeItem(item) {
      const index = cart.findIndex(i => i.name === item.name);
      if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
        saveCartToLocalStorage();
        showNotification(`${item.name} eliminado del carrito`);
      }
    }
  
    function showNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
      }, 3000);
    }
  
    // Local Storage functions
    function saveCartToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  
    function loadCartFromLocalStorage() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
      }
    }
  
    cartButton.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
  
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  
    addToCartButtons.forEach(button => {
      if (!button.disabled) {
        button.addEventListener('click', () => {
          const card = button.closest('.product-card');
          const name = card.querySelector('h3').textContent;
          const priceText = card.querySelector('.price').textContent;
          const price = parsePrice(priceText);
          
          const existingItem = cart.find(item => item.name === name);
          if (existingItem) {
            existingItem.quantity++;
          } else {
            cart.push({ name, price, quantity: 1 });
          }
          
          updateCart();
          saveCartToLocalStorage();
          showNotification(`${name} agregado al carrito`);
        });
      }
    });
  
    emptyCartButton.addEventListener('click', () => {
      cart = [];
      updateCart();
      saveCartToLocalStorage();
      showNotification('Carrito vaciado');
    });
  
    checkoutButton.addEventListener('click', () => {
      if (cart.length > 0) {
        showNotification('¡Gracias por su compra!');
        cart = [];
        updateCart();
        saveCartToLocalStorage();
        modal.style.display = 'none';
      } else {
        showNotification('El carrito está vacío');
      }
    });
  
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  
    // Load cart from localStorage on page load
    loadCartFromLocalStorage();
  });