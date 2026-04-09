// Product Data
const products = [
    { id: 1, name: "Silk Evening Dress", category: "women", price: 189, originalPrice: 249, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", badge: "sale", description: "Elegant silk evening dress with flowing silhouette." },
    { id: 2, name: "Wool Overcoat", category: "men", price: 299, originalPrice: null, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400", badge: "new", description: "Premium wool overcoat in charcoal black." },
    { id: 3, name: "Minimal Watch", category: "accessories", price: 149, originalPrice: 199, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400", badge: "sale", description: "Minimalist timepiece with leather strap." },
    { id: 4, name: "Pleated Midi Skirt", category: "women", price: 89, originalPrice: null, image: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj2f?w=400", badge: null, description: "Classic pleated skirt in midnight black." },
    { id: 5, name: "Cashmere Sweater", category: "men", price: 159, originalPrice: null, image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400", badge: "new", description: "Luxurious cashmere blend sweater." },
    { id: 6, name: "Leather Crossbody", category: "accessories", price: 129, originalPrice: 179, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400", badge: "sale", description: "Genuine leather crossbody bag." },
    { id: 7, name: "Blazer Jacket", category: "women", price: 219, originalPrice: null, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400", badge: "new", description: "Structured blazer for modern professionals." },
    { id: 8, name: "Denim Jacket", category: "men", price: 119, originalPrice: 149, image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400", badge: "sale", description: "Vintage wash denim jacket." },
    { id: 9, name: "Statement Sunglasses", category: "accessories", price: 79, originalPrice: null, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", badge: null, description: "Bold frames with UV protection." },
    { id: 10, name: "Velvet Jumpsuit", category: "women", price: 169, originalPrice: null, image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400", badge: "new", description: "Elegant velvet jumpsuit with wide legs." },
    { id: 11, name: "Linen Shirt", category: "men", price: 89, originalPrice: null, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400", badge: null, description: "Breathable linen shirt in dark tones." },
    { id: 12, name: "Silver Ring Set", category: "accessories", price: 59, originalPrice: 89, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400", badge: "sale", description: "Stackable sterling silver rings." }
];

// State
let cart = JSON.parse(localStorage.getItem('noir_cart')) || [];

// DOM Elements
const loader = document.getElementById('loader');
const header = document.getElementById('header');
const productsGrid = document.getElementById('products-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItems = document.getElementById('cart-items');
const cartBadge = document.getElementById('cart-badge');
const cartTotal = document.getElementById('cart-total');
const modal = document.getElementById('modal');
const mobileMenu = document.getElementById('mobile-menu');
const searchOverlay = document.getElementById('search-overlay');
const toast = document.getElementById('toast');

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => loader.classList.add('hidden'), 800);
    renderProducts('all');
    updateCartUI();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Render Products
function renderProducts(filter) {
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    productsGrid.innerHTML = filtered.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-actions">
                    <button class="action-btn" onclick="openModal(${product.id})" title="Quick view"><i class="fas fa-eye"></i></button>
                    <button class="action-btn" onclick="addToCart(${product.id})" title="Add to cart"><i class="fas fa-shopping-bag"></i></button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Products
function filterProducts(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(category);
}

// Cart Functions
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQty(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) removeFromCart(productId);
        else { saveCart(); updateCartUI(); }
    }
}

function saveCart() {
    localStorage.setItem('noir_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    cartBadge.textContent = totalQty;
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
    }
}

// Modal
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    document.getElementById('modal-body').innerHTML = `
        <div class="modal-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-info">
            <span class="product-category">${product.category}</span>
            <h2>${product.name}</h2>
            <div class="modal-price">$${product.price}</div>
            <p class="modal-desc">${product.description}</p>
            <div class="sizes">
                ${['S','M','L','XL'].map(size => `<button class="size-btn" onclick="this.classList.toggle('active')">${size}</button>`).join('')}
            </div>
            <button class="btn btn-full" onclick="addToCart(${product.id}); closeModal();">
                Add to Cart
            </button>
        </div>
    `;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Menu & Search
function toggleMenu() {
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

function toggleSearch() {
    searchOverlay.classList.toggle('active');
    if (searchOverlay.classList.contains('active')) {
        document.getElementById('search-input').focus();
    }
}

// Toast
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// Newsletter
function handleSubscribe(e) {
    e.preventDefault();
    showToast('Thank you for subscribing!');
    e.target.reset();
}

// Close modal on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Search on Enter
document.getElementById('search-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        showToast(`Searching for: ${e.target.value}`);
        toggleSearch();
    }
});
