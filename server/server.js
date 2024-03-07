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
const { createPool } = require('generic-pool');
const executeBasedOnTime = require('./time')


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
 
  const selectedOption = req.body.changeChart;

  const sql = `UPDATE users
             SET type_w = $1
             WHERE id = $2`;

  let responseData = '';

  if (selectedOption === 'day') {
    
    const data = await getBitcoinPrice('1d', (Date.now() - 7 * 24 * 60 * 60 * 1000),"day");
    const emails = await fetchEmails()
    //console.log(data)
    res.send(data);
    const type_w = 'day';
    const userId = 1;
    pool.acquire().then((client) => {
      client.query(sql, [type_w, userId], (err, result) => {
        if (err) {
          console.error('Error executing query', err);
        } else {
          console.log(`Rows updated: ${result.rowCount}`);
        }
    
        // Освобождение клиента обратно в пул
        pool.release(client);
      });
    }).catch((err) => {
      console.error('Error acquiring client', err);
    });
    checkForChanges(data[data.length - 2].price, data[data.length - 1].price,emails);

  } else if (selectedOption === 'hour') {
    const data = await getBitcoinPrice('1h',(Date.now() - 7 * 60 * 60 * 1000),"hour" );
    const emails = await fetchEmails()
    //console.log(data)
    res.send(data);
    const type_w = 'hour';
    const userId = 1;
    pool.acquire().then((client) => {
      client.query(sql, [type_w, userId], (err, result) => {
        if (err) {
          console.error('Error executing query', err);
        } else {
          console.log(`Rows updated: ${result.rowCount}`);
        }
    
        // Освобождение клиента обратно в пул
        pool.release(client);
      });
    }).catch((err) => {
      console.error('Error acquiring client', err);
    });
    checkForChanges(data[data.length - 2].price, data[data.length - 1].price,emails);
    
  } else if (selectedOption === 'min') {


    const data = await getBitcoinPrice('1m',(Date.now() -7 * 60 * 1000),"min");
    const emails = await fetchEmails()
    //console.log(data)
    res.send(data);
    const type_w = 'min';
    const userId = 1;
    pool.acquire().then((client) => {
      client.query(sql, [type_w, userId], (err, result) => {
        if (err) {
          console.error('Error executing query', err);
        } else {
          console.log(`Rows updated: ${result.rowCount}`);
        }
    
        // Освобождение клиента обратно в пул
        pool.release(client);
      });
    }).catch((err) => {
      console.error('Error acquiring client', err);
    });
    checkForChanges(data[data.length - 2].price, data[data.length - 1].price,emails);
  }


});

app.listen(port, hostname, () => {
  console.log('Сервер запущен на порту 3001');
});




// Подключение к PostgreSQL
const poolConfig = {
  user: 'admin4',
  host: 'localhost',
  database: 'users',
  password: 'qqq',
  port: 5440,
};
const pool = createPool({
  create: () => new Pool(poolConfig),
  destroy: (client) => client.end(),
});


// Middleware для парсинга JSON
app.use(express.json());

// Обработка POST запроса на создание пользователя
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const pool = new Pool(poolConfig);
  try {
    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
    const values = [username, email, password];
    await pool.query(query, values);
    res.status(201).json({ message: 'Пользователь успешно создан' });
    pool.end()
    
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
    pool.end()
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const pool = new Pool(poolConfig);
  
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    const mail = await client.query('SELECT email FROM users WHERE username = $1', [username]);
    client.release();

    if (result.rows.length > 0) {
      //res.status(200).json({ message: 'Successful login' }) 
       res.json(mail);
      
      pool.end()
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
      pool.end()
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
    pool.end()
  }
});


async function fetchEmails() {
  try {
    const pool = new Pool(poolConfig);
    // Выполняем SQL-запрос для выбора всех адресов электронной почты
    const query = 'SELECT email FROM users';
    const { rows } = await pool.query(query);
    
    // Записываем адреса электронной почты в массив
    const emails = rows.map(row => row.email);
    console.error('бляяяяяяя');
    console.error(emails);
    // Возвращаем массив адресов электронной почты
    pool.end()
    return emails;
   
  } catch (error) {
    console.error('пизда с почтой крч:', error);
    pool.end()
    return []; // Возвращаем пустой массив в случае ошибки
    
  } 
  
}

//executeBasedOnTime()
