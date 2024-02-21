
const checkForChanges = require('./post')

const hostname = '127.0.0.1';
const port = 3001;
const { Pool } = require('pg');
const cors = require('cors');
const axios = require('axios');
const express = require('express');
const app = express();

async function getBitcoinPrice() {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/klines', {
      params: {
        symbol: 'BTCUSDT',
        interval: '1d',
        startTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
        endTime: Date.now(),
        limit: 7,
      }
    });
    const bitcoinPrices = response.data.map(item => ({
      time: new Date(item[0]).getDate(),
      price: Math.round(item[4]),
    })) // Последняя доступная цена биткойна за неделю
    //console.log('Цена биткойна за неделю:', bitcoinPrices);
    return bitcoinPrices;
  } catch (error) {
    console.error('Ошибка при получении цены биткойна:', error);
  }
}


  function categories(data){
    var times = [];
    for (var i = 0; i < data.length; i++) {
      times.push(data[i].time);
    }
    return times
  }
  
  function dataC(data){
    var price = [];
    for (var i = 0; i < data.length; i++) {
      price.push(data[i].price);
    }
    return price
  }
  
  

  getBitcoinPrice()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(cors({
  origin: 'http://localhost:3000',
  allowedHeaders: ['Content-Type']
}));

app.get('/line', async (req, res) => {
  // Обработка запроса и отправка ответа
  const data = await getBitcoinPrice();
  const state = {
    options: {
      stroke: {
        curve: 'smooth'
      },
      markers: {
        size: 0
      },
      xaxis: {
        categories: categories(data)
      }
    },
    series: [{
      data: dataC(data)
    }],
}
  res.send(state);
  
});


app.get('/area', async (req, res) => {
  // Обработка запроса и отправка ответа
  const data = await getBitcoinPrice();
  console.log(data)
  res.send(data);
  

});

app.listen(port, hostname, () => {
  console.log('Сервер запущен на порту 3001');
});




// Подключение к PostgreSQL
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

// Middleware для парсинга JSON
app.use(express.json());

// Обработка POST запроса на создание пользователя
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
    const values = [username, email, password];
    await pool.query(query, values);
    res.status(201).json({ message: 'Пользователь успешно создан' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




function scheduleDailyTask(data) { 
  const now = new Date();
  const nextDay = new Date(now);
  nextDay.setDate(now.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0); 
  const timeUntilNextDay = nextDay - now;
  setTimeout(() => {
      checkForChanges(data[data.length - 2].price, data[data.length - 1].price)
      scheduleDailyTask();
  }, timeUntilNextDay);
}
scheduleDailyTask();