const autocannon = require('autocannon');

const instance = autocannon({
  url: 'http://localhost:8000', // Адрес вашего Django сервера
  connections: 300,             // 300 одновременных пользователей
  duration: 5,                  // Тестируем 5 секунд
  
  // НАШ СЦЕНАРИЙ ДЕЙСТВИЙ (Бьем строго по вашим реальным эндпоинтам REST API)
  requests: [
    {
      method: 'GET',
      path: '/menu/'                 // 1. Получение списка меню (у вас: path('menu/'))
    },
    {
      method: 'GET',
      path: '/categories/'           // 2. Получение категорий (у вас: path('categories/'))
    },
  ]
}, (err, result) => {
  if (err) return console.error(err);
  console.log('Тестирование REST API сценария завершено успешно!');
});

// Включаем красивый прогресс-бар в консоли
autocannon.track(instance, { renderProgressBar: true });
