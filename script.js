// Sample Products Data
const products = [
    {
        id: 1,
        name: "Classic White T-Shirt",
        category: "men",
        price: 29.99,
        originalPrice: 39.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        badge: "sale",
        description: "A comfortable and versatile classic white t-shirt made from 100% organic cotton. Perfect for everyday wear."
    },
    {
        id: 2,
        name: "Denim Jacket",
        category: "men",
        price: 89.99,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400",
        badge: "new",
        description: "Stylish denim jacket with a modern fit. Features premium quality denim with vintage wash effect."
    },
    {
        id: 3,
        name: "Summer Floral Dress",
        category: "women",
        price: 59.99,
        originalPrice: 79.99,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
        badge: "sale",
        description: "Beautiful floral print dress perfect for summer occasions. Lightweight and breathable fabric."
    },
    {
        id: 4,
        name: "Elegant Blazer",
        category: "women",
        price: 129.99,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
        badge: "new",
        description: "Professional blazer for the modern working woman. Tailored fit with premium fabric."
    },
    {
        id: 5,
        name: "Leather Watch",
        category: "accessories",
        price: 149.99,
        originalPrice: 199.99,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
        badge: "sale",
        description: "Classic leather strap watch with minimalist design. Water-resistant and durable."
    },
    {
        id: 6,
        name: "Sunglasses",
        category: "accessories",
        price: 49.99,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
        badge: null,
        description: "Stylish UV protection sunglasses with polarized lenses. Perfect for sunny days."
    },
    {
        id: 7,
        name: "Casual Hoodie",
        category: "men",
        price: 54.99,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
        badge: "new",
        description: "Comfortable hoodie for casual wear. Soft fleece lining and adjustable drawstring hood."
    },
    {
        id: 8,
        name: "Pleated Skirt",
        category: "women",
        price: 44.99,
        originalPrice: 59.99,
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj2f?w=400",
        badge: "sale",
        description: "Elegant pleated midi skirt that pairs well with any top. Elastic waistband for comfort."
    },
    {
        id: 9,
        name: "Canvas Sneakers",
        category: "accessories",
        price: 64.99,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
        badge: "new",
        description: "Classic canvas sneakers for everyday comfort. Durable rubber sole and breathable material."
    },
    {
        id: 10,
        name: "Wool Sweater",
        category: "men",
        price: 79.99,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400",
        badge: null,
        description: "Premium wool sweater for cold weather. Soft, warm, and perfect for layering."
    },
    {
        id: 11,
        name: "Crossbody Bag",
        category: "accessories",
        price: 39.99,
        originalPrice: 54.99,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
        badge: "sale",
        description: "Compact crossbody bag with multiple compartments. Adjustable strap and secure closure."
    },
    {
        id: 12,
        name: "Silk Scarf",
        category: "women",
        price: 34.99,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400",
        badge: "new",
        description: "Luxurious silk scarf with beautiful patterns. Can be worn multiple ways."
    }
];

// Cart State
let cart = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('quick-view-modal');
const modalBody = document.getElementById('modal-body');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('all');
    updateCartUI();
    setupEventListeners();
});

// Render Products
function renderProducts(filter) {
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<div class="product-badges"><span class="badge badge-${product.badge}">${product.badge}</span></div>` : ''}
                <div class="product-actions">
                    <button class="action-btn" onclick="openModal(${product.id})" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="addToCart(${product.id})" title="Add to Cart">
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                    <button class="action-btn" title="Add to Wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.filter);
        });
    });

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Newsletter Form
    document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for subscribing!');
        e.target.reset();
    });

    // Mobile Menu
    document.querySelector('.mobile-menu-btn').addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('active');
    });
}

// Toggle Cart
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showNotification(`${product.name} added to cart!`);
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// Update Cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Open Modal
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    
    modalBody.innerHTML = `
        <div class="modal-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-info">
            <span class="product-category">${product.category}</span>
            <h2>${product.name}</h2>
            <div class="modal-price">
                $${product.price.toFixed(2)}
                ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
            </div>
            <p class="modal-description">${product.description}</p>
            <div class="size-selector">
                <label>Select Size:</label>
                <div class="size-options">
                    <button class="size-option">S</button>
                    <button class="size-option">M</button>
                    <button class="size-option active">L</button>
                    <button class="size-option">XL</button>
                </div>
            </div>
            <button class="btn btn-primary" onclick="addToCart(${product.id}); closeModal();">
                Add to Cart
            </button>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Size selection
    modalBody.querySelectorAll('.size-option').forEach(btn => {
        btn.addEventListener('click', () => {
            modalBody.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Close Modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 5000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});
