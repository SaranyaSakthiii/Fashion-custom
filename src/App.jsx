import { useState, useEffect } from 'react';
import './App.css';

const categories = ['All', 'Men', 'Women', 'Kids', 'Accessories'];
const subCategories = {
  Men: ['T-Shirts', 'Jeans', 'Shirts', 'Jackets'],
  Women: ['Dresses', 'Tops', 'Jeans', 'Accessories'],
  Kids: ['Boys', 'Girls', 'Infants', 'Shoes'],
  Accessories: ['Bags', 'Watches', 'Jewelry', 'Belts']
};

const products = [
  { id: 1, name: 'Premium Cotton T-Shirt', price: 1299, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', brand: 'Urban Style', category: 'Men', subCategory: 'T-Shirts', stock: 10 },
  { id: 2, name: 'Slim-Fit Denim Jeans', price: 2499, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', brand: 'Denim Co.', category: 'Men', subCategory: 'Jeans', stock: 15 },
  { id: 3, name: 'Kids Casual T-Shirt', price: 699, image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800', brand: 'Little Stars', category: 'Kids', subCategory: 'Boys', stock: 20 },
  { id: 4, name: 'Girls Party Dress', price: 1899, image: 'https://images.unsplash.com/photo-1603966437167-14fcbfd424eb?w=800', brand: 'Kid Fashion', category: 'Kids', subCategory: 'Girls', stock: 8 },
  { id: 5, name: 'Women\'s Summer Dress', price: 1999, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', brand: 'Trendy', category: 'Women', subCategory: 'Dresses', stock: 12 },
  { id: 6, name: 'Designer Watch', price: 4999, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800', brand: 'TimeX', category: 'Accessories', subCategory: 'Watches', stock: 5 }
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState({
    name: '',
    address: '',
    phone: '',
    paymentMethod: 'cod'
  });

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => 
        product.category === selectedCategory && 
        (selectedSubCategory === 'All' || product.subCategory === selectedSubCategory)
      );

  const addToCart = (product) => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        alert('Sorry, no more stock available!');
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    if (newQuantity <= product.stock) {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      alert('Sorry, no more stock available!');
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleLogin = (e) => {
    e.preventDefault();
    if (userEmail && password.length >= 6) {
      setIsAuthenticated(true);
      setShowLogin(false);
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      alert('Please enter valid credentials');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (checkoutDetails.name && checkoutDetails.address && checkoutDetails.phone) {
      alert('Order placed successfully! Thank you for shopping with us.');
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
    } else {
      alert('Please fill all required fields');
    }
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="app">
      <header className="main-header">
        <div className="header-content">
          <button className="menu-toggle" onClick={() => setSideNavOpen(!sideNavOpen)}>
            ☰
          </button>
          <h1>Fashion Store</h1>
          <div className="user-actions">
            {isAuthenticated ? (
              <>
                <button className="auth-button" onClick={() => setIsAuthenticated(false)}>Logout</button>
                <button className="cart-button" onClick={() => setIsCartOpen(true)}>
                  🛒 Cart ({cart.length})
                </button>
              </>
            ) : (
              <button className="auth-button" onClick={() => setShowLogin(true)}>Login</button>
            )}
          </div>
        </div>
      </header>

      <div className="main-container">
        <div 
          className={`nav-overlay ${sideNavOpen ? 'visible' : ''}`} 
          onClick={() => setSideNavOpen(false)}
        />
        <aside className={`side-nav ${sideNavOpen ? 'open' : ''}`}>
          <nav className="category-nav">
            {categories.map(category => (
              <div key={category} className="category-item">
                <button 
                  className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedSubCategory('All');
                    setSideNavOpen(false);
                    scrollToTop();
                  }}
                >
                  {category}
                </button>
                {category !== 'All' && selectedCategory === category && (
                  <div className="subcategories">
                    {subCategories[category].map(sub => (
                      <button 
                        key={sub}
                        className={`subcategory-button ${selectedSubCategory === sub ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedSubCategory(sub);
                          setSideNavOpen(false);
                        }}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        <main className={`main-content ${sideNavOpen ? 'shifted' : ''}`}>
          <section className="products">
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products found in this category</p>
              </div>
            ) : (
              filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img 
                    src={product.image || 'https://via.placeholder.com/400x500?text=No+Image'} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                    }}
                  />
                  <div className="stock-info">Stock: {product.stock || 0}</div>
                  <button 
                    className="quick-add" 
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
                  </button>
                </div>
                <div className="product-info">
                  <h3 className="product-brand">{product.brand}</h3>
                  <p className="product-name">{product.name}</p>
                  <p className="product-price">{formatPrice(product.price)}</p>
                </div>
              </div>
            )))}
          </section>
        </main>
      </div>

      {isCartOpen && (
        <div className="cart-overlay">
          <div className="cart-modal">
            <button className="close-cart" onClick={() => setIsCartOpen(false)}>×</button>
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
              <p className="empty-cart">Your cart is empty</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p>{formatPrice(item.price)}</p>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <button className="remove-item" onClick={() => removeFromCart(item.id)}>×</button>
                  </div>
                ))}
                <div className="cart-total">
                  <span>Total:</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <button className="checkout-button" onClick={() => {
                  setIsCheckoutOpen(true);
                  setIsCartOpen(false);
                }}>Proceed to Checkout</button>
              </>
            )}
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="checkout-overlay">
          <div className="checkout-modal">
            <button className="close-checkout" onClick={() => setIsCheckoutOpen(false)}>×</button>
            <h2>Checkout</h2>
            <form onSubmit={handleCheckout}>
              <input
                type="text"
                placeholder="Full Name"
                value={checkoutDetails.name}
                onChange={(e) => setCheckoutDetails({...checkoutDetails, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Delivery Address"
                value={checkoutDetails.address}
                onChange={(e) => setCheckoutDetails({...checkoutDetails, address: e.target.value})}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={checkoutDetails.phone}
                onChange={(e) => setCheckoutDetails({...checkoutDetails, phone: e.target.value})}
                required
              />
              <div className="payment-method">
                <h3>Payment Method</h3>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={checkoutDetails.paymentMethod === 'cod'}
                    onChange={(e) => setCheckoutDetails({...checkoutDetails, paymentMethod: e.target.value})}
                  />
                  Cash on Delivery
                </label>
              </div>
              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-total">
                  <span>Total Amount:</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
              <button type="submit" className="place-order-button">Place Order</button>
            </form>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="login-overlay">
          <div className="login-modal">
            <button className="close-login" onClick={() => setShowLogin(false)}>×</button>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}

      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>Your trusted fashion destination</p>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: support@fashion.store</p>
          </div>
          <div className="footer-section">
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Fashion Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}