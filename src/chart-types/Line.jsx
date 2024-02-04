
import Chart from 'react-apexcharts'
import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function Line() {
  const [result,setResponse] = useState('');
  
  useEffect(() => {
    const handleCklik = async () => {
      try {
        const result = await axios.get('http://localhost:3001/line'); // Замените '/api/data' на ваш URL эндпоинта на бэкенде
  
         setResponse(result.data);
         console.log(result.data)
      } catch (error) {
        console.error(error);
      }
    }
    handleCklik()
  }, [])

    
    return (
      <div className="line">
        <Chart options={result.options || {}} series={result.series || []} type="line" width="500" />
      </div>
    ); 
}


