// import React from 'react';
// import Header from './components/Header';               
// import MenuList from './components/MenuList';           
// import UserProfileModal from './components/UserProfileModal'; 
// import CheckoutPage from './components/CheckoutPage';

// const AppShow = (props) => {
//   const {
//     currentUser, setCurrentUser, cart, setCart, totalCartPrice,
//     setMenuItems, filteredMenu, categories, selectedFilter, setSelectedFilter,
//     loading, isCheckoutPageOpen, setIsCheckoutPageOpen, isModalOpen, setIsModalOpen,
//     isCabinetOpen, setIsCabinetOpen, isActiveOrdersOpen, setIsActiveOrdersOpen, activeOrders,
//     isRegisterMode, setIsRegisterMode, phone, setPhone, fullName, setFullName,
//     password, setPassword, authError, handleLogout, handleOpenActiveOrders,
//     addToCart, decrementCartItem, handleAuthSubmit, handleCheckout, clearAuthForm
//   } = props;

//   return (
//     <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      
//       {/* КОМПОНЕНТ ШАПКИ */}
//       <Header 
//         currentUser={currentUser}
//         onAuthClick={() => setIsModalOpen(true)}
//         onProfileClick={() => setIsCabinetOpen(true)}
//         onLogout={handleLogout}
//         onActiveOrdersClick={handleOpenActiveOrders}
//       />

//       {/* ПЕРЕКЛЮЧАТЕЛЬ ЭКРАНОВ: ОФОРМЛЕНИЕ ИЛИ ГЛАВНОЕ МЕНЮ */}
//       {isCheckoutPageOpen ? (
//         <CheckoutPage 
//           currentUser={currentUser}
//           cart={cart}
//           totalCartPrice={totalCartPrice}
//           onCancel={() => setIsCheckoutPageOpen(false)}
//           onOrderSuccess={async () => {
//             setCart([]); 
//             localStorage.removeItem('restaurant_cart'); 
//             localStorage.removeItem('restaurant_checkout_active'); 
            
//             if (currentUser) {
//               try {
//                 const { fetchClientBonuses } = await import('./api'); 
//                 const res = await fetchClientBonuses(currentUser.id);
//                 const updatedUser = {
//                   ...currentUser,
//                   bonus_balance: Number(res.data.bonus_balance || 0.0)
//                 };
//                 setCurrentUser(updatedUser);
//                 localStorage.setItem('restaurant_user', JSON.stringify(updatedUser));
//               } catch (e) {
//                 console.error("Ошибка обновления бонусов:", e);
//               }
//             }
//             setIsCheckoutPageOpen(false); 
//           }}
//         />
//       ) : (
//         <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>
          
//           {/* ЛЕВАЯ КОЛОНКА (КАТЕГОРИИ) */}
//           <aside style={{ width: '22%', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
//             <h3 style={{ marginTop: 0, borderBottom: '2px solid #6A1B9A', paddingBottom: '5px' }}>Категории</h3>
//             <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
//               {categories.map((cat, i) => (
//                 <li key={i} style={{ marginBottom: '8px' }}>
//                   <button 
//                     onClick={() => setSelectedFilter(cat)} 
//                     style={{ width: '100%', textAlign: 'left', padding: '10px 14px', backgroundColor: selectedFilter === cat ? '#E8E0FF' : 'transparent', color: selectedFilter === cat ? '#6A1B9A' : '#555', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: selectedFilter === cat ? 'bold' : 'normal' }}
//                   >
//                     {cat}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </aside>

