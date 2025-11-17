import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Plus, Minus, Trash2, LogIn, LogOut, Star } from 'lucide-react';

const QATrainingApp = () => {
  const [products] = useState([
    { id: 1, name: 'Laptop Pro', price: 1299.99, stock: 5, category: 'Electronics', rating: 4.5, image: '💻' },
    { id: 2, name: 'Wireless Mouse', price: 29.99, stock: 15, category: 'Accessories', rating: 4.2, image: '🖱️' },
    { id: 3, name: 'Mechanical Keyboard', price: 89.99, stock: 8, category: 'Accessories', rating: 4.7, image: '⌨️' },
    { id: 4, name: 'USB-C Hub', price: 49.99, stock: 0, category: 'Accessories', rating: 4.0, image: '🔌' },
    { id: 5, name: 'Webcam HD', price: 79.99, stock: 12, category: 'Electronics', rating: 4.3, image: '📷' },
    { id: 6, name: 'Headphones', price: 149.99, stock: 20, category: 'Audio', rating: 4.8, image: '🎧' },
    { id: 7, name: 'Monitor 27"', price: 299.99, stock: 3, category: 'Electronics', rating: 4.6, image: '🖥️' },
    { id: 8, name: 'Desk Lamp', price: 39.99, stock: 25, category: 'Office', rating: 4.1, image: '💡' },
  ]);

  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const categories = ['All', 'Electronics', 'Accessories', 'Audio', 'Office'];

  // Bug intentionnel: filtrage incorrect avec recherche vide
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    // Bug: permet d'ajouter des produits en rupture de stock
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        // Bug: permet des quantités négatives
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    // Bug intentionnel: calcul incorrect avec arrondi
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * discount;
    return (subtotal - discountAmount).toFixed(2);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Bug: validation faible
    if (loginForm.email && loginForm.password) {
      setUser({ name: loginForm.email.split('@')[0], email: loginForm.email });
      setShowLogin(false);
      setLoginForm({ email: '', password: '' });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Bug: pas de vérification que les mots de passe correspondent
    if (registerForm.name && registerForm.email && registerForm.password) {
      setUser({ name: registerForm.name, email: registerForm.email });
      setShowLogin(false);
      setIsRegistering(false);
      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setOrderHistory([]);
  };

  const applyPromoCode = () => {
    // Bug: codes promo toujours acceptés même invalides
    if (promoCode === 'SAVE10') {
      setDiscount(0.10);
      alert('Code promo appliqué: 10% de réduction');
    } else if (promoCode === 'SAVE20') {
      setDiscount(0.20);
      alert('Code promo appliqué: 20% de réduction');
    } else if (promoCode) {
      // Bug: message d'erreur mais applique quand même une réduction
      setDiscount(0.05);
      alert('Code promo invalide');
    }
  };

  const checkout = () => {
    if (!user) {
      alert('Veuillez vous connecter pour finaliser la commande');
      setShowLogin(true);
      return;
    }
    
    if (cart.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    // Bug: pas de vérification du stock lors du checkout
    const order = {
      id: Date.now(),
      items: [...cart],
      total: calculateTotal(),
      date: new Date().toLocaleDateString(),
      status: 'Confirmée'
    };

    setOrderHistory([...orderHistory, order]);
    setCart([]);
    setDiscount(0);
    setPromoCode('');
    setShowCart(false);
    alert(`Commande confirmée! Total: ${calculateTotal()}€`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">TechShop QA Demo</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setShowOrderHistory(!showOrderHistory)}
              className="hover:bg-blue-700 px-3 py-2 rounded"
            >
              Mes Commandes
            </button>
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative hover:bg-blue-700 px-3 py-2 rounded flex items-center gap-2"
            >
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <User size={20} />
                <span>{user.name}</span>
                <button onClick={handleLogout} className="hover:bg-blue-700 px-3 py-2 rounded">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="hover:bg-blue-700 px-3 py-2 rounded flex items-center gap-2"
              >
                <LogIn size={20} />
                Connexion
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">
              {isRegistering ? 'Inscription' : 'Connexion'}
            </h2>
            {isRegistering ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="password"
                  placeholder="Confirmer mot de passe"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <button onClick={handleRegister} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                  S'inscrire
                </button>
                <button
                  onClick={() => setIsRegistering(false)}
                  className="w-full text-blue-600 hover:underline"
                >
                  Déjà un compte? Se connecter
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <button onClick={handleLogin} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                  Se connecter
                </button>
                <button
                  onClick={() => setIsRegistering(true)}
                  className="w-full text-blue-600 hover:underline"
                >
                  Créer un compte
                </button>
              </div>
            )}
            <button
              onClick={() => {
                setShowLogin(false);
                setIsRegistering(false);
              }}
              className="mt-4 w-full text-gray-600 hover:underline"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-2xl max-w-2xl max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Panier</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">Votre panier est vide</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b py-4">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{item.image}</span>
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-600">{item.price}€</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-4 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Code promo"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Appliquer
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="text-green-600">Réduction: {(discount * 100).toFixed(0)}%</p>
                  )}
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>{calculateTotal()}€</span>
                  </div>
                </div>
                <button
                  onClick={checkout}
                  className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 mt-4"
                >
                  Valider la commande
                </button>
              </>
            )}
            <button
              onClick={() => setShowCart(false)}
              className="mt-4 w-full text-gray-600 hover:underline"
            >
              Continuer mes achats
            </button>
          </div>
        </div>
      )}

      {/* Order History Modal */}
      {showOrderHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-2xl max-w-2xl max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Historique des commandes</h2>
            {orderHistory.length === 0 ? (
              <p className="text-gray-600">Aucune commande</p>
            ) : (
              orderHistory.map(order => (
                <div key={order.id} className="border-b py-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Commande #{order.id}</span>
                    <span className="text-gray-600">{order.date}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {order.items.map(item => (
                      <div key={item.id}>
                        {item.name} x{item.quantity}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Total: {order.total}€</span>
                    <span className="text-green-600">{order.status}</span>
                  </div>
                </div>
              ))
            )}
            <button
              onClick={() => setShowOrderHistory(false)}
              className="mt-4 w-full text-gray-600 hover:underline"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-6xl text-center mb-4">{product.image}</div>
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <div className="flex items-center gap-1 mb-2">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{product.rating}</span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{product.category}</p>
              <p className="text-2xl font-bold text-blue-600 mb-2">{product.price}€</p>
              <p className={`text-sm mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `En stock (${product.stock})` : 'Rupture de stock'}
              </p>
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Ajouter au panier
              </button>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-600 py-12">
            Aucun produit trouvé
          </div>
        )}
      </main>
    </div>
  );
};

export default QATrainingApp;