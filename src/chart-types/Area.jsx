import { VictoryChart, VictoryLine, VictoryTheme } from 'victory';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const containerStyle = {
  width: '90%',
  margin: '0 auto', // Центрирует div на странице
 // backgroundColor: '#f0f0f0',
  padding: '20px'
};

const SimpleChart = () => {
  const [result,setResponse] = useState('');
  useEffect(() => {
    const handleCklik = async () => {
      try {
        const result = await axios.get('http://localhost:3001/area'); 
        console.log(result.data)
          setResponse(result.data);    
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
    </div>
  );
};

export default SimpleChart;