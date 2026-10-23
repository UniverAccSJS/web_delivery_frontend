// import axios from 'axios';

// const API = axios.create({
//     // Оставляем чистый домен бэкенда
//     baseURL: 'http://127.0.0.1:8000',
//     timeout: 5000,
//     headers: {
//         'Content-Type': 'application/json',
//     }
// });

// // не нравится перехватчик
// // // 2. ДОБАВЛЕНО: Перехватчик (Interceptor) для автоматической подстановки встроенного токена DRF
// // API.interceptors.request.use(
// //     (config) => {
// //         // Извлекаем сохраненный при логине встроенный токен из памяти браузера
// //         const token = localStorage.getItem('restaurant_token');
        
// //         if (token) {
// //             // Передаем заголовок в формате, который жестко требует TokenAuthentication в Django
// //             config.headers.Authorization = `Token ${token}`;
// //         }
// //         return config;
// //     },
// //     (error) => {
// //         return Promise.reject(error);
// //     }
// // );


// // пути до каждого эндпоинта
// // главный экран

// //меню и категории
// export const fetchMenu = (clientId) => API.get('/api/menu/' + (clientId ? '?client_id=' + clientId : ''));
// export const fetchCategories = () => API.get('/api/categories/');

// //вход или регистарция
// export const loginUser = (data) => API.post('/api/auth/login/', data);
// export const registerUser = (data) => API.post('/api/auth/register/', data);

// // создание заказа
// export const createOrder = (data) => API.post('/api/order/create/', data);

// //просмотр активных заказов (минимум информации)
// export const fetchClientActiveOrders = (clientId) => API.get(`/api/client/${clientId}/active-orders/`);
// //управление корзиной
// export const syncCartItem = (data) => API.post('/api/cart/manage/', data);


// // ЛК пользователя

// //управление адресами и просмтор
// export const fetchClientAddresses = (clientId) => API.get(`/api/client/${clientId}/addresses/`);
// export const manageClientAddress = (data) => API.post('/api/client/addresses/manage/', data);

// //управление картами и просмтор
// export const fetchClientCards = (clientId) => API.get(`/api/clients/${clientId}/cards/`);
// export const manageClientCard = (payload) => API.post('/api/clients/cards/manage/', payload);

// //просмотр истории (~ вся информация о заказе)
// export const fetchClientHistory = (clientId) => API.get(`/api/client/${clientId}/history/`);

// // Получение детального состава и информации о конкретном заказе
// export const fetchOrderDetails = (orderId) => API.get(`/api/orders/${orderId}/details/`);

// // изменить данные профиля
// export const updateClientProfile = (data) => API.post('/api/auth/update/', data);
// export const deleteClientProfile = (clientId) => API.post('/api/auth/delete/', { client_id: clientId });

// //управление и порсмотр избранное
// export const toggleFavorite = (data) => API.post('/api/menu/favorite/', data);
// export const fetchClientFavorites = (clientId) => API.get(`/api/client/${clientId}/favorites/`);

// //просмотр бонусов
// export const fetchClientBonuses = (clientId) => API.get(`/api/client/${clientId}/bonuses/`);

// export const downloadOrderReceipt = (orderId) => {
//   return API.get(`/api/orders/${orderId}/receipt/`, {
//     responseType: 'blob' // КРИТИЧЕСКИ ВАЖНО: скачивание файл, а не JSON
//   });
// };


// export default API;



import axios from 'axios';



// 1. Динамический выбор URL бэкенда в зависимости от режима запуска проекта
// const getBaseURL = () => {
//     // Если сайт открыт локально — стучимся на локальный Django
//     if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
//         return 'http://127.0.0.1:8000';
//     }
//     // Если сайт запущен на GitHub Pages — автоматически переключаемся на Render
//     // ЗАМЕНИТЕ НА СВОЙ РЕАЛЬНЫЙ АДРЕС ВЕБ-СЕРВИСА ИЗ ПАНЕЛИ RENDER
//     return 'https://web-delivery-back.onrender.com'; 
// };

