import React, { useState, useEffect } from 'react';
import Area from './chart-types/Area'
import Bar from './chart-types/Bar'

import Line from './chart-types/Line'


export default function SelectComponent() {
    const [changeChart, setchangeChart] = useState("line") ;
  
    useEffect(() => {
      // вызывается каждый раз, когда изменяется значение changeChart
      console.log('Выбранная опция:', changeChart);
    }, [changeChart]);
  
    const handleSelectChange = (e) => {
        setchangeChart(e.target.value);
    };
  
  
    return (
      
        <div className="app">
        <select id="lang" value={changeChart} onChange={handleSelectChange}>
          <option value="line" >Line</option>
          <option value="area" >Area</option>
          <option value="bar" >Bar</option>
        </select>
        

        { changeChart === 'area' ? (<Area></Area>) : null}
        { changeChart === 'bar' ? (<Bar></Bar>) : null}
        { changeChart === 'line' ? (<Line></Line>) : null}
       
      </div>
    );
  };