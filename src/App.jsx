import React, { useState, useEffect } from 'react';
import { 
  fetchMenu, fetchCategories, loginUser, registerUser, 
  syncCartItem, fetchClientActiveOrders, fetchClientBonuses 
} from './api';
import AppShow from './AppShow'; // Импортируем файл с оформлением всей страницы

import Header from './components/Header';
import UserProfileModal from './components/UserProfileModal';
//import { fetchOrderDetails } from './api'; // Убедитесь, что импорт функции API на месте


function App() {
  // --- Данные СУБД и корзины ---
  const [menuItems, setMenuItems] = useState([]);      
  const [categories, setCategories] = useState([]);    
  const [activeOrders, setActiveOrders] = useState([]); 
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('restaurant_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // --- ЖЕСТКОЕ ВОССТАНОВЛЕНИЕ СЕССИИ (Защита от вылета при F5) ---
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('restaurant_user');
    // Считываем синхронно ДО первого рендера, чтобы id Анны Сергеевны никогда не терялся
    return savedUser && savedUser !== "null" ? JSON.parse(savedUser) : null;
  });

  // --- Состояния UI окон ---
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('Все'); 
  const [isCheckoutPageOpen, setIsCheckoutPageOpen] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);     
  const [isCabinetOpen, setIsCabinetOpen] = useState(false); 
  const [isActiveOrdersOpen, setIsActiveOrdersOpen] = useState(false); 
  const [isRegisterMode, setIsRegisterMode] = useState(false); 

  // --- Поля ввода форм ---
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Синхронизация корзины с локальной памятью
  useEffect(() => {
    localStorage.setItem('restaurant_cart', JSON.stringify(cart));
  }, [cart]);

  // // Надежный хук загрузки меню с лайками из СУБД
  // useEffect(() => {
  //   setLoading(true);
  //   // Берем ID напрямую из стейта, который мы гарантированно восстановили выше
  //   const clientId = currentUser?.id ? Number(currentUser.id) : null;

  //   console.log("🏁 Запрашиваем меню из СУБД с ID клиента:", clientId);

  //   Promise.all([fetchMenu(clientId), fetchCategories()])
  //     .then(([menuResponse, catResponse]) => {
  //       // Безопасно парсим меню
  //       const menuData = Array.isArray(menuResponse.data) ? menuResponse.data : [];
  //       setMenuItems(menuData);

  //       // cite: 2
  //       // Безопасно парсим категории: проверяем, массив ли это
  //       const categoriesData = Array.isArray(catResponse.data) ? catResponse.data : [];
  //       const dbCategories = categoriesData.map(c => c.category_name);
        
  //       setCategories(['Все', ...dbCategories]);
  //       setLoading(false);
  //     })
  //     .catch(err => { 
  //       console.error("🚨 Ошибка PostgreSQL при загрузке меню:", err); 
  //       setLoading(false); 
  //     });
  // }, [currentUser]); 
  



    // Надежный хук загрузки меню с лайками из СУБД
  useEffect(() => {
    setLoading(true);
    // Берем ID напрямую из стейта, который мы гарантированно восстановили выше
    const clientId = currentUser?.id ? Number(currentUser.id) : null;

    console.log("🏁 Запрашиваем меню из СУБД с ID клиента:", clientId);

    Promise.all([fetchMenu(clientId), fetchCategories()])
      .then(([menuResponse, catResponse]) => {


         // ДОБАВЬТЕ ЭТИ ДВЕ СТРОЧКИ ДЛЯ ПРОВЕРКИ:
        console.log("🍏 РЕАЛЬНЫЙ ОТВЕТ МЕНЮ С СЕРВЕРА:", menuResponse.data);
        console.log("🍎 РЕАЛЬНЫЙ ОТВЕТ КАТЕГОРИЙ С СЕРВЕРА:", catResponse.data);

        // 1. Безопасный парсинг меню
        const menuData = Array.isArray(menuResponse.data) ? menuResponse.data : (menuResponse.data?.results || []);
        setMenuItems(menuData);

        // 2. УМНЫЙ И БЕЗОПАСНЫЙ ПАРСИНГ КАТЕГОРИЙ (Исправляет e.slice)
        let categoriesData = [];
        
        if (catResponse && catResponse.data) {
            if (Array.isArray(catResponse.data)) {
                // Если Django вернул чистый массив: [ {category_name: 'Пицца'}, ... ]
                categoriesData = catResponse.data;
            } else if (catResponse.data.results && Array.isArray(catResponse.data.results)) {
                // Если в Django включена пагинация, данные лежат в ключе results
                categoriesData = catResponse.data.results;
            } else if (typeof catResponse.data === 'object') {
                // Если пришел один объект или странная структура
                categoriesData = Object.values(catResponse.data).filter(item => typeof item === 'object');
            }
        }

        // Извлекаем имена категорий. Если поле называется иначе, подставьте свое вместо category_name
        const dbCategories = categoriesData
            .map(c => c.category_name || c.name || (typeof c === 'string' ? c : null))
            .filter(Boolean); // удаляем пустые значения, если они появились
        
        setCategories(['Все', ...dbCategories]);
        setLoading(false);
      })
      .catch(err => {
        console.log("❌ ПОЛНЫЙ ОБЪЕКТ ОШИБКИ:", err);
        console.log("📡 СТАТУС ОТВЕТА СЕРВЕРА:", err.response?.status);
        console.log("💾 ТЕКСТ ОТВЕТА СЕРВЕРА:", err.response?.data);

        console.error("🚨 Ошибка при получении данных с Render:", err);
        setCategories(['Все']); // Сайт не упадет в белый экран, останется кнопка "Все"
        setLoading(false);
      });
  }, [currentUser]); 




 


  // Просмотр активных заказов (get_client_active_order)
  const handleOpenActiveOrders = () => {
    if (currentUser) {
      fetchClientActiveOrders(currentUser.id)
        .then(res => {
          setActiveOrders(res.data || []);
          setIsActiveOrdersOpen(true);
        })
        .catch(err => console.error("Ошибка получения активных заказов:", err));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('restaurant_cart'); 
    localStorage.removeItem('restaurant_user'); 
    setCart([]);                   
    setCurrentUser(null);          
    setIsCabinetOpen(false); 
  };

  const addToCart = (item) => {
    const existingIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    let newCart = [...cart];

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += 1;
    } else {
      newCart.push({ ...item, quantity: 1 });
    }
    setCart(newCart);

    if (currentUser) {
      syncCartItem({ client_id: currentUser.id, item_id: item.id, action: 'ADD' })
        .catch(err => console.error("Ошибка СУБД (ADD):", err));
    }
  };

  const decrementCartItem = (itemId) => {
    const existingIndex = cart.findIndex(cartItem => cartItem.id === itemId);
    if (existingIndex === -1) return;

    let newCart = [...cart];
    if (newCart[existingIndex].quantity > 1) {
      newCart[existingIndex].quantity -= 1;
    } else {
      newCart.splice(existingIndex, 1); 
    }
    setCart(newCart);

    if (currentUser) {
      syncCartItem({ client_id: currentUser.id, item_id: itemId, action: 'DECREMENT' })
        .catch(err => console.error("Ошибка СУБД (DECREMENT):", err));
    }
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    const payload = { phone_number: phone, password_hash: password };

    const saveSession = (user) => {
      setCurrentUser(user);
      localStorage.setItem('restaurant_user', JSON.stringify(user)); // Записываем в память СРАЗУ при входе
      setIsModalOpen(false);
      clearAuthForm();
    };

    if (isRegisterMode) {
      registerUser({ ...payload, full_name: fullName })
        .then(res => saveSession(res.data.user))
        .catch(err => setAuthError(err.response?.data?.error || 'Ошибка регистрации'));
    } else {
      loginUser(payload)
        .then(res => saveSession(res.data.user))
        .catch(err => setAuthError(err.response?.data?.error || 'Неверный телефон или пароль'));
    }
  };

  const handleCheckout = () => {
    if (!currentUser) { setIsModalOpen(true); return; }
    if (cart.length === 0) return;
    setIsCheckoutPageOpen(true); 
  };

  const clearAuthForm = () => { setPhone(''); setPassword(''); setFullName(''); setAuthError(''); };

