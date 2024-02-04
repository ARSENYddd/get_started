import React, { Component, } from 'react'
import { BrowserRouter, Router, Route, Routes, Link} from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import {Area} from './chart-types/Area'
import Bar from './chart-types/Bar'
import Column from './chart-types/Column'
import Line from './chart-types/Line'
import Donut from './chart-types/Donut'
import RadialBar from './chart-types/RadialBar'
import ChartUpdate from './ChartUpdate'

import SelectComponent from './component1';


export default function App() {
  

    return (
    <Routes>
      <Route path='/' element={ <SelectComponent />}/>                  
    </Routes>
    //   <p>pppppppppppp</p>
    
    );
  
}


