import React, { Component, } from 'react'
import { BrowserRouter, Router, Route, Routes, Link} from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import {Area} from './chart-types/Area'

import SelectComponent from './component1'
import Registration from './registr';



export default function App() {
  

    return (
    <Routes>
      <Route path='/register' element={ <SelectComponent />}/> 
      <Route path='/' element={<Registration />}/>             
    </Routes>
    //   <p>pppppppppppp</p>
    
    );
  
}


