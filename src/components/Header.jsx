// import React from 'react';
// import HeaderShow from './HeaderShow';

// import { 
//   fetchClientAddresses, fetchClientHistory, manageClientAddress, 
//   updateClientProfile, fetchClientFavorites, deleteClientProfile, 
//   fetchClientBonuses, fetchClientCards, manageClientCard, fetchOrderDetails,
//   toggleFavorite
// } from '../api';

// const Header = ({ currentUser, onAuthClick, onProfileClick, onLogout, onActiveOrdersClick, expandedOrderId, orderDetails, onOrderClick }) => {
  
//   return (
//     <HeaderShow
//       currentUser={currentUser}
//       onAuthClick={onAuthClick}
//       onProfileClick={onProfileClick}
//       onLogout={onLogout}
//       onActiveOrdersClick={onActiveOrdersClick}
      
//       // Передаем логику раскрытия в презентационный компонент шапки
//       expandedOrderId={expandedOrderId}
//       orderDetails={orderDetails}
//       onOrderClick={onOrderClick}
//     />
//   );
// };

// export default Header;

import React from 'react';
import HeaderShow from './HeaderShow'; 

const Header = ({ currentUser, onAuthClick, onProfileClick, onLogout, onActiveOrdersClick }) => {
  return (
    <HeaderShow
      currentUser={currentUser}
      onAuthClick={onAuthClick}
      onProfileClick={onProfileClick}
      onLogout={onLogout}
      onActiveOrdersClick={onActiveOrdersClick}
    />
  );
};

export default Header;
