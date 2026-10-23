import React from 'react';
import { deleteClientProfile } from '../api';

const UserProfileModalShow = (props) => {
  const {
    currentUser, isOpen, onClose, liveBonusBalance, addresses, orderHistory, clientCards,
    favoriteItems, orderDetails, expandedOrderId, isDropdownOpen, setIsDropdownOpen, showAddForm,
    setShowAddForm, editingAddressId, addrLabel, setAddrLabel, addrFull, setAddrFull, addrComment,
    setAddrComment, isCardsDropdownOpen, setIsCardsDropdownOpen, showAddCardForm, setShowAddCardForm,
    newCardSystem, setNewCardSystem, newCardNumber, setNewCardNumber, newCardExpiry, setNewCardExpiry,
    isFavoritesOpen, setIsFavoritesOpen, isHistoryOpen, setIsHistoryOpen, isEditModalOpen, setIsEditModalOpen,
    newName, setNewName, newPhone, setNewPhone, editError, handleOrderClick, handleSaveAddress,
    resetAddressForm, handleDeleteAddress, startEditAddress, handleAddCardSubmit, handleDeleteCard, 
    handleUpdateProfileSubmit, handleDownloadReceipt,
    handleRemoveFavorite, handleAddToOrder, 
    formatMaskedNumber
  } = props;


  if (!isOpen || !currentUser) return null;

  const getMarkerColor = (label) => {
    if (label === 'Дом') return '#4CAF50';
    if (label === 'Работа') return '#FFC107';
    return '#9E9E9E';
  };

  return (
    <>
      {/* ГЛАВНОЕ ОКНО ЛИЧНОГО КАБИНЕТА */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '450px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', position: 'relative' }}>
          
          <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '20px', border: 'none', backgroundColor: 'transparent', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
          
          <h2 style={{ marginTop: 0, color: '#6A1B9A', textAlign: 'center', fontSize: '20px' }}>⚙️ Личный кабинет</h2>
          
          <div style={{ textAlign: 'center', margin: '20px 0', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
            <div style={{ fontSize: '40px', marginBottom: '5px' }}>👤</div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '800', color: '#333', letterSpacing: '-0.5px' }}>{currentUser.full_name}</h1>
            <p style={{ margin: '0 0 10px 0', color: '#777', fontSize: '15px', fontWeight: 'bold' }}>📱 {currentUser.phone_number || 'Не указан'}</p>
            
            <div style={{ backgroundColor: '#E8E0FF', padding: '6px 16px', borderRadius: '20px', color: '#6A1B9A', fontWeight: 'bold', fontSize: '15px', display: 'inline-block', marginBottom: '15px' }}>
              💰 Мой баланс: {currentUser.bonus_balance || 0} ₽
            </div>
            <br />
            <button onClick={() => setIsEditModalOpen(true)} style={{ backgroundColor: '#fff', color: '#6A1B9A', border: '1px solid #6A1B9A', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>✏️ Редактировать профиль</button>
          </div> 

          {/* БЛОК УПРАВЛЕНИЯ АДРЕСАМИ */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#333' }}>📍 Мои адреса доставки:</label>
            <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ padding: '11px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: '#fcfcfc', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Посмотреть список адресов ({addresses.length})</span>
              <span>{isDropdownOpen ? '▲' : '▼'}</span>
            </div>

            {isDropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', zIndex: 1050, maxHeight: '220px', overflowY: 'auto' }}>
                <div onClick={() => { setShowAddForm(true); setEditingAddressId(null); setIsDropdownOpen(false); }} style={{ padding: '10px 12px', borderBottom: '1px solid #eee', color: '#4CAF50', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f9fff9' }}>
                  ➕ Добавить новый адрес
                </div>

                {addresses.length === 0 ? (
                  <div style={{ padding: '12px', color: '#777', textAlign: 'center', fontSize: '13px' }}>Адреса не найдены в БД</div>
                ) : (
                  addresses.map((addr) => (
                    <div key={addr.id} style={{ padding: '10px 12px', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '75%' }}>
                        <span style={{ minWidth: '10px', height: '10px', backgroundColor: getMarkerColor(addr.address_label), borderRadius: '50%', display: 'inline-block' }} />
                        <span style={{ color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <strong>[{addr.address_label || 'Дом'}]:</strong> {addr.full_address}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="button" onClick={(e) => startEditAddress(addr, e)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#6A1B9A', padding: '2px' }}>✏️</button>
                        <button type="button" onClick={(e) => handleDeleteAddress(addr.id, e)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#f44336', padding: '2px', fontWeight: 'bold' }}>&times;</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          {/* ФОРМА АДРЕСА */}
          {showAddForm && (
            <form onSubmit={handleSaveAddress} style={{ backgroundColor: '#fcfaff', padding: '15px', borderRadius: '8px', border: '1px solid #E8E0FF', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#6A1B9A' }}>{editingAddressId ? '✏️ Редактирование адреса' : '➕ Добавление нового адреса'}</h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Метка:</label>
                <select value={addrLabel} onChange={(e) => setAddrLabel(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'white' }}>
                  <option value="Дом">Дом 🟢</option>
                  <option value="Работа">Работа 🟡</option>
                  <option value="Другое">Другое ⚪</option>
                </select>
              </div>
              <input type="text" placeholder="Введите адрес (Улица, дом, квартира)" value={addrFull} onChange={(e) => setAddrFull(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px', boxSizing: 'border-box' }} />
              <input type="text" placeholder="Комментарий для курьера (необязательно)" value={addrComment} onChange={(e) => setAddrComment(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Сохранить</button>
                <button type="button" onClick={resetAddressForm} style={{ flex: 1, backgroundColor: '#9E9E9E', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Отмена</button>
              </div>
            </form>
          )}

          {/* БЛОК УПРАВЛЕНИЯ КАРТАМИ */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#333' }}>💳 Мои банковские карты:</label>
            <div onClick={() => { setIsCardsDropdownOpen(!isCardsDropdownOpen); setIsDropdownOpen(false); }} style={{ padding: '11px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: '#fcfcfc', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Посмотреть список карт ({clientCards.length})</span>
              <span>{isCardsDropdownOpen ? '▲' : '▼'}</span>
            </div>

            {isCardsDropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', zIndex: 1050, maxHeight: '220px', overflowY: 'auto' }}>
                <div onClick={() => { setShowAddCardForm(true); setIsCardsDropdownOpen(false); }} style={{ padding: '10px 12px', borderBottom: '1px solid #eee', color: '#4CAF50', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f9fff9' }}>
                  ➕ Привязать новую карту
                </div>
                {!Array.isArray(clientCards) ? (
                  <div style={{ padding: '12px', color: '#f44336', textAlign: 'center', fontSize: '13px' }}>Ошибка формата данных СУБД</div>
                ) : clientCards.length === 0 ? (
                  <div style={{ padding: '12px', color: '#777', textAlign: 'center', fontSize: '13px' }}>Нет привязанных карт</div>
                ) : (
                  clientCards.map((card) => (
                    <div key={card.id} style={{ padding: '10px 12px', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '75%' }}>
                        <span style={{ minWidth: '10px', height: '10px', backgroundColor: '#6A1B9A', borderRadius: '50%', display: 'inline-block' }} />
                        <span style={{ color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <strong>[{card.payment_system || 'Карта'}]:</strong> {formatMaskedNumber(card.masked_number) || '••••'} <span style={{ color: '#888', fontSize: '12px' }}></span>
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="button" onClick={(e) => handleDeleteCard(card.id, e)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#f44336', padding: '2px', fontWeight: 'bold' }}>&times;</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* ФОРМА БАНКОВСКОЙ КАРТЫ */}
          {showAddCardForm && (
            <form onSubmit={handleAddCardSubmit} style={{ backgroundColor: '#fcfaff', padding: '15px', borderRadius: '8px', border: '1px solid #E8E0FF', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#6A1B9A' }}>➕ Привязка новой карты</h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Система:</label>
                <select value={newCardSystem} onChange={(e) => setNewCardSystem(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'white' }}>
                  <option value="MIR">МИР</option>
                  <option value="VISA">Visa</option>
                  <option value="MASTERCARD">MasterCard</option>
                </select>
              </div>
              <input type="text" placeholder="Номер карты (16 цифр)" maxLength="16" value={newCardNumber} onChange={(e) => setNewCardNumber(e.target.value)} pattern="\d{16}" title="Введите корректный номер карты" required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px', boxSizing: 'border-box' }} />
              {/*<input type="text" placeholder="Срок действия (ММ/ГГ)" maxLength="5" value={newCardExpiry} onChange={(e) => setNewCardExpiry(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px', boxSizing: 'border-box' }} />*/}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Сохранить</button>
                <button type="button" onClick={() => setShowAddCardForm(false)} style={{ flex: 1, backgroundColor: '#9E9E9E', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Отмена</button>
              </div>
            </form>
          )}

          {/* НИЖНИЕ КНОПКИ ГЛАВНОГО ОКНА ЛК */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
            <button type="button" onClick={() => setIsFavoritesOpen(true)} style={{ flex: 1, backgroundColor: '#FF4081', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>❤️ Избранное</button>
            <button type="button" onClick={() => setIsHistoryOpen(true)} style={{ flex: 1, backgroundColor: '#6A1B9A', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>📜 История заказов</button>
          </div>

        </div>
      </div>
      {/* МОДАЛКА: РЕДАКТИРОВАНИЕ ПРОФИЛЯ */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', width: '380px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', position: 'relative' }}>
            <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ position: 'absolute', top: '10px', right: '15px', border: 'none', backgroundColor: 'transparent', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
            <h3 style={{ marginTop: 0, color: '#6A1B9A', textAlign: 'center' }}>✏️ Редактирование профиля</h3>
            {editError && <p style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>{editError}</p>}
            <form onSubmit={handleUpdateProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Ваше имя (ФИО):</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Номер телефона:</label>
                <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} required pattern="\+\d{11}" maxLength="12" title="номер телефона должен состоять из 11 цифр и начинаться с +" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '11px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>💾 Сохранить</button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ flex: 1, backgroundColor: '#9E9E9E', color: 'white', border: 'none', padding: '11px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Отмена</button>
              </div>
              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px dashed #e0e0e0', textAlign: 'center' }}>
                <button type="button" onClick={() => { if (window.confirm("⚠️ Вы уверены?") && window.confirm("🔴 Подтверждаете?")) deleteClientProfile(currentUser.id).then(() => { alert("Удален."); localStorage.clear(); window.location.reload(); }); }} style={{ width: '100%', backgroundColor: '#fff', color: '#f44336', border: '1px solid #f44336', padding: '9px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>🗑️ Удалить профиль</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* МОДАЛКА: ИСТОРИЯ ЗАКАЗОВ */}
      {isHistoryOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', width: '420px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', position: 'relative' }}>
            <button type="button" onClick={() => { setIsHistoryOpen(false); setExpandedOrderId(null); }} style={{ position: 'absolute', top: '10px', right: '15px', border: 'none', backgroundColor: 'transparent', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
            <h3 style={{ marginTop: 0, color: '#6A1B9A', textAlign: 'center' }}>📜 История ваших заказов</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '15px' }}>
              {orderHistory.length === 0 ? (
                <p style={{ color: '#777', textAlign: 'center' }}>У вас пока нет заказов</p>
              ) : (
                <ul style={{ padding: 0, listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {orderHistory.map((order, i) => {
                    const currentId = order.id || order.order_id;
                    const isExpanded = expandedOrderId === currentId;
                    const isFinished = order.order_status === 'DELIVERED';
                    return (
                      <li key={i} onClick={() => handleOrderClick(currentId)} style={{ padding: '12px', border: '1px solid #eee', borderRadius: '8px', display: 'flex', flexDirection: 'column', fontSize: '14.5px', color: '#333', cursor: 'pointer', backgroundColor: isExpanded ? '#f7f2ff' : 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: '600' }}>Заказ №{currentId}</span>
                            {isFinished && (
                              <button type="button" onClick={(e) => handleDownloadReceipt(currentId, e)} style={{ backgroundColor: '#E8E0FF', color: '#6A1B9A', border: '1px solid #6A1B9A', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>📥 Чек</button>
                            )}
                          </div>
                          <span style={{ fontWeight: 'bold' }}>{order.total_amount} ₽ <span style={{ fontSize: '12px', color: '#6A1B9A' }}>({order.order_status || 'Создан'})</span></span>
                        </div>


                        {isExpanded && (
                          <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #ddd', fontSize: '13px', color: '#555' }}>
                            {!orderDetails ? (
                              <div style={{ textAlign: 'center', color: '#999' }}>🔄 Загрузка...</div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <div style={{ fontWeight: 'bold', color: '#6A1B9A' }}>Состав заказа:</div>
                                {orderDetails.items && orderDetails.items.map((item, idx) => (
                                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>• {item.item_name} x {item.quantity}</span>
                                    <span style={{ fontWeight: 'bold' }}>{item.price_at_purchase} ₽</span>
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

      {/* ВСПЛЫВАЮЩЕЕ ОКОШКО: ИЗБРАННОЕ (ОБНОВЛЕННЫЙ БЛОК С КНОПКАМИ КРЕСТИКА И КОРЗИНЫ) */}
      {isFavoritesOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', width: '430px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', position: 'relative' }}>
            <button type="button" onClick={() => setIsFavoritesOpen(false)} style={{ position: 'absolute', top: '10px', right: '15px', border: 'none', backgroundColor: 'transparent', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
            <h3 style={{ marginTop: 0, color: '#FF4081', textAlign: 'center' }}>❤️ Любимые блюда</h3>
            
            <div style={{ maxHeight: '280px', overflowY: 'auto', marginTop: '15px' }}>
              {!favoriteItems || favoriteItems.length === 0 ? (
                <p style={{ color: '#777', textAlign: 'center', padding: '15px 0' }}>Список избранного пуст. Нажмите сердечко у блюда!</p>
              ) : (
                <ul style={{ padding: 0, listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {favoriteItems.map((item, i) => (
                    <li key={i} style={{ padding: '12px', border: '1px solid #f0f0f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14.5px', color: '#333', backgroundColor: '#fff' }}>
                      
                      {/* Инфо о блюде */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '50%' }}>
                        <span style={{ fontSize: '15px' }}>🍕 <strong>{item.item_name}</strong></span>
                        <span style={{ fontWeight: 'bold', color: '#6A1B9A', fontSize: '14px' }}>{item.price || 0} ₽</span>
                      </div>

                      {/* КНОПКИ УПРАВЛЕНИЯ */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1200 }}>
                        
                        {/* Кнопка "В корзину" */}
                        <button
                          type="button"
                          onClick={() => {
                            console.log("🛒 Клик по кнопке КОРЗИНЫ в ЛК!");
                            if (typeof handleAddToOrder === 'function') {
                              handleAddToOrder(item);
                            } else if (typeof props.handleAddToOrder === 'function') {
                              props.handleAddToOrder(item);
                            } else {
                              console.error("🚨 Функция handleAddToOrder не передана в пропсы!");
                            }
                          }}
                          title="Добавить в корзину"
                          style={{ backgroundColor: '#6A1B9A', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          🛒 <span style={{ fontSize: '11.5px' }}>В корзину</span>
                        </button>

                        {/* Кнопка "Удалить" (Крестик) */}
                        <button
                          type="button"
                          onClick={() => {
                            console.log("❌ ЖЕСТКИЙ КЛИК ПО КРЕСТИКУ УДАЛЕНИЯ! Данные объекта:", item);
                            if (typeof handleRemoveFavorite === 'function') {
                              handleRemoveFavorite(item);
                            } else if (typeof props.handleRemoveFavorite === 'function') {
                              props.props.handleRemoveFavorite(item);
                            } else {
                              console.error("🚨 Функция handleRemoveFavorite не найдена в пропсах!");
                            }
                          }}
                          title="Убрать из избранного"
                          style={{ backgroundColor: '#fff', color: '#f44336', border: '1px solid #f44336', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          &times;
                        </button>
                      </div>

                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default UserProfileModalShow;
