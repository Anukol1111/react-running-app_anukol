import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import ShowAllFood from './views/ShowAllFood'
import AddFood from './views/AddFood'
import EditFood from './views/EditFood'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/showallfood" element={<ShowAllFood />} />
          <Route path="/addfood" element={<AddFood />} />
          <Route path="/editfood/:id" element={<EditFood />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
