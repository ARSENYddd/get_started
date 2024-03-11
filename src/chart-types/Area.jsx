import { VictoryChart, VictoryLine, VictoryTheme } from 'victory';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const containerStyle = {
  width: '90%',
  margin: '0 auto', // Центрирует div на странице
 // backgroundColor: '#f0f0f0',
  padding: '20px'
};
function culcChange(oldv,newv){
  let change = (Math.abs(((newv-oldv)/oldv)*100)).toFixed(2);
  return change + '%'; 
}
const SimpleChart = ({isLoggedIn}) => {
  const [result,setResponse] = useState('');
  const [lastItem,setLastItem] = useState('')
  const [pretItem,setPreItem] = useState('')
  const [changeChart, setchangeChart] = useState("day") 
  const [receivedData, setReceivedData] = useState('');
  //const [mail, setMail] = useState('')
  



  async function fetchMailFromBackend() {
    try {
      // Получение данных с бэкенда
      const response = await axios.get('http://localhost:3001/login');
      return response.data; // Возвращаем данные
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async function sendMailToServer(selectedValue) {
    try {
      // Отправка данных на сервер
      const response = await axios.post('http://localhost:3001/area', {
        changeChart: selectedValue,
        //getMail: dataToSend
      });
      return response
      console.log('Response from backend:', response.data);
    } catch (error) {
      console.error('Error sending data:', error);
      throw error;
    }
  }


      const handleCklik = async (event) => {
      const selectedValue = event.target.value;
      setchangeChart(selectedValue);
      console.log(selectedValue,'ddddddd')
      try {
        
        // const mail_s = await axios.get('http://localhost:3001/login')
        // setMail(mail_s)
        // const result = await axios.post('http://localhost:3001/area', {
        //   changeChart: selectedValue
        // }); 
        //const eml = await fetchMailFromBackend();
        const result = await sendMailToServer(selectedValue)
        
        console.log(result.data)
        //const lastItem = result.data.price.slice(-1)[0];
          console.log(result.data[result.data.length - 1] );

          setResponse(result.data);  

          setLastItem(result.data[result.data.length - 1].price)  
          setPreItem(result.data[result.data.length - 2].price) 
      } catch (error) {
        console.error(error);
      }
      
    }
    //handleCklik()
  

  return (
    <div style={containerStyle}>
      <h2>Простой график с использованием React и Victory</h2>
      <VictoryChart width={700} height={300} theme={VictoryTheme.material}>
        <VictoryLine data={result || []} 
        
        x="time"
        y="price"/>
      </VictoryChart>

      <div>
      изменение цены за последний день 
      {culcChange(pretItem,lastItem)}


      <select  value={changeChart} onChange={handleCklik}>
        <option value="day" >day</option>
        <option value="hour" >hour</option>
        <option value="min" >min</option>
      </select>

        {/* { changeChart === 'day' ? '1d' : null}
        { changeChart === 'hour' ? '1h' : null}
        { changeChart === 'min' ? '1m' : null} */}
      </div>
      <div>
      {isLoggedIn ? (
        <p>Вы вошли в систему!</p>
      ) : (
        <p>Вы не вошли в систему.</p>
      )}
    </div>
      <div>{receivedData}</div>
      </div>
    );
  }

export default SimpleChart;