import React, { useState, useEffect } from 'react';
// import { baseURL } from '../api'

import { 
  fetchClientAddresses, fetchClientHistory, manageClientAddress, 
  updateClientProfile, fetchClientFavorites, deleteClientProfile, 
  fetchClientBonuses, fetchClientCards, manageClientCard, fetchOrderDetails,
  toggleFavorite
} from '../api';

import UserProfileModalShow from './UserProfileModalShow';

// ИСПРАВЛЕНО: Добавлены addToCart и setMenuItems в деструктуризацию пропсов родителя
const UserProfileModal = ({ currentUser, isOpen, onClose, addToCart, setMenuItems }) => {
  // --- Состояния данных ---
  const [clientCards, setClientCards] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [favoriteItems, setFavoritesItems] = useState([]);
  const [liveBonusBalance, setLiveBonusBalance] = useState(0);

  // --- Состояния переключателей UI ---
  const [isCardsDropdownOpen, setIsCardsDropdownOpen] = useState(false);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  // --- Состояния полей ввода ---
  const [addrLabel, setAddrLabel] = useState('Дом');
  const [addrFull, setAddrFull] = useState('');
  const [addrComment, setAddrComment] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [editError, setEditError] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardSystem, setNewCardSystem] = useState('MIR');

  const handleDownloadReceipt = (orderId, e) => {
    e.stopPropagation();
    //const downloadUrl = `http://127.0.0.1:8000/api/orders/${orderId}/receipt/`;  // сервер локалхост
    const downloadUrl = `${baseURL}/api/orders/${orderId}/receipt/`;  // настройка для GP
    window.location.href = downloadUrl;
  };

  // --- Функции загрузки и обработчики (Логика) ---
  const loadClientData = () => {
    if (!currentUser) return;
    fetchClientBonuses(currentUser.id)
      .then(res => {
        let freshBalance = 0;
        if (res.data && typeof res.data === 'object') {
          freshBalance = Number(res.data.bonus_balance !== undefined ? res.data.bonus_balance : (res.data.get_client_bonus_balance || 0));
        } else if (res.data !== undefined) {
          freshBalance = Number(res.data);
        }
        setLiveBonusBalance(freshBalance);
        currentUser.bonus_balance = freshBalance;
        localStorage.setItem('restaurant_user', JSON.stringify(currentUser));
      }).catch(console.error);

    fetchClientAddresses(currentUser.id).then(res => setAddresses(res.data || [])).catch(console.error);
    fetchClientHistory(currentUser.id).then(res => setOrderHistory(res.data || [])).catch(console.error);

    fetchClientFavorites(currentUser.id)
      .then(res => {
        const favData = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        setFavoritesItems(favData);
      })
      .catch(console.error);



    fetchClientCards(currentUser.id).then(res => {
      const dataFromDb = res && res.data !== undefined ? res.data : res;
      setClientCards(Array.isArray(dataFromDb) ? dataFromDb : []);
    }).catch(console.error);
  };

  useEffect(() => {
    if (isOpen && currentUser) loadClientData();
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (isEditModalOpen && currentUser) {
      setNewName(currentUser.full_name || '');
      setNewPhone(currentUser.phone_number || '');
      setEditError('');
    }
  }, [isEditModalOpen, currentUser]);

  const handleOrderClick = (orderId) => {
    if (!orderId) return;
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      setOrderDetails(null);
      return;
    }
    setExpandedOrderId(orderId);
    setOrderDetails(null);
    fetchOrderDetails(orderId).then(res => setOrderDetails(res.data || res)).catch(console.error);
  };

  // ОКОНЧАТЕЛЬНЫЙ ОБРАБОТЧИК: Удаление из избранного с жестким принуждением React к обновлению витрины
  const handleRemoveFavorite = (item) => {
    // В вашем сериализаторе ID блюда лежит строго в поле item!
    const targetId = Number(item.item);

    if (!targetId) {
      console.error("🚨 Не удалось определить ID блюда. Объект:", item);
      return;
    }

    console.log(`🎯 Пытаемся погасить сердечко! Ищем на витрине блюдо с ID = ${targetId}`);

    setFavoritesItems(prev => prev.filter(fav => Number(fav.item) !== targetId));

    setMenuItems(prevItems => {
      const updatedMenu = prevItems.map(menuItem => {
        const currentMenuId = Number(menuItem.id);
        
        if (currentMenuId === targetId) {
          console.log(`✅ Найдено совпадение на витрине для ID ${targetId}! Меняем is_favorite на false.`);
          return { ...menuItem, is_favorite: false };
        }
        return menuItem;
      });
      return [...updatedMenu]; // Принудительное создание новой ссылки на массив для триггера рендера
    });

    // 3. Отправляем запрос на удаление в бэкенд Django
    toggleFavorite({
      client_id: currentUser.id,
      item_id: targetId,
      action: 'REMOVE'
    }).catch(err => {
      console.error("Ошибка при удалении на сервере:", err);
      loadClientData(); // Откатываем в случае сбоя сети
    });
  };




  // НОВЫЙ ОБРАБОТЧИК: Добавление в корзину из избранного
  const handleAddToOrder = (item) => {
    // Конструируем объект блюда под формат корзины
    const productItem = {
      id: item.item || item.id,
      item_name: item.item_name,
      price: item.price
    };
    addToCart(productItem);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    manageClientAddress({
      action: editingAddressId !== null ? 'EDIT' : 'ADD',
      client_id: currentUser.id,
      address_id: editingAddressId,
      address_label: addrLabel,
      full_address: addrFull,
      comment: addrComment
    }).then(() => { loadClientData(); resetAddressForm(); }).catch(err => alert(err.message));
  };

  const resetAddressForm = () => {
    setAddrLabel('Дом'); setAddrFull(''); setAddrComment(''); setShowAddForm(false); setEditingAddressId(null);
  };

  const handleDeleteAddress = (addressId, e) => {
      manageClientAddress({ action: 'DELETE', client_id: currentUser.id, address_id: addressId }).then(() => loadClientData()).catch(console.error);
    // e.stopPropagation();
    // if (window.confirm("Удалить адрес?")) {

    // }
  };

  const startEditAddress = (addr, e) => {
    e.stopPropagation();
    setEditingAddressId(addr.id); setAddrLabel(addr.address_label || 'Дом');
    setAddrFull(addr.full_address || ''); setAddrComment(addr.comment || ''); setShowAddForm(true);
  };

  const handleAddCardSubmit = (e) => {
    e.preventDefault();

    const cleanCardNumber = newCardNumber.replace(/\s+/g, '').replace(/-/g, '');

    const isExactly16Digits = /^\d{16}$/.test(cleanCardNumber);

    if (!isExactly16Digits) {
      // Выводим предупреждение пользователю (можно заменить на красивый стейт ошибки, если он есть)
      alert("Номер карты должен состоять ровно из 16 цифр!");
      return; // Останавливаем выполнение функции, на бэкенд ничего не отправляется
    }

    manageClientCard({
      action: 'ADD', client_id: currentUser.id, payment_system: newCardSystem,
      masked_number: newCardNumber.replace(/\s?/g, '').replace(/(\d{4})\d{8}(\d{4})/, '\$1********\$2'),
    }).then(() => { setNewCardNumber(''); setNewCardExpiry(''); setShowAddCardForm(false); setIsCardsDropdownOpen(true); loadClientData(); }).catch(console.error);
  };

  const handleDeleteCard = (cardId, e) => {
    e.stopPropagation();
    if (window.confirm("Отвязать карту?")) {
      manageClientCard({ action: 'DELETE', client_id: currentUser.id, card_id: cardId }).then(() => loadClientData()).catch(console.error);
    }
  };

  const handleUpdateProfileSubmit = (e) => {
    e.preventDefault();
    const cleanNewPhone = newPhone.replace(/\s+/g, '').replace(/-/g, '');

    const isExactlyCorrectPhone = /^\+\d{11}$/.test(cleanNewPhone);

    if (!isExactlyCorrectPhone) {
      // Выводим предупреждение пользователю (можно заменить на красивый стейт ошибки, если он есть)
      alert("номер телефона должен состоять из 11 цифр и начинаться с + ");
      return; // Останавливаем выполнение функции, на бэкенд ничего не отправляется
    }



    updateClientProfile({ client_id: currentUser.id, full_name: newName, phone_number: cleanNewPhone })
      .then(res => {
        if (res.data.success) {
          currentUser.full_name = newName; currentUser.phone_number = cleanNewPhone;
          localStorage.setItem('restaurant_user', JSON.stringify(currentUser));
          setIsEditModalOpen(false); loadClientData();
        }
      }).catch(() => setEditError('Ошибка сохранения'));
  };

      // Разбивает строку на группы по 4 символа через пробел
  const formatMaskedNumber = (maskedStr) => {
    if (!maskedStr) return '••••';
    const cleanStr = maskedStr.replace(/\s/g, ''); 
   return cleanStr.match(/.{1,4}/g)?.join(' ') || maskedStr;
  };

  return (
    <UserProfileModalShow
      currentUser={currentUser} isOpen={isOpen} onClose={onClose}
      liveBonusBalance={liveBonusBalance} addresses={addresses} orderHistory={orderHistory}
      clientCards={clientCards} favoriteItems={favoriteItems} orderDetails={orderDetails}
      expandedOrderId={expandedOrderId} isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen}
      showAddForm={showAddForm} setShowAddForm={setShowAddForm} editingAddressId={editingAddressId}
      addrLabel={addrLabel} setAddrLabel={setAddrLabel} addrFull={addrFull} setAddrFull={setAddrFull}
      addrComment={addrComment} setAddrComment={setAddrComment} isCardsDropdownOpen={isCardsDropdownOpen}
      setIsCardsDropdownOpen={setIsCardsDropdownOpen} showAddCardForm={showAddCardForm} setShowAddCardForm={setShowAddCardForm}
      newCardSystem={newCardSystem} setNewCardSystem={setNewCardSystem} newCardNumber={newCardNumber}
      setNewCardNumber={setNewCardNumber} newCardExpiry={newCardExpiry} setNewCardExpiry={setNewCardExpiry}
      isFavoritesOpen={isFavoritesOpen} setIsFavoritesOpen={setIsFavoritesOpen} isHistoryOpen={isHistoryOpen}
      setIsHistoryOpen={setIsHistoryOpen} isEditModalOpen={isEditModalOpen} setIsEditModalOpen={setIsEditModalOpen}
      newName={newName} setNewName={setNewName} newPhone={newPhone} setNewPhone={setNewPhone}
      editError={editError} handleOrderClick={handleOrderClick} handleSaveAddress={handleSaveAddress}
      resetAddressForm={resetAddressForm} handleDeleteAddress={handleDeleteAddress} startEditAddress={startEditAddress}
      handleAddCardSubmit={handleAddCardSubmit} handleDeleteCard={handleDeleteCard} handleUpdateProfileSubmit={handleUpdateProfileSubmit}
      handleDownloadReceipt={handleDownloadReceipt}
      
      // ИСПРАВЛЕНИЕ: Передаем обработчики кнопок внутрь презентационного компонента!
      handleRemoveFavorite={handleRemoveFavorite} 
      handleAddToOrder={handleAddToOrder}

      // ИСПРАВЛЕНИЕ: функция вормата маскированного номера перед отображением
      formatMaskedNumber={formatMaskedNumber}

    />
  );

};

export default UserProfileModal;