// // ЖЕСТКО ПРОПИСЫВАЕМ ССЫЛКУ, ЧТОБЫ AXIOS НИКОГДА НЕ ПОЛУЧАЛ UNDEFINED
// const API = axios.create({
//     baseURL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
//         ? 'http://127.0.0.1:8000'
//         : 'https:web-delivery-back//onrender.com', 
//     timeout: 30000, // 30 секунд ожидания для прогрева бесплатного Render
//     headers: {
//         'Content-Type': 'application/json',
//     }
// });


const API = axios.create({
    baseURL: 'https://web-delivery-back.onrender.com', 
    timeout: 30000, // 30 секунд ожидания для прогрева бесплатного Render
    headers: {
        'Content-Type': 'application/json',
    }
});




// const API = axios.create({
//     // Оставляем чистый домен бэкенда
//     //baseURL: 'http://127.0.0.1:8000',
//     baseURL: getBaseURL,
//     timeout: 30000,
//     headers: {
//         'Content-Type': 'application/json',
//     }
// });

// // 2. Достаем токен DRF напрямую перед созданием инстанса
// const token = localStorage.getItem('restaurant_token');

// const API = axios.create({
//     baseURL: getBaseURL(),
//     timeout: 10000, // Увеличили до 10 сек, так как бесплатный Render засыпает и первый запрос идет долго
//     headers: {
//         'Content-Type': 'application/json',
//         // Если токен есть в памяти, он сразу зашьется во все запросы без перехватчиков
//         ...(token && { 'Authorization': `Token ${token}` })
//     }
// });

// // Функция для обновления токена в axios после успешного входа или регистрации
// export const setAuthToken = (newToken) => {
//     if (newToken) {
//         API.defaults.headers.common['Authorization'] = `Token ${newToken}`;
//         localStorage.setItem('restaurant_token', newToken);
//     } else {
//         delete API.defaults.headers.common['Authorization'];
//         localStorage.removeItem('restaurant_token');
//     }
// };

// --- ПУТИ ДО КАЖДОГО ЭНДПОИНТА ---

// Меню и категории
export const fetchMenu = (clientId) => API.get('/api/menu/' + (clientId ? '?client_id=' + clientId : ''));
export const fetchCategories = () => API.get('/api/categories/');

// Вход или регистрация
export const loginUser = (data) => API.post('/api/auth/login/', data);
export const registerUser = (data) => API.post('/api/auth/register/', data);

// Создание заказа
export const createOrder = (data) => API.post('/api/order/create/', data);

// Просмотр активных заказов
export const fetchClientActiveOrders = (clientId) => API.get(`/api/client/${clientId}/active-orders/`);

// Управление корзиной
export const syncCartItem = (data) => API.post('/api/cart/manage/', data);

// ЛК пользователя
export const fetchClientAddresses = (clientId) => API.get(`/api/client/${clientId}/addresses/`);
export const manageClientAddress = (data) => API.post('/api/client/addresses/manage/', data);

export const fetchClientCards = (clientId) => API.get(`/api/clients/${clientId}/cards/`);
export const manageClientCard = (payload) => API.post('/api/clients/cards/manage/', payload);

export const fetchClientHistory = (clientId) => API.get(`/api/client/${clientId}/history/`);
export const fetchOrderDetails = (orderId) => API.get(`/api/orders/${orderId}/details/`);

// Изменить данные профиля
export const updateClientProfile = (data) => API.post('/api/auth/update/', data);
export const deleteClientProfile = (clientId) => API.post('/api/auth/delete/', { client_id: clientId });

// Управление и просмотр избранного
export const toggleFavorite = (data) => API.post('/api/menu/favorite/', data);
export const fetchClientFavorites = (clientId) => API.get(`/api/client/${clientId}/favorites/`);

// Просмотр бонусов
export const fetchClientBonuses = (clientId) => API.get(`/api/client/${clientId}/bonuses/`);

export const downloadOrderReceipt = (orderId) => {
  return API.get(`/api/orders/${orderId}/receipt/`, {
    responseType: 'blob' 
  });
};

export default API;