//           {/* СРЕДНЯЯ КОЛОНКА (МЕНЮ) */}
//           <MenuList 
//             filteredMenu={filteredMenu}
//             loading={loading}
//             selectedFilter={selectedFilter}
//             onAddToCart={addToCart}
//             currentUser={currentUser}
//             setMenuItems={setMenuItems}
//           />
//                     {/* ПРАВАЯ КОЛОНКА (КОРЗИНА) */}
//           <section style={{ width: '25%', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
//             <h3 style={{ marginTop: 0, borderBottom: '2px solid #6A1B9A', paddingBottom: '5px' }}>🛒 Моя корзина</h3>
//             {cart.length === 0 ? <p style={{ color: '#777', textAlign: 'center', padding: '20px 0' }}>Корзина пуста.</p> : (
//               <div>
//                 <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
//                   {cart.map((cartItem) => (
//                     <li key={cartItem.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', fontSize: '14px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', justifyContent: 'space-between' }}>
//                       <div style={{ maxWidth: '65%' }}>
//                         <strong style={{ display: 'block', marginBottom: '4px', color: '#333' }}>{cartItem.item_name}</strong>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
//                           <button onClick={() => decrementCartItem(cartItem.id)} style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>-</button>
//                           <span style={{ fontWeight: 'bold', color: '#555', minWidth: '35px', textAlign: 'center', fontSize: '13px' }}>{cartItem.quantity} шт.</span>
//                           <button onClick={() => addToCart(cartItem)} style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>+</button>
//                         </div>
//                         <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>x {cartItem.price} ₽</div>
//                       </div>
//                       <span style={{ fontWeight: 'bold', color: '#6A1B9A', fontSize: '15px' }}>{cartItem.price * cartItem.quantity} ₽</span>
//                     </li>
//                   ))}
//                 </ul>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '15px', paddingTop: '10px', borderTop: '2px solid #eee' }}>
//                   <span>Сумма:</span><span>{totalCartPrice} ₽</span>
//                 </div>
//                 <button onClick={handleCheckout} style={{ width: '100%', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '11px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Оформить заказ</button>
//               </div>
//             )}
//           </section>

//         </div>
//       )}

//       {/* МОДАЛЬНОЕ ОКНО АВТОРИЗАЦИИ */}
//       {isModalOpen && (
//         <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
//           <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '350px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', position: 'relative' }}>
//             <button onClick={() => { setIsModalOpen(false); clearAuthForm(); }} style={{ position: 'absolute', top: '10px', right: '15px', border: 'none', backgroundColor: 'transparent', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
//             <h3 style={{ marginTop: 0, color: '#6A1B9A', textAlign: 'center' }}>{isRegisterMode ? 'Регистрация' : 'Вход в аккаунт'}</h3>
//             {authError && <p style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>{authError}</p>}
//             <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
//               {isRegisterMode && <input type="text" placeholder="Ваше полное имя (ФИО)" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />}
//               <input type="text" placeholder="Номер телефона" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
//               <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
//               <button type="submit" style={{ backgroundColor: '#6A1B9A', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{isRegisterMode ? 'Зарегистрироваться' : 'Войти'}</button>
//             </form>
//             <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginTop: '20px' }}>
//               {isRegisterMode ? 'Уже есть аккаунт?' : 'Впервые у нас?'} {' '}
//               <span onClick={() => { setIsRegisterMode(!isRegisterMode); setAuthError(''); }} style={{ color: '#6A1B9A', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>{isRegisterMode ? 'Войти' : 'Создать аккаунт'}</span>
//             </p>
//           </div>
//         </div>
//       )}
//       {/* КОМПОНЕНТ ЛИЧНОГО КАБИНЕТА */}
//       <UserProfileModal 
//         currentUser={currentUser} 
//         isOpen={isCabinetOpen} 
//         onClose={() => setIsCabinetOpen(false)} 
//         onUserUpdate={(updatedUser) => setCurrentUser(updatedUser)} 
//         addToCart={addToCart}
//         setMenuItems={setMenuItems}
//       />

//       {/* ОКОШКО: АКТИВНЫЕ ЗАКАЗЫ */}
//       {isActiveOrdersOpen && (
//         <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
//           <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', width: '420px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', position: 'relative' }}>
            
//             <button 
//               onClick={() => setIsActiveOrdersOpen(false)} 
//               style={{ position: 'absolute', top: '10px', right: '15px', border: 'none', backgroundColor: 'transparent', fontSize: '20px', cursor: 'pointer' }}
//             >
//               &times;
//             </button>

//             <h3 style={{ marginTop: 0, color: '#6A1B9A', textAlign: 'center' }}>🔔 Ваши активные заказы</h3>
            
//             <div style={{ maxHeight: '250px', overflowY: 'auto', marginTop: '15px' }}>
//               {activeOrders.length === 0 ? (
//                 <p style={{ color: '#777', textAlign: 'center', padding: '15px 0' }}>У вас нет активных заказов</p>
//               ) : (
//                 <ul style={{ padding: 0, listStyle: 'none', margin: 0 }}>
//                   {activeOrders.map((order, i) => (
//                     <li key={i} style={{ padding: '12px', borderBottom: '1px solid #eee', backgroundColor: '#f9f6ff', borderRadius: '6px', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      
//                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
//                         <span>📦 Заказ №{order.order_id}</span>
//                         <span style={{ color: '#FF4081' }}>{order.status === 'CREATED' ? 'В обработке' : order.status}</span>
//                       </div>
                      
