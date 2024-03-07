import React, { Component, } from 'react'
import { BrowserRouter, Router, Route, Routes, Link} from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import {Area} from './chart-types/Area'

import SelectComponent from './component1'
import Registration from './registr';
import LoginPage from './autoris';



export default function App() {
  

    return (
    <Routes>
      <Route path='/' element={ <SelectComponent />}/> 
      <Route path='/register' element={<Registration />}/>  
      <Route path='/login' element={<LoginPage />}/>               
    </Routes>
    //   <p>pppppppppppp</p>
    
    );
  
}


