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
const SimpleChart = () => {
  const [result,setResponse] = useState('');
  const [lastItem,setLastItem] = useState('')
  const [pretItem,setPreItem] = useState('')
  useEffect(() => {
    const handleCklik = async () => {
      try {
        const result = await axios.get('http://localhost:3001/area'); 
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
    handleCklik()
  }, [])

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
      
      </div>
      </div>
  );
};

export default SimpleChart;