//                       <div style={{ fontSize: '13px', color: '#666', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
//                         <span>Сумма к оплате:</span>
//                         <span style={{ fontWeight: 'bold', color: '#6A1B9A', fontSize: '15px' }}>{order.total} ₽</span>
//                       </div>

//                       {/* НАДЁЖНОЕ ОТОБРАЖЕНИЕ СПОСОБА ОПЛАТЫ ИЗ ПОЛЯ С БЭКЕНДА DJANGO */}
//                       <div style={{ 
//                         fontSize: '13px', 
//                         marginTop: '6px', 
//                         borderTop: '1px dashed #e0e0e0', 
//                         paddingTop: '6px',
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         fontWeight: '600',
//                         color: order.payment_text === 'Оплачено' ? '#4CAF50' : '#FF9800'
//                       }}>
//                         <span>Способ оплаты:</span>
//                         <span>
//                           {order.payment_text === 'Оплачено' ? '✅ ' : '💵 '}
//                           {order.payment_text || 'В обработке'}
//                         </span>
//                       </div>

//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default AppShow;



import React, { useState } from 'react';
import Header from './components/Header';               
import MenuList from './components/MenuList';           
import UserProfileModal from './components/UserProfileModal'; 
import CheckoutPage from './components/CheckoutPage';

