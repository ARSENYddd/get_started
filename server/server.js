

const hostname = '127.0.0.1';
const port = 3001;


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
      time: new Date(item[0]),
      price: item[4],
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
  console.log(state)
});

app.listen(port, hostname, () => {
  console.log('Сервер запущен на порту 3001');
});