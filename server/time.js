const checkForChanges = require('./post')
//const getBitcoinPrice = require('./server')
const { createPool } = require('generic-pool');
const { Pool } = require('pg');
const cron = require('node-cron');
const axios = require('axios');
const { values } = require('lodash');

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

async function fetchEmails(tag) {
  try {
    const pool = new Pool(poolConfig); // Убедитесь, что poolConfig определен
    // Выполняем SQL-запрос для выбора всех адресов электронной почты
    const query = "SELECT email FROM users WHERE type_w = $1";
    const values = [tag]; // Поместите tag в массив, чтобы передать его как параметр запроса
    const { rows } = await pool.query(query, values);
    console.log(rows);
    // Записываем адреса электронной почты в массив
    const emails = rows.map(row => row.email);
    console.log(emails);
    // Возвращаем массив адресов электронной почты
    pool.end();
    return emails;
  } catch (error) {
    console.error('Ошибка с почтой:', error);
    pool.end();
    return []; // Возвращаем пустой массив в случае ошибки
  }
}

async function scheduleTask() {
  cron.schedule('* * * * *', async () => { // Расписание для выполнения каждую минуту (можно настроить на свое усмотрение)
    console.log('1mclkwjknjk1§1mekc')
    
    const pool = new Pool(poolConfig);
    try {
      const client = await pool.connect();
      const { rows: users } = await client.query('SELECT * FROM users');

      for (const user of users) {
        const type_w = user.type_w;
        let mail;

        if (type_w === 'hour') {
          console.log('hour')
          const data = await getBitcoinPrice('1h',(Date.now() - 7 * 60 * 60 * 1000),"hour" );
          const emails = await fetchEmails(type_w)
          cron.schedule('0 * * * *', () => {
            checkForChanges(data[data.length - 2].price, data[data.length - 1].price, emails);
          });

        } else if (type_w === 'min') {
          console.log('min')
          const data = await getBitcoinPrice('1m',(Date.now() -7 * 60 * 1000),"min");
          const emails = await fetchEmails(type_w)
          cron.schedule('* * * * *', () => {
            checkForChanges(data[data.length - 2].price, data[data.length - 1].price, emails);
          });

        } else if (type_w === 'day') {
          console.log('day')
          const data = await getBitcoinPrice('1d', (Date.now() - 7 * 24 * 60 * 60 * 1000),"day");
          const emails = await fetchEmails(type_w)
          cron.schedule('0 0 * * *', () => {
            checkForChanges(data[data.length - 2].price, data[data.length - 1].price, emails);
          });
        }
      }
    } catch (err) {
      console.error('Error:', err);
    }
  });
}

module.exports = scheduleTask
