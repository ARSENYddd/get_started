

const hostname = '127.0.0.1';
const port = 3001;

const state = {
    options: {
      stroke: {
        curve: 'smooth'
      },
      markers: {
        size: 0
      },
      xaxis: {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    },
    series: [{
      data: [30, 40, 25, 50, 49, 21, 70, 51]
    }],}
const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/line', (req, res) => {
  // Обработка запроса и отправка ответа
  res.send(state);
  console.log(state)
});

app.listen(port, hostname, () => {
  console.log('Сервер запущен на порту 3001');
});