const AppShow = (props) => {
  const {
    currentUser, setCurrentUser, cart, setCart, totalCartPrice,
    setMenuItems, filteredMenu, categories, selectedFilter, setSelectedFilter,
    loading, isCheckoutPageOpen, setIsCheckoutPageOpen, isModalOpen, setIsModalOpen,
    isCabinetOpen, setIsCabinetOpen, isActiveOrdersOpen, setIsActiveOrdersOpen, activeOrders,
    isRegisterMode, setIsRegisterMode, phone, setPhone, fullName, setFullName,
    password, setPassword, authError, handleLogout, handleOpenActiveOrders,
    addToCart, decrementCartItem, handleAuthSubmit, handleCheckout, clearAuthForm
  } = props;

  // --- СОСТОЯНИЯ ДЛЯ РАЗВОРАЧИВАНИЯ АКТИВНОГО ЗАКАЗА ---
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  // Функция-обработчик нажатия на номер заказа
  const handleOrderClick = async (orderId) => {
    if (!orderId) return;
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      setOrderDetails(null);
      return;
    }
    setExpandedOrderId(orderId);
    setOrderDetails(null);
    
    try {
      // Подгружаем метод запроса к API
      const { fetchOrderDetails } = await import('./api'); 
      const res = await fetchOrderDetails(orderId);
      setOrderDetails(res.data || res);
    } catch (e) {
      console.error("Ошибка при получении состава активного заказа:", e);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      
      {/* КОМПОНЕНТ ШАПКИ */}
      <Header 
        currentUser={currentUser}
        onAuthClick={() => setIsModalOpen(true)}
        onProfileClick={() => setIsCabinetOpen(true)}
        onLogout={handleLogout}
        onActiveOrdersClick={handleOpenActiveOrders}
      />

      {/* ПЕРЕКЛЮЧАТЕЛЬ ЭКРАНОВ: ОФОРМЛЕНИЕ ИЛИ ГЛАВНОЕ МЕНЮ */}
      {isCheckoutPageOpen ? (
        <CheckoutPage 
          currentUser={currentUser}
          cart={cart}
          totalCartPrice={totalCartPrice}
          onCancel={() => setIsCheckoutPageOpen(false)}
          onOrderSuccess={async () => {
            setCart([]); 
            localStorage.removeItem('restaurant_cart'); 
            localStorage.removeItem('restaurant_checkout_active'); 
            
            if (currentUser) {
              try {
                const { fetchClientBonuses } = await import('./api'); 
                const res = await fetchClientBonuses(currentUser.id);
                const updatedUser = {
                  ...currentUser,
                  bonus_balance: Number(res.data.bonus_balance || 0.0)
                };
                setCurrentUser(updatedUser);
                localStorage.setItem('restaurant_user', JSON.stringify(updatedUser));
              } catch (e) {
                console.error("Ошибка обновления бонусов:", e);
              }
            }
            setIsCheckoutPageOpen(false); 
          }}
        />
      ) : (
        <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>
          
          {/* ЛЕВАЯ КОЛОНКА (КАТЕГОРИИ) */}
          <aside style={{ width: '22%', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
            <h3 style={{ marginTop: 0, borderBottom: '2px solid #6A1B9A', paddingBottom: '5px' }}>Категории</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {categories.map((cat, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>
                  <button 
                    onClick={() => setSelectedFilter(cat)} 
                    style={{ width: '100%', textAlign: 'left', padding: '10px 14px', backgroundColor: selectedFilter === cat ? '#E8E0FF' : 'transparent', color: selectedFilter === cat ? '#6A1B9A' : '#555', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: selectedFilter === cat ? 'bold' : 'normal' }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* СРЕДНЯЯ КОЛОНКА (МЕНЮ) */}
          <MenuList 
            filteredMenu={filteredMenu}
            loading={loading}
            selectedFilter={selectedFilter}
            onAddToCart={addToCart}
            currentUser={currentUser}
            setMenuItems={setMenuItems}
          />
          {/* ПРАВАЯ КОЛОНКА (КОРЗИНА) */}
          <section style={{ width: '25%', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
            <h3 style={{ marginTop: 0, borderBottom: '2px solid #6A1B9A', paddingBottom: '5px' }}>🛒 Моя корзина</h3>
            {cart.length === 0 ? <p style={{ color: '#777', textAlign: 'center', padding: '20px 0' }}>Корзина пуста.</p> : (
              <div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 15px 0' }}>
                  {cart.map((cartItem) => (
                    <li key={cartItem.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', fontSize: '14px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', justifyContent: 'space-between' }}>
                      <div style={{ maxWidth: '65%' }}>
                        <strong style={{ display: 'block', marginBottom: '4px', color: '#333' }}>{cartItem.item_name}</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                          <button onClick={() => decrementCartItem(cartItem.id)} style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>-</button>
                          <span style={{ fontWeight: 'bold', color: '#555', minWidth: '35px', textAlign: 'center', fontSize: '13px' }}>{cartItem.quantity} шт.</span>
                          <button onClick={() => addToCart(cartItem)} style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>+</button>
                        </div>
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>x {cartItem.price} ₽</div>
                      </div>
                      <span style={{ fontWeight: 'bold', color: '#6A1B9A', fontSize: '15px' }}>{cartItem.price * cartItem.quantity} ₽</span>
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '15px', paddingTop: '10px', borderTop: '2px solid #eee' }}>
                  <span>Сумма:</span><span>{totalCartPrice} ₽</span>
                </div>
                <button onClick={handleCheckout} style={{ width: '100%', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '11px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Оформить заказ</button>
              </div>
            )}
          </section>

        </div>
      )}

      {/* МОДАЛЬНОЕ ОКНО АВТОРИЗАЦИИ */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '350px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button onClick={() => { setIsModalOpen(false); clearAuthForm(); }} style={{ position: 'absolute', top: '10px', right: '15px', border: 'none', backgroundColor: 'transparent', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
            <h3 style={{ marginTop: 0, color: '#6A1B9A', textAlign: 'center' }}>{isRegisterMode ? 'Регистрация' : 'Вход в аккаунт'}</h3>
            {authError && <p style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>{authError}</p>}
            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              {isRegisterMode && <input type="text" placeholder="Ваше полное имя (ФИО)" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />}
              <input type="text" placeholder="Номер телефона" value={phone} onChange={(e) => setPhone(e.target.value)} required pattern="\+\d{11}" maxLength="12" title="начать с +" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" title="минимум 6 символов" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <button type="submit" style={{ backgroundColor: '#6A1B9A', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{isRegisterMode ? 'Зарегистрироваться' : 'Войти'}</button>
            </form>
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginTop: '20px' }}>
              {isRegisterMode ? 'Уже есть аккаунт?' : 'Впервые у нас?'} {' '}
              <span onClick={() => { setIsRegisterMode(!isRegisterMode); setAuthError(''); }} style={{ color: '#6A1B9A', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>{isRegisterMode ? 'Войти' : 'Создать аккаунт'}</span>
            </p>
          </div>
        </div>
      )}
      {/* КОМПОНЕНТ ЛИЧНОГО КАБИНЕТА */}
      <UserProfileModal 
        currentUser={currentUser} 
        isOpen={isCabinetOpen} 
        onClose={() => setIsCabinetOpen(false)} 
        onUserUpdate={(updatedUser) => setCurrentUser(updatedUser)} 
        addToCart={addToCart}
        setMenuItems={setMenuItems}
      />

      {/* ОКОШКО: АКТИВНЫЕ ЗАКАЗЫ (ОБНОВЛЕНО ДЛЯ ОТОБРАЖЕНИЯ СОСТАВА) */}
      {isActiveOrdersOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', width: '420px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', position: 'relative' }}>
            
            <button 
              onClick={() => { setIsActiveOrdersOpen(false); setExpandedOrderId(null); setOrderDetails(null); }} 
              style={{ position: 'absolute', top: '10px', right: '15px', border: 'none', backgroundColor: 'transparent', fontSize: '20px', cursor: 'pointer' }}
            >
              &times;
            </button>

            <h3 style={{ marginTop: 0, color: '#6A1B9A', textAlign: 'center' }}>🔔 Ваши активные заказы</h3>
            
            <div style={{ maxHeight: '350px', overflowY: 'auto', marginTop: '15px' }}>
              {activeOrders.length === 0 ? (
                <p style={{ color: '#777', textAlign: 'center', padding: '15px 0' }}>У вас нет активных заказов</p>
              ) : (
                <ul style={{ padding: 0, listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeOrders.map((order, i) => {
                    const currentId = order.order_id || order.id;
                    const isExpanded = expandedOrderId === currentId;

                    return (
                      <li 
                        key={i} 
                        onClick={() => handleOrderClick(currentId)}
                        style={{ 
                          padding: '12px', 
                          border: '1px solid #eee', 
                          backgroundColor: isExpanded ? '#f7f2ff' : '#f9f6ff', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                          <span>📦 Заказ №{currentId}</span>
                          <span style={{ color: '#FF4081' }}>{order.status === 'CREATED' ? 'В обработке' : order.status}</span>
                        </div>
                        
                        <div style={{ fontSize: '13px', color: '#666', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                          <span>Сумма к оплате:</span>
                          <span style={{ fontWeight: 'bold', color: '#6A1B9A', fontSize: '15px' }}>{order.total || order.total_amount} ₽</span>
                        </div>

                        <div style={{ 
                          fontSize: '13px', 
                          marginTop: '6px', 
                          borderTop: '1px dashed #e0e0e0', 
                          paddingTop: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontWeight: '600',
                          color: order.payment_text === 'Оплачено' ? '#4CAF50' : '#FF9800'
                        }}>
                          <span>Способ оплаты:</span>
                          <span>
                            {order.payment_text === 'Оплачено' ? '✅ ' : '💵 '}
                            {order.payment_text || 'В обработке'}
                          </span>
                        </div>

                        {/* ОТРИСОВКА СОСТАВА БЛЮД ПРЯМО ПОД КАРТОЧКОЙ АКТИВНОГО ЗАКАЗА */}
                        {isExpanded && (
                          <div 
                            onClick={(e) => e.stopPropagation()} 
                            style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #ddd', fontSize: '13px', color: '#555' }}
                          >
                            {!orderDetails ? (
                              <div style={{ textAlign: 'center', color: '#999' }}>🔄 Загрузка состава...</div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <div style={{ fontWeight: 'bold', color: '#6A1B9A' }}>Состав заказа:</div>
                                {orderDetails.items && orderDetails.items.map((item, idx) => (
                                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>• {item.item_name} x {item.quantity}</span>
                                    <span style={{ fontWeight: 'bold' }}>{item.price_at_purchase || item.price} ₽</span>
                                  </div>
                                ))}
                                <div style={{ borderTop: '1px solid #f0f0f0', marginTop: '6px', paddingTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <div>📍 <strong>Адрес:</strong> {orderDetails.info?.full_address || 'Не указан'}</div>
                                  <div>💳 <strong>Оплата:</strong> {orderDetails.info?.payment_method === 'CARD' ? 'Картой' : 'Наличными'}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AppShow;
