document.addEventListener('DOMContentLoaded', () => {
    // --- Responsive Navigation Menu (Hamburger) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });

        document.addEventListener('click', (event) => {
            if (!navList.contains(event.target) && !menuToggle.contains(event.target) && navList.classList.contains('active')) {
                navList.classList.remove('active');
                menuToggle.classList.remove('open');
            }
        });

        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (link.id !== 'cart-icon' && navList.classList.contains('active')) { // Close menu unless it's cart icon (which might open a modal)
                    navList.classList.remove('active');
                    menuToggle.classList.remove('open');
                }
            });
        });
    }

    // --- Shopping Cart Functionality (using localStorage) ---
    const cartCount = document.getElementById('cart-count');
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    function updateCartCount() {
        if (cartCount) {
            cartCount.textContent = cart.length; // Shows number of unique items
            // If you want to show total quantity:
            // cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
    }

    function addProductToCart(product) {
        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += 1;
            alert(`"${product.name}" quantity updated to ${existingProduct.quantity} in your cart.`);
        } else {
            product.quantity = 1;
            cart.push(product);
            alert(`"${product.name}" has been added to your cart.`);
        }
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems(); // Re-render cart on add (if on cart page)
    }

    function handleAddToCartClick(event) {
        const productId = event.target.dataset.productId;
        const productName = event.target.dataset.productName;
        const productPrice = parseFloat(event.target.dataset.productPrice);
        const productImage = event.target.dataset.productImage; 

        const productToAdd = {
            id: productId,
            name: productName,
            price: productPrice,
            imageUrl: productImage || ''
        };
        addProductToCart(productToAdd);
    }

    updateCartCount(); // Initialize cart count on page load

    // --- Central Product Definition ---
    const allProducts = [
        { id: 'prod001', name: 'Eyeshadow Palette', price: 160, imageUrl: 'images/eyeshadow-palette.png', category: 'makeup' },
        { id: 'prod002', name: 'Essential Brush Set', price: 89.99, imageUrl: 'images/brushes-set.png', category: 'makeup' },
        { id: 'prod003', name: 'Lipgloss', price: 20, imageUrl: 'images/lipgloss.png', category: 'makeup' },
        { id: 'prod004', name: 'Dry Brush Cleaner', price: 29.99, imageUrl: 'images/dry-brush-cleaner.png', category: 'makeup' },
        { id: 'prod005', name: 'Hummingbird Earings', price: 80, imageUrl: 'images/earing2.png', category: 'accessories' },
        { id: 'prod006', name: 'Lipstick Mate', price: 45, imageUrl: 'images/lipstick-mate.png', category: 'makeup' },
        { id: 'prod007', name: 'Strawberry Earing', price: 25, imageUrl: 'images/earing.png', category: 'accesories' },
        { id: 'prod008', name: 'Backpack Hearts', price: 280, imageUrl: 'images/bag1.png', category: 'bags' },
        { id: 'prod009', name: 'Black Bag', price: 189, imageUrl: 'images/bag2.png', category: 'bags' },
        { id: 'prod010', name: 'Babyblue Backpack', price: 350, imageUrl: 'images/bag3.png', category: 'bags' },
        { id: 'prod011', name: 'Brow Styling Soap', price: 29.99, imageUrl: 'images/brow-styling-soap.png', category: 'makeup' },
        { id: 'prod012', name: 'Golden Ring', price: 199, imageUrl: 'images/imagen3.png', category: 'accessories' },
        { id: 'prod012', name: 'Golden Ring Small', price: 199, imageUrl: 'images/imagen4.png', category: 'accessories' },
        { id: 'prod012', name: 'Hummingbird Neckless', price: 199, imageUrl: 'images/neckless.png', category: 'accessories' }
    ];

    // --- Function to Render Products (for all-products.html and siteplan.html) ---
    function renderProducts(productsToRender, containerId) {
        const container = document.getElementById(containerId);
        const noProductsMessage = document.getElementById('no-products-message'); 

        if (!container) return; 

        container.innerHTML = ''; 

        if (productsToRender.length === 0) {
            if (noProductsMessage) {
                noProductsMessage.style.display = 'block';
            }
            return;
        } else {
            if (noProductsMessage) {
                noProductsMessage.style.display = 'none';
            }
        }

        productsToRender.forEach(product => {
            const productCardHTML = `
                <div class="product-card">
                    <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="btn btn-secondary add-to-cart" 
                            data-product-id="${product.id}" 
                            data-product-name="${product.name}" 
                            data-product-price="${product.price}"
                            data-product-image="${product.imageUrl}">Add to Cart</button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', productCardHTML);
        });

        // Re-attach listeners to "Add to Cart" buttons after rendering
        container.querySelectorAll('.add-to-cart').forEach(button => {
            button.removeEventListener('click', handleAddToCartClick);
            button.addEventListener('click', handleAddToCartClick);
        });
    }

    // --- Logic to Load and Filter Products on all-products.html ---
    const currentPagePath = window.location.pathname;
    const currentFileName = currentPagePath.split('/').pop();

    const productsContainer = document.getElementById('products-container'); // Container on all-products.html
    const categorySelect = document.getElementById('category-select'); // Category filter selector
    const sortBySelect = document.getElementById('sort-by'); // Sort by selector

    let displayedProducts = []; // Stores the currently displayed/filtered products

    function applyFiltersAndSort() {
        let filteredProducts = [...allProducts];

        const selectedCategory = categorySelect ? categorySelect.value : 'all';
        const sortValue = sortBySelect ? sortBySelect.value : 'default';

        if (selectedCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
        }

        if (sortValue === 'price-asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'name-asc') {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortValue === 'name-desc') {
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        }

        displayedProducts = filteredProducts;
        renderProducts(displayedProducts, 'products-container');
    }

    if (currentFileName === 'all-products.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromUrl = urlParams.get('category');

        if (categoryFromUrl && categorySelect) {
            categorySelect.value = categoryFromUrl;
        }
        
        applyFiltersAndSort(); 

        if (categorySelect) {
            categorySelect.addEventListener('change', applyFiltersAndSort);
        }
        if (sortBySelect) {
            sortBySelect.addEventListener('change', applyFiltersAndSort);
        }

    } else if (currentFileName === 'siteplan.html') {
        const offerProductsContainer = document.getElementById('offer-products');
        const initialProductsForIndex = allProducts.slice(0, 5); 
        renderProducts(initialProductsForIndex, 'offer-products');
    }

    // --- Shopping Cart Page Specific Logic (cart.html) ---
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Function to render cart items on the cart page
    function renderCartItems() {
        if (!cartItemsContainer || !cartTotalAmount || !emptyCartMessage) return; // Only run if on cart.html

        cartItemsContainer.innerHTML = ''; // Clear existing items

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            checkoutBtn.disabled = true;
            cartTotalAmount.textContent = '$0.00';
            return;
        } else {
            emptyCartMessage.style.display = 'none';
            checkoutBtn.disabled = false;
        }

        let total = 0;

        // Using forEach to iterate over cart items
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItemHTML = `
                <div class="cart-item" data-product-id="${item.id}">
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>Price: $${item.price.toFixed(2)}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="decrease-quantity" aria-label="Decrease quantity of ${item.name}">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-product-id="${item.id}" aria-label="Quantity of ${item.name}">
                        <button class="increase-quantity" aria-label="Increase quantity of ${item.name}">+</button>
                    </div>
                    <p class="item-price">Subtotal: $${itemTotal.toFixed(2)}</p>
                    <button class="remove-item" data-product-id="${item.id}" aria-label="Remove ${item.name} from cart">Remove</button>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });

        cartTotalAmount.textContent = `$${total.toFixed(2)}`;

        // Attach event listeners for quantity changes and remove buttons
        cartItemsContainer.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        cartItemsContainer.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        cartItemsContainer.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeItemFromCart);
        });
        cartItemsContainer.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', updateQuantityFromInput);
        });
    }

    function increaseQuantity(event) {
        const productId = event.target.closest('.cart-item').dataset.productId;
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity++;
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            renderCartItems(); // Re-render to update quantities and total
            updateCartCount(); // Update header count
        }
    }

    function decreaseQuantity(event) {
        const productId = event.target.closest('.cart-item').dataset.productId;
        const item = cart.find(i => i.id === productId);
        if (item && item.quantity > 1) {
            item.quantity--;
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            renderCartItems();
            updateCartCount();
        } else if (item && item.quantity === 1) {
            // If quantity is 1, remove the item
            removeItemFromCart({ target: event.target });
        }
    }

    function updateQuantityFromInput(event) {
        const productId = event.target.dataset.productId;
        let newQuantity = parseInt(event.target.value, 10);
        
        // Conditional branching to ensure valid quantity
        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1; // Default to 1 if invalid
            event.target.value = 1; // Correct the input field
        }

        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity = newQuantity;
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            renderCartItems();
            updateCartCount();
        }
    }

    function removeItemFromCart(event) {
        const productId = event.target.closest('.cart-item').dataset.productId;
        // Using array method filter() to remove the item
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        renderCartItems(); // Re-render the cart
        updateCartCount(); // Update header count
    }

    // Attach event listener for checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert('Proceeding to checkout! (This is a simulation)');
                // In a real application, you'd navigate to a checkout form
                // For now, clear the cart after "checkout"
                cart = [];
                localStorage.setItem('shoppingCart', JSON.stringify(cart));
                renderCartItems();
                updateCartCount();
            } else {
                alert('Your cart is empty. Please add items before checking out.');
            }
        });
    }

    // Only render cart items if we are on the cart page
    if (currentFileName === 'cart.html') {
        renderCartItems();
    }


    // --- Contact Form Validation and Logic (contact-us.html) ---
    // (This code remains the same as in the previous version)
    const contactForm = document.getElementById('contactForm');
    const messageInput = document.getElementById('message');
    const charCountDisplay = document.getElementById('charCount');
    const formMessageDisplay = document.getElementById('formMessage');

    if (contactForm) { 
        if (messageInput && charCountDisplay) {
            messageInput.addEventListener('input', () => {
                const currentLength = messageInput.value.length;
                const minLength = messageInput.minLength;
                const maxLength = messageInput.maxLength > 0 ? messageInput.maxLength : 500;
                charCountDisplay.textContent = `Characters: ${currentLength} / ${maxLength}`;

                if (currentLength < minLength) {
                    charCountDisplay.style.color = 'red';
                } else if (currentLength > maxLength) {
                    charCountDisplay.style.color = 'orange';
                } else {
                    charCountDisplay.style.color = 'inherit';
                }
            });
            messageInput.dispatchEvent(new Event('input'));
        }

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = messageInput ? messageInput.value.trim() : '';
            const subject = document.getElementById('subject').value;

            if (name === '' || email === '' || message === '' || subject === '') {
                if (formMessageDisplay) {
                    formMessageDisplay.textContent = 'Please fill in all required fields.';
                    formMessageDisplay.className = 'form-message error';
                }
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                if (formMessageDisplay) {
                    formMessageDisplay.textContent = 'Please enter a valid email address.';
                    formMessageDisplay.className = 'form-message error';
                }
                return;
            }

            const formData = {
                name: name,
                email: email,
                subject: subject,
                message: message,
                timestamp: new Date().toISOString()
            };

            let previousSubmissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
            previousSubmissions.push(formData);
            localStorage.setItem('contactSubmissions', JSON.stringify(previousSubmissions));

            if (formMessageDisplay) {
                formMessageDisplay.innerHTML = `
                    <p>Thank you for your message, <strong>${name}</strong>!</p>
                    <p>We will get back to you as soon as possible.</p>
                `;
                formMessageDisplay.className = 'form-message success';
            }

            contactForm.reset();
            if (messageInput) {
                messageInput.dispatchEvent(new Event('input'));
            }
        });
    }

    // --- Detect current page and add 'active' class to navigation ---
    const navLinks = document.querySelectorAll('.nav-list a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        const currentUrl = window.location.href;

        // Exact match
        if (currentUrl.split('#')[0] === linkHref.split('#')[0]) {
             link.classList.add('active');
        } else if (linkHref.startsWith('all-products.html') && currentUrl.includes('all-products.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const categoryFromUrl = urlParams.get('category');
            
            // Check for 'All Products' link (which might be 'all-products.html' or 'all-products.html?category=all')
            if (linkHref === 'all-products.html' && (!categoryFromUrl || categoryFromUrl === 'all')) {
                link.classList.add('active');
            } 
            // Check for 'Makeup' link specifically
            else if (linkHref === 'all-products.html?category=makeup' && categoryFromUrl === 'makeup') {
                link.classList.add('active');
            }
        }
    });

});