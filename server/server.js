const { Client } = require('pg');
const checkForChanges = require('./post')
const cron = require('node-cron');
const hostname = '127.0.0.1';
const port = 3001;
const { Pool } = require('pg');
const cors = require('cors');
const axios = require('axios');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

let getDate ={
  day: (date) => date.getDay,
  hour: (date) => date.getHours,
  min: (date) => date.getMinutes
}

async function getBitcoinPrice(time,range,timestamp) {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/klines', {
      params: {
        symbol: 'BTCUSDT',
        interval: time,
        startTime: range,
        endTime: Date.now(),
        limit: 10,
      }
    });
  
  
    const bitcoinPrices = response.data.map(item => ({
      //time: new Date(item[0]),
      time: getDate[timestamp](new Date(item[0])),
      price: Math.round(item[4]),
    })) 
   
    
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
  
  

  //getBitcoinPrice()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(cors({
  origin: 'http://localhost:3000',
  allowedHeaders: ['Content-Type']
}));


app.use(bodyParser.json())

app.post('/area', async (req, res) => {
  // Обработка запроса и отправка ответа
  console.log(req.body,'dddddddd')
  console.log((Date.now() - 7 * 24 * 60 * 60 * 1000),'dddddddd')
  const selectedOption = req.body.changeChart;

  let responseData = '';

  if (selectedOption === 'day') {
    
    const data = await getBitcoinPrice('1d', (Date.now() - 7 * 24 * 60 * 60 * 1000),"day");
    const emails = await fetchEmails()
    //console.log(data)
    res.send(data);
    //checkForChanges(data[data.length - 2].price, data[data.length - 1].price,emails);

  } else if (selectedOption === 'hour') {
    const data = await getBitcoinPrice('1h',(Date.now() - 7 * 60 * 60 * 1000),"hour" );
    const emails = await fetchEmails()
    //console.log(data)
    res.send(data);
    //checkForChanges(data[data.length - 2].price, data[data.length - 1].price,emails);
    
  }else if (selectedOption === 'min') {

    const data = await getBitcoinPrice('1m',(Date.now() -7 * 60 * 1000),"min");
    const emails = await fetchEmails()
    //console.log(data)
    res.send(data);
    //checkForChanges(data[data.length - 2].price, data[data.length - 1].price,emails);
  }


});

app.listen(port, hostname, () => {
  console.log('Сервер запущен на порту 3001');
});




// Подключение к PostgreSQL
const pool = new Pool({
  user: 'admin4',
  host: 'localhost',
  database: 'users',
  password: 'qqq',
  port: 5440,
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
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});
async function fetchEmails() {
  try {
    // Выполняем SQL-запрос для выбора всех адресов электронной почты
    const query = 'SELECT email FROM users';
    const { rows } = await pool.query(query);

    // Записываем адреса электронной почты в массив
    const emails = rows.map(row => row.email);
    console.error('эddddddd');
    console.error(emails);
    // Возвращаем массив адресов электронной почты
    return emails;
   
  } catch (error) {
    console.error('Error fetching emails:', error);
    return []; // Возвращаем пустой массив в случае ошибки
  } 
  // finally {
  //   // Всегда завершаем пул подключений
  //   await pool.end();
  // }
  
}



// function scheduleDailyTask(data) { 
//   const now = new Date();
//   const nextDay = new Date(now);
//   nextDay.setDate(now.getDate() + 1);
//   nextDay.setHours(0, 0, 0, 0); 
//   const timeUntilNextDay = nextDay - now;
//   setTimeout(() => {
//       checkForChanges(data[data.length - 2].price, data[data.length - 1].price)
//       scheduleDailyTask();
//   }, timeUntilNextDay);
// }
// scheduleDailyTask();


cron.schedule('0 0 * * *', async () => {
 const emails = await fetchEmails()
  checkForChanges(data[data.length - 2].price, data[data.length - 1].price, emails);
}, {
  scheduled: true,
  timezone: "Europe/Moscow" // Укажите свой часовой пояс
});
