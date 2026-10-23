import React from 'react';
import { toggleFavorite } from '../api';
import MenuListShow from './MenuListShow';

const MenuList = (props) => {
  const { filteredMenu, loading, selectedFilter, onAddToCart, currentUser, setMenuItems } = props;
  
  const handleFavoriteClick = (item) => {
    if (!currentUser) {
      alert("Пожалуйста, войдите в аккаунт, чтобы добавлять блюда в избранное!");
      return;
    }

    const isCurrentFavorite = item.is_favorite;
    const action = isCurrentFavorite ? 'REMOVE' : 'ADD';

    // Мгновенно обновляем стейт в App.jsx
    setMenuItems(prevItems => 
      prevItems.map(menuItem => 
        menuItem.id === item.id ? { ...menuItem, is_favorite: !isCurrentFavorite } : menuItem
      )
    );

    toggleFavorite({
      client_id: currentUser.id,
      item_id: item.id,
      action: action
    }).catch(err => {
      console.error("Ошибка СУБД:", err);
      setMenuItems(prevItems => 
        prevItems.map(menuItem => 
          menuItem.id === item.id ? { ...menuItem, is_favorite: isCurrentFavorite } : menuItem
        )
      );
    });
  };

  // Передаем абсолютно все пропсы дальше во View, включая currentUser и setMenuItems
  return (
    <MenuListShow 
      {...props} 
      handleFavoriteClick={handleFavoriteClick}
    />
  );
};

export default MenuList;