const filteredMenu = selectedFilter === 'Все' 
  ? menuItems 
  : menuItems.filter(item => item.category_name === selectedFilter);


  // Передаем абсолютно всю логику и стейты в компонент оформления
  return (
    <AppShow


    
      currentUser={currentUser} setCurrentUser={setCurrentUser}
      cart={cart} setCart={setCart} totalCartPrice={totalCartPrice}
      menuItems={menuItems} setMenuItems={setMenuItems} filteredMenu={filteredMenu}
      categories={categories} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter}
      loading={loading} isCheckoutPageOpen={isCheckoutPageOpen} setIsCheckoutPageOpen={setIsCheckoutPageOpen}
      isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} isCabinetOpen={isCabinetOpen} setIsCabinetOpen={setIsCabinetOpen}
      isActiveOrdersOpen={isActiveOrdersOpen} setIsActiveOrdersOpen={setIsActiveOrdersOpen} activeOrders={activeOrders}
      isRegisterMode={isRegisterMode} setIsRegisterMode={setIsRegisterMode}
      phone={phone} setPhone={setPhone} fullName={fullName} setFullName={setFullName}
      password={password} setPassword={setPassword} authError={authError}
      handleLogout={handleLogout} handleOpenActiveOrders={handleOpenActiveOrders}
      addToCart={addToCart} decrementCartItem={decrementCartItem}
      handleAuthSubmit={handleAuthSubmit} handleCheckout={handleCheckout} clearAuthForm={clearAuthForm}
    />
  );
}

export default App;
