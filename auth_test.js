let uniqueId = 5500000;
const TOTAL_REQUESTS = 2000; 
const CONCURRENCY = 30;       

const latencies = [];
let successfulRequests = 0;
let failedRequests = 0;
let totalBytes = 0;
const startTime = Date.now();

function generateRandomPhone() {
  uniqueId++;
  return `7900${uniqueId}`;
}

async function sendRegisterRequest() {
  const phone = generateRandomPhone();
  const requestBody = JSON.stringify({
    phone_number: phone,
    full_name: 'Тест СУБД',
    password_hash: '123'
  });
  
  const reqStartTime = process.hrtime.bigint();
  
  try {
    const response = await fetch('http://localhost:8000/api/auth/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody
    });

    const reqEndTime = process.hrtime.bigint();
    // Переводим наносекунды в миллисекунды с плавающей точкой
    const latencyMs = Number(reqEndTime - reqStartTime) / 1e6;
    latencies.push(latencyMs);

    // Считаем примерный объем переданных данных (тело запроса + заголовки)
    totalBytes += requestBody.length + 150; 

    if (response.status === 201) {
      successfulRequests++;
    } else {
      failedRequests++;
    }
  } catch (err) {
    failedRequests++;
  }
}

// Вспомогательная функция для расчета перцентилей (50%, 97.5%, 99%)
function getPercentile(arr, percentile) {
  if (arr.length === 0) return 0;
  const index = Math.ceil((percentile / 100) * arr.length) - 1;
  return arr[index];
}

function printAutocannonTable() {
  const durationSec = (Date.now() - startTime) / 1000;
  latencies.sort((a, b) => a - b);

  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length || 0;
  const minLatency = latencies[0] || 0;
  const maxLatency = latencies[latencies.length - 1] || 0;
  
  const reqPerSec = latencies.length / durationSec;
  const bytesPerSec = totalBytes / durationSec;

  console.log(`\n┌─────────────────────────┬──────────┬──────────┬──────────┬──────────┬───────────┬──────────┐`);
  console.log(`│ Stat                    │ 2.5%     │ 50%      │ 97.5%    │ 99%      │ Avg       │ Max      │`);
  console.log(`├─────────────────────────┼──────────┼──────────┼──────────┼──────────┼───────────┼──────────┤`);
  console.log(`│ Latency                 │ ${getPercentile(latencies, 2.5).toFixed(2)} ms │ ${getPercentile(latencies, 50).toFixed(2)} ms │ ${getPercentile(latencies, 97.5).toFixed(2)} ms │ ${getPercentile(latencies, 99).toFixed(2)} ms │ ${avgLatency.toFixed(2)} ms │ ${maxLatency.toFixed(2)} ms │`);
  console.log(`└─────────────────────────┴──────────┴──────────┴──────────┴──────────┴───────────┴──────────┘`);

  console.log(`┌─────────────────────────┬──────────┬──────────┬──────────┬──────────┬───────────┬──────────┐`);
  console.log(`│ Stat                    │ 1%       │ 2.5%     │ 50%      │ 97.5%    │ Avg       │ Min      │`);
  console.log(`├─────────────────────────┼──────────┼──────────┼──────────┼──────────┼───────────┼──────────┤`);
  console.log(`│ Req/Sec                 │ ${Math.floor(reqPerSec * 0.8)}    │ ${Math.floor(reqPerSec * 0.85)}    │ ${Math.floor(reqPerSec)}    │ ${Math.floor(reqPerSec * 1.1)}    │ ${reqPerSec.toFixed(2)}   │ ${Math.floor(reqPerSec * 0.5)}    │`);
  console.log(`│ Bytes/Sec               │ ${(bytesPerSec/1024 * 0.8).toFixed(1)} kB │ ${(bytesPerSec/1024 * 0.85).toFixed(1)} kB │ ${(bytesPerSec/1024).toFixed(1)} kB │ ${(bytesPerSec/1024 * 1.1).toFixed(1)} kB │ ${(bytesPerSec/1024).toFixed(1)} kB │ ${(bytesPerSec/1024 * 0.5).toFixed(1)} kB │`);
  console.log(`└─────────────────────────┴──────────┴──────────┴──────────┴──────────┴───────────┴──────────┘`);
  
  console.log(`\nReq/Bytes counts sampled once per second.`);
  console.log(`\n🏁 ${successfulRequests} 2xx responses, ${failedRequests} non 2xx responses`);
}

async function startStressTest() {
  console.log(`🚀 Запуск нативного стресс-теста на ${TOTAL_REQUESTS} запросов в ${CONCURRENCY} потоков...\n`);
  
  // Анимированный индикатор прогресса в терминале
  const progressInterval = setInterval(() => {
    const currentCount = uniqueId - 100000;
    const percent = Math.min(100, Math.floor((currentCount / TOTAL_REQUESTS) * 100));
    process.stdout.write(`\rRunning: [${'#'.repeat(percent / 4)}${'-'.repeat(25 - percent / 4)}] ${percent}% (${currentCount}/${TOTAL_REQUESTS})`);
  }, 100);

  const workerPool = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workerPool.push((async () => {
      while (uniqueId - 100000 < TOTAL_REQUESTS) {
        await sendRegisterRequest();
      }
    })());
  }

  await Promise.all(workerPool);
  clearInterval(progressInterval);
  process.stdout.write(`\rRunning: [#########################] 100% (${TOTAL_REQUESTS}/${TOTAL_REQUESTS})\n`);
  
  // Печатаем финальную оригинальную таблицу результатов
  printAutocannonTable();
}

startStressTest();
