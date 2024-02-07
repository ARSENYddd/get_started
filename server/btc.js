
import axios from 'axios'
//const axios = require('axios');
const getBTCdata = async () => {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/klines', {
      params: {
        symbol: 'BTCUSDT',
        interval: '1d',
        startTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
        endTime: Date.now(),
        limit: 7,
      },
    });

    const bitcoinPrices = response.data.map(item => ({
      time: new Date(item[0]),
      price: item[4],
    }));

    console.log(bitcoinPrices);
  } catch (error) {
    console.error(error);
  }
};
export default getBTCdata