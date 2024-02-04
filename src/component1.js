import React, { useState, useEffect } from 'react';
import Area from './chart-types/Area'
import Bar from './chart-types/Bar'
import Column from './chart-types/Column'
import Line from './chart-types/Line'
import Donut from './chart-types/Donut'
import RadialBar from './chart-types/RadialBar'
import ChartUpdate from './ChartUpdate'

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
          <option value="column" >Column</option>
          <option value="radialbar" >RadialBar</option>
          <option value="donut" >Donut</option>
          <option value="updateExample" >Chart Update Example</option>
        </select>
        

        { changeChart === 'area' ? (<Area></Area>) : null}
        { changeChart === 'bar' ? (<Bar></Bar>) : null}
        { changeChart === 'line' ? (<Line></Line>) : null}
        { changeChart === 'column' ? (<Column></Column>) : null}
        { changeChart === 'radialbar' ? (<RadialBar></RadialBar>) : null}
        { changeChart === 'donut' ? (<Donut></Donut>) : null}
        { changeChart === 'updateExample' ? (<ChartUpdate></ChartUpdate>) : null}
      </div>
    );
  };