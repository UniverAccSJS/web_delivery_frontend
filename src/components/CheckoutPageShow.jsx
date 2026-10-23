import React, { useState, useEffect } from 'react';
import { fetchClientAddresses, createOrder, fetchClientBonuses, fetchClientCards } from '../api';
import CheckoutPageShow from './CheckoutPageShow'; // Импортируем внешний вид

const CheckoutPage = ({ currentUser, cart, totalCartPrice, onOrderSuccess, onCancel }) => {
  const [dbBonusBalance, setDbBonusBalance] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [bonusesToSpend, setBonusesToSpend] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientCards, setClientCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState('');

  // Загрузка адресов доставки
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

  // Загрузка баланса бонусов
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

  // Загрузка банковских карт
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

    const maxBonuses = Math.min(currentUser.bonus_balance || 0, totalCartPrice);
    const validBonuses = Math.max(0, Math.min(maxBonuses, Number(bonusesToSpend)));

    setIsSubmitting(true);

    const payload = {
      client_id: currentUser.id,
      cart_items: cart,
      address_id: Number(selectedAddressId),
      district_id: 1,
      payment_method: paymentMethod,
      card_id: paymentMethod === 'CARD' && selectedCardId ? parseInt(selectedCardId) : null,
      bonuses_to_spend: validBonuses
    };

    createOrder(payload)
      .then(res => {
        setIsSubmitting(false);
        if (res.data.success) {
          onOrderSuccess();
        }
      })
      .catch(err => {
        setIsSubmitting(false);
        alert("Ошибка СУБД при оформлении: " + (err.response?.data?.error || err.message));
      });
  };

  const finalPrice = Math.max(0, totalCartPrice - Number(bonusesToSpend));

  return (
    <CheckoutPageShow
      cart={cart}
      totalCartPrice={totalCartPrice}
      onCancel={onCancel}
      dbBonusBalance={dbBonusBalance}
      addresses={addresses}
      selectedAddressId={selectedAddressId}
      setSelectedAddressId={setSelectedAddressId}
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      bonusesToSpend={bonusesToSpend}
      setBonusesToSpend={setBonusesToSpend}
      isSubmitting={isSubmitting}
      clientCards={clientCards}
      selectedCardId={selectedCardId}
      setSelectedCardId={setSelectedCardId}
      finalPrice={finalPrice}
      handleFinalCheckout={handleFinalCheckout}
    />
  );
};

export default CheckoutPage;
