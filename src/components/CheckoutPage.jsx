import React, { useState, useEffect } from 'react';
// import { fetchClientAddresses, createOrder } from '../api';
import { fetchClientAddresses, createOrder, fetchClientBonuses, fetchClientCards } from '../api';

const CheckoutPage = ({ currentUser, cart, totalCartPrice, onOrderSuccess, onCancel }) => {
  const [dbBonusBalance, setDbBonusBalance] = useState(0);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH'); // CASH или CARD для payment_method_enum
  const [bonusesToSpend, setBonusesToSpend] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Подгружаем реальные адреса клиента из PostgreSQL для селекта
  useEffect(() => {
    if (currentUser) {
      fetchClientAddresses(currentUser.id)
        .then(res => {
          const list = res.data || [];
          setAddresses(list);
          if (list.length > 0) setSelectedAddressId(list[0].id);
        })
        .catch(console.error);
    }
  }, [currentUser]);

    useEffect(() => {
      if (currentUser) {
        fetchClientBonuses(currentUser.id)
          .then(res => {
            let freshBalance = 0;
            if (res.data && typeof res.data === 'object') {
              freshBalance = Number(res.data.bonus_balance !== undefined ? res.data.bonus_balance : (res.data.get_client_bonus_balance || 0));
            } else if (res.data !== undefined) {
              freshBalance = Number(res.data);
            }
            setDbBonusBalance(freshBalance);
          })
          .catch(console.error);
      }
    }, [currentUser]);



      // 1. Новые состояния для карт (добавить к существующим useState)
  const [clientCards, setClientCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState('');

  // 2. Загрузка списка карт при монтировании страницы (добавить внутрь существующего useEffect)
  useEffect(() => {
    if (currentUser) {
      fetchClientCards(currentUser.id)
        .then(res => {
          const dataFromDb = res && res.data !== undefined ? res.data : res;
          setClientCards(Array.isArray(dataFromDb) ? dataFromDb : []);
        })
        .catch(err => {
          console.error("Ошибка получения карт для оформления заказа:", err);
          setClientCards([]);
        });
    }
  }, [currentUser]);


  const handleFinalCheckout = (e) => {
    e.preventDefault();
    if (!selectedAddressId) {
      alert("Пожалуйста, выберите или добавьте адрес доставки в личном кабинете!");
      return;
    }

    // Защита от двойного списания бонусов кустарным вводом
    const maxBonuses = Math.min(currentUser.bonus_balance || 0, totalCartPrice);
    const validBonuses = Math.max(0, Math.min(maxBonuses, Number(bonusesToSpend)));

    setIsSubmitting(true);

    const payload = {
      client_id: currentUser.id,
      cart_items: cart, // Передаем корзину (Django внутри сам вызовет manage_cart циклом)
      address_id: Number(selectedAddressId),
      district_id: 1, // Дефолтный район, как заложено в твоем CreateOrderView
      payment_method: paymentMethod, // 'CASH' или 'CARD'
      card_id: paymentMethod === 'CARD' && selectedCardId ? parseInt(selectedCardId) : null,

      bonuses_to_spend: validBonuses
    };

    createOrder(payload)
      .then(res => {
        setIsSubmitting(false);
        if (res.data.success) {
          onOrderSuccess(); // Очистит корзину и вернет на главное меню
        }
      })
      .catch(err => {
        setIsSubmitting(false);
        alert("Ошибка СУБД при оформлении: " + (err.response?.data?.error || err.message));
      });
  };

  const finalPrice = Math.max(0, totalCartPrice - Number(bonusesToSpend));

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginTop: 0, color: '#6A1B9A', textAlign: 'center', borderBottom: '2px solid #6A1B9A', paddingBottom: '10px' }}>
        📦 Оформление заказа
      </h2>

      {/* КРАТКИЙ СОСТАВ ЗАКАЗА */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>Состав заказа:</h4>
        <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14.5px', color: '#333' }}>
          {cart.map(item => (
            <li key={item.id} style={{ marginBottom: '6px' }}>
              <strong>{item.item_name}</strong> — {item.quantity} шт. x {item.price} ₽
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleFinalCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* ВЫБОР АДРЕСА */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#333' }}>📍 Выберите адрес доставки:</label>
          <select 
            value={selectedAddressId} 
            onChange={(e) => setSelectedAddressId(e.target.value)}
            style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: 'white' }}
            required
          >
            {addresses.length === 0 ? (
              <option value="">Адреса не найдены! Добавьте адрес в Личном кабинете</option>
            ) : (
              addresses.map(addr => (
                <option key={addr.id} value={addr.id}>
                  [{addr.address_label || 'Адрес'}]: {addr.full_address}
                </option>
              ))
            )}
          </select>
        </div>

        {/* ВЫБОР МЕТОДА ОПЛАТЫ */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#333' }}>💳 Способ оплаты:</label>
          <div style={{ display: 'flex', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14.5px' }}>
              <input type="radio" name="payment" value="CASH" checked={paymentMethod === 'CASH'} onChange={() => setPaymentMethod('CASH')} />
              Наличными курьеру
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14.5px' }}>
              <input type="radio" name="payment" value="CARD" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} />
              Банковской картой на сайте
            </label>
          </div>
        </div>


        {/* СПИСОК КАРТ: ПОЯВЛЯЕТСЯ ТОЛЬКО ПРИ ВЫБОРЕ ОПЛАТЫ КАРТОЙ */}
        {paymentMethod === 'CARD' && (
          <div style={{ marginTop: '15px', marginBottom: '15px', textAlign: 'left' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px' }}>
              💳 Выберите карту для оплаты:
            </label>
            <select
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                outline: 'none'
              }}
            >
              {clientCards.length === 0 ? (
                <option value="">Нет привязанных карт</option>
              ) : (
                <>
                  <option value="">-- Не выбрана --</option>
                  {clientCards.map((card) => (
                    <option key={card.id} value={card.id}>
                      [{card.payment_system || 'Карта'}] {card.masked_number} {card.expiry_date ? `(${card.expiry_date})` : ''}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        )}



        {/* БОНУСНАЯ СИСТЕМА ИЗ СУБД-ФУНКЦИИ */}
        <div style={{ backgroundColor: '#E8E0FF', padding: '15px', borderRadius: '8px', border: '1px solid #6A1B9A' }}>
          <div style={{ fontWeight: 'bold', color: '#6A1B9A', marginBottom: '5px', fontSize: '15px' }}>
            💰 Доступно бонусов: {dbBonusBalance} ₽
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '12.5px', color: '#555' }}>
            Вы можете оплатить бонусами до 100% от суммы заказа.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: '#333' }}>Списать бонусов:</span>
            <input 
              type="number" 
              min="0"
              max={Math.min(dbBonusBalance, totalCartPrice)}
              value={bonusesToSpend}
              onChange={(e) => setBonusesToSpend(e.target.value)}
              style={{ width: '100px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
            />
          </div>
        </div>


        {/* ИТОГОВАЯ СУММА */}
        <div style={{ borderTop: '2px solid #eee', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '15px', color: '#666', display: 'block' }}>Сумма заказа: {totalCartPrice} ₽</span>
            {Number(bonusesToSpend) > 0 && <span style={{ fontSize: '14px', color: '#f44336', display: 'block' }}>Скидка по бонусам: -{bonusesToSpend} ₽</span>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>Итого к оплате:</span>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#6A1B9A' }}>{finalPrice} ₽</div>
          </div>
        </div>

        {/* КНОПКИ ДЕЙСТВИЯ */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
          <button 
            type="submit" 
            disabled={isSubmitting || addresses.length === 0}
            style={{ flex: 2, backgroundColor: addresses.length === 0 ? '#ccc' : '#4CAF50', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', cursor: addresses.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px' }}
          >
            {isSubmitting ? 'Оформление в PostgreSQL...' : '🚀 Подтвердить заказ'}
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            style={{ flex: 1, backgroundColor: '#9E9E9E', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
          >
            Вернуться назад
          </button>
        </div>

      </form>
    </div>
  );
};

export default CheckoutPage;
