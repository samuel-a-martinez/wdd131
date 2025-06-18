document.addEventListener('DOMContentLoaded', () => {
    // --- Menú de Navegación Responsive (Hamburguesa) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            menuToggle.classList.toggle('open'); // Para animar el icono de hamburguesa
        });

        // Cerrar el menú si se hace clic fuera de él o en un enlace
        document.addEventListener('click', (event) => {
            if (!navList.contains(event.target) && !menuToggle.contains(event.target) && navList.classList.contains('active')) {
                navList.classList.remove('active');
                menuToggle.classList.remove('open');
            }
        });

        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    menuToggle.classList.remove('open');
                }
            });
        });
    }

    // --- Funcionalidad del Carrito de Compras (usando localStorage) ---
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // Función para actualizar el contador del carrito
    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    // Función para añadir un producto al carrito
    function addProductToCart(product) {
        // Usar un método de array (some) para verificar si el producto ya está en el carrito
        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            // Si el producto ya existe, solo incrementa la cantidad
            existingProduct.quantity += 1;
            alert(`"${product.name}" ya estaba en tu carrito. Cantidad actualizada.`);
        } else {
            // Si es un producto nuevo, lo añade con cantidad 1
            product.quantity = 1;
            cart.push(product);
            alert(`"${product.name}" ha sido añadido al carrito.`);
        }
        localStorage.setItem('shoppingCart', JSON.stringify(cart)); // Guarda en localStorage
        updateCartCount(); // Actualiza el contador visual
    }

    // Escuchar clics en los botones "Añadir al Carrito"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            const productName = event.target.dataset.productName;
            const productPrice = parseFloat(event.target.dataset.productPrice);

            // Crear un objeto para el producto usando template literals
            const productToAdd = {
                id: productId,
                name: productName,
                price: productPrice
            };
            addProductToCart(productToAdd);
        });
    });

    // Inicializar el contador del carrito al cargar la página
    updateCartCount();

    // --- Ejemplo de Creación Dinámica de Contenido (más productos de oferta) ---
    const offerProductsContainer = document.getElementById('offer-products');

    const additionalProducts = [
        { id: 'prod003', name: 'Crema Hidratante Facial', price: 22.50, imageUrl: 'img/product3.jpg' },
        { id: 'prod004', name: 'Máscara de Pestañas Volumen', price: 12.00, imageUrl: 'img/product4.jpg' },
        { id: 'prod005', name: 'Paleta de Sombras Neutras', price: 35.00, imageUrl: 'img/product5.jpg' }
    ];

    function renderProducts(products, container) {
        if (!container) return; // Asegúrate de que el contenedor exista

        // Usar forEach para iterar sobre el array de productos
        products.forEach(product => {
            // Usar template literals para construir el HTML de la tarjeta de producto
            const productCardHTML = `
                <div class="product-card">
                    <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="btn btn-secondary add-to-cart" 
                            data-product-id="${product.id}" 
                            data-product-name="${product.name}" 
                            data-product-price="${product.price}">Añadir al Carrito</button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', productCardHTML);
        });

        // Re-adjuntar listeners a los nuevos botones de "Añadir al Carrito"
        container.querySelectorAll('.add-to-cart').forEach(button => {
            button.removeEventListener('click', handleAddToCartClick); // Evitar duplicados
            button.addEventListener('click', handleAddToCartClick);
        });
    }

    // Función manejadora para los clics en añadir al carrito (para productos cargados dinámicamente)
    function handleAddToCartClick(event) {
        const productId = event.target.dataset.productId;
        const productName = event.target.dataset.productName;
        const productPrice = parseFloat(event.target.dataset.productPrice);

        const productToAdd = {
            id: productId,
            name: productName,
            price: productPrice
        };
        addProductToCart(productToAdd);
    }

    // Renderizar productos adicionales si estamos en la página principal
    if (offerProductsContainer) {
        renderProducts(additionalProducts, offerProductsContainer);
    }


    // --- Validación y Lógica del Formulario de Contacto (contact-us.html) ---
    const contactForm = document.getElementById('contactForm');
    const messageInput = document.getElementById('message');
    const charCountDisplay = document.getElementById('charCount');
    const formMessageDisplay = document.getElementById('formMessage');

    if (contactForm && messageInput && charCountDisplay) {
        // Actualizar el contador de caracteres del textarea
        messageInput.addEventListener('input', () => {
            const currentLength = messageInput.value.length;
            const minLength = messageInput.minLength;
            const maxLength = messageInput.maxLength > 0 ? messageInput.maxLength : 500; // Asumir un max si no está definido
            charCountDisplay.textContent = `Caracteres: ${currentLength} / ${maxLength}`;

            // Condicional: si excede el máximo o es menor que el mínimo
            if (currentLength < minLength) {
                charCountDisplay.style.color = 'red';
            } else if (currentLength > maxLength) {
                charCountDisplay.style.color = 'orange';
            }
            else {
                charCountDisplay.style.color = 'inherit';
            }
        });
        // Inicializar el contador al cargar la página
        messageInput.dispatchEvent(new Event('input'));


        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevenir el envío por defecto del formulario

            // Simulación de validación (además de la validación HTML5)
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = messageInput.value.trim();
            const subject = document.getElementById('subject').value;

            // Conditional Branching
            if (name === '' || email === '' || message === '' || subject === '') {
                formMessageDisplay.textContent = 'Por favor, rellena todos los campos obligatorios.';
                formMessageDisplay.className = 'form-message error'; // Modificar clase para CSS
                return; // Detener la ejecución si hay campos vacíos
            }

            // Validación de email simple (adicional a type="email")
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                formMessageDisplay.textContent = 'Por favor, ingresa un correo electrónico válido.';
                formMessageDisplay.className = 'form-message error';
                return;
            }

            // Simular envío exitoso y guardar datos en localStorage
            const formData = {
                name: name,
                email: email,
                subject: subject,
                message: message,
                timestamp: new Date().toISOString()
            };

            // Recuperar envíos anteriores (si los hay)
            let previousSubmissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
            // Usar método de array: push
            previousSubmissions.push(formData);
            localStorage.setItem('contactSubmissions', JSON.stringify(previousSubmissions));

            // Modificar el DOM y usar template literals para el mensaje de éxito
            formMessageDisplay.innerHTML = `
                <p>¡Gracias por tu mensaje, <strong>${name}</strong>!</p>
                <p>Nos pondremos en contacto contigo lo antes posible.</p>
            `;
            formMessageDisplay.className = 'form-message success';

            contactForm.reset(); // Limpiar el formulario
            messageInput.dispatchEvent(new Event('input')); // Resetear el contador de caracteres
        });
    }

    // --- Detectar la página actual y añadir clase 'active' a la navegación ---
    const currentPagePath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-list a');

    navLinks.forEach(link => {
        // Obtener solo el nombre del archivo (ej. index.html)
        const linkPath = link.getAttribute('href').split('/').pop();
        const currentFileName = currentPagePath.split('/').pop();

        if (linkPath === currentFileName) {
            link.classList.add('active');
        }
    });

});