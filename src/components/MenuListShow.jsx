import React from 'react';

const MenuListShow = (props) => {
  // Добавляем currentUser и filteredMenu в область видимости верстки, чтобы React реагировал на их изменения
  const { filteredMenu, loading, selectedFilter, onAddToCart, handleFavoriteClick, currentUser } = props;

  return (
    <main style={{ width: '53%' }}>
      <h2 style={{ marginTop: 0, color: '#333' }}>Раздел: {selectedFilter}</h2>
      
      {loading ? (
        <p>Загрузка данных из базы данных...</p>
      ) : filteredMenu.length === 0 ? (
        <p style={{ color: '#777' }}>В этой категории пока нет блюд.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredMenu.map((item) => (
            <div key={item.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ maxWidth: '70%', width: '100%' }}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#333' }}>{item.item_name}</h4>
                
                {/* Блок категории (фиолетовый кружок) полностью удален отсюда */}

                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666', lineHeight: '1.4' }}>{item.description || 'Описание готовится шеф-поваром...'}</p>
                <div style={{ fontSize: '12px', color: '#888', display: 'flex', gap: '12px', flexWrap: 'wrap', backgroundColor: '#f5f5f5', padding: '6px 10px', borderRadius: '6px', width: 'fit-content' }}>
                  {item.weight_grams && <span>⚖️ <strong>{item.weight_grams} г</strong></span>}
                  {item.calories && <span>🔥 {item.calories} ккал</span>}
                  {(item.proteins || item.fats || item.carbs) && (
                    <span style={{ color: '#555' }}>(Б: {item.proteins || 0}г | Ж: {item.fats || 0}г | У: {item.carbs || 0}г)</span>
                  )}
                </div>
              </div>

              <div style={{ textAlign: 'right', minWidth: '130px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#6A1B9A', marginBottom: '8px' }}>{item.price} ₽</div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleFavoriteClick(item)}
                    style={{
                      backgroundColor: '#FFF',
                      border: item.is_favorite ? '1px solid #FF4081' : '1px solid #ccc',
                      color: item.is_favorite ? '#FF4081' : '#aaa',
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      boxShadow: item.is_favorite ? '0 2px 6px rgba(255, 64, 129, 0.2)' : 'none',
                      transition: '0.2s'
                    }}
                    title={item.is_favorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                  >
                    {item.is_favorite ? '❤️' : '🤍'}
                  </button>

                  <button onClick={() => onAddToCart(item)} style={{ backgroundColor: '#6A1B9A', color: 'white', border: 'none', padding: '9px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13.5px' }}>
                    В корзину
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MenuListShow;
