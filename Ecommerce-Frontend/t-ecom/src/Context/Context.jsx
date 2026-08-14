import axios from "../axios";
import { useState, useEffect, createContext } from "react";
import { clearStoredAuth, decodeToken, getToken, setToken } from "../auth";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  isAuthenticated: false,
  currentUser: null,
  addToCart: (product, count) => {},
  removeFromCart: (productId) => {},
  refreshData: () => {},
  updateStockQuantity: (productId, newQuantity) => {},
  clearCart: () => {},
  login: (token) => {},
  logout: () => {},
});

const getCartKey = (username) => `cart_${username}`;

const loadCart = (username) => {
  if (!username) return [];
  const saved = localStorage.getItem(getCartKey(username));
  return saved ? JSON.parse(saved) : [];
};

const saveCart = (username, cart) => {
  if (!username) return;
  localStorage.setItem(getCartKey(username), JSON.stringify(cart));
};

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  
  const [authToken, setAuthToken] = useState(getToken());
  const [currentUser, setCurrentUser] = useState(() => {
    const decoded = decodeToken(getToken());
    return decoded
      ? {
          username: decoded.sub || null,
          role: decoded.role || null,
        }
      : null;
  });

  const [cart, setCart] = useState(() => {
    const decoded = decodeToken(getToken());
    if (decoded && decoded.sub) {
      return loadCart(decoded.sub);
    }
    return [];
  });

  const addToCart = (product, count = 1) => {
    if (!currentUser?.username) return; // Cart remains empty if no user is logged in
    
    let updatedCart;
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);
    
    if (existingProductIndex !== -1) {
      updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: Math.min(item.quantity + count, product.stockQuantity) }
          : item
      );
    } else {
      const { imageData, ...productWithoutImage } = product;
      updatedCart = [...cart, { ...productWithoutImage, quantity: count }];
    }
    
    setCart(updatedCart);
    saveCart(currentUser.username, updatedCart);
  };

  const removeFromCart = (productId) => {
    if (!currentUser?.username) return;
    
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    saveCart(currentUser.username, updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    if (currentUser?.username) {
      saveCart(currentUser.username, []);
    }
  };

  const refreshData = async () => {
    try {
      const response = await axios.get("/products");
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  const login = (token) => {
    setToken(token);
    setAuthToken(token);
    const decoded = decodeToken(token);
    
    if (decoded && decoded.sub) {
      const user = {
        username: decoded.sub,
        role: decoded.role || null,
      };
      setCurrentUser(user);
      setCart(loadCart(user.username));
    } else {
      setCurrentUser(null);
      setCart([]);
    }
  };

  const logout = () => {
    clearStoredAuth();
    setAuthToken(null);
    setCurrentUser(null);
    setCart([]); // Clear in-memory cart state; user's cart is safely preserved in localStorage
  };
  
  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppContext.Provider value={{
      data,
      isError,
      cart,
      addToCart,
      removeFromCart,
      refreshData,
      clearCart,
      isAuthenticated: Boolean(authToken),
      currentUser,
      login,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;