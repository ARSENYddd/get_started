import React, { Component, } from 'react'
import { BrowserRouter, Router, Route, Routes, Link} from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import {Area} from './chart-types/Area'

import SelectComponent from './component1';



export default function App() {
  

    return (
    <Routes>
      <Route path='/' element={ <SelectComponent />}/>              
    </Routes>
    //   <p>pppppppppppp</p>
    
    );
  
}


