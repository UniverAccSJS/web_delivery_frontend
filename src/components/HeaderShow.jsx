import React, { useState } from 'react';

const HeaderShow = (props) => {
  const { 
    currentUser, 
    onAuthClick, 
    onProfileClick, 
    onLogout, 
    onActiveOrdersClick,
    // Новые пропсы из контейнера Header
    expandedOrderId,
    orderDetails,
    onActiveOrderClick
  } = props;

  // Локальное состояние для отображения самого выпадающего списка активных заказов
  const [showActiveDropdown, setShowActiveDropdown] = useState(false);

  // Имитация/получение списка активных заказов из объекта пользователя (или заглушка, если они хранятся в ином месте)
  const activeOrders = currentUser?.active_orders || []; 

  const toggleDropdown = () => {
    setShowActiveDropdown(!showActiveDropdown);
    if (onActiveOrdersClick) onActiveOrdersClick();
  };

  return (
    <header style={{ 
      backgroundColor: '#6A1B9A', 
      padding: '10px 20px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      color: 'white', 
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      position: 'relative'
    }}>
      {/* Левая часть — Логотип */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => window.location.reload()}>
        <span style={{ fontSize: '24px' }}>🍕</span>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: 'white' }}>Ресторан Доставки</h2>
      </div>

      {/* ЦЕНТРАЛЬНАЯ ЧАСТЬ ШАПКИ — КНОПКА АКТИВНЫХ ЗАКАЗОВ */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 1100 }}>
        {currentUser && (
          <>
            <button
              onClick={toggleDropdown}
              style={{
                backgroundColor: '#FF4081',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13.5px',
                boxShadow: '0 2px 8px rgba(255, 64, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: '0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ff2671'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FF4081'}
            >
              🔔 Активные заказы
            </button>
            
          </>
        )}
      </div>

      {/* Правая часть — Профиль / Авторизация */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {currentUser ? (
          <>
            <div 
              onClick={onProfileClick} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', transition: '0.2s' }}
            >
              <span style={{ fontSize: '16px' }}>👤</span>
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{currentUser.full_name}</span>
            </div>
            <button onClick={onLogout} style={{ backgroundColor: '#FF3D00', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
              Выйти
            </button>
          </>
        ) : (
          <button onClick={onAuthClick} style={{ backgroundColor: 'white', color: '#6A1B9A', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            Войти в аккаунт
          </button>
        )}
      </div>
    </header>
  );
};

export default HeaderShow;
