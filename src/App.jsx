import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import ShowAllRun from './views/ShowAllRun'
import AddRun from './views/AddRun'
import UpdateRun from './views/UpdateRun'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/showallrun" element={<ShowAllRun />} />
        <Route path="/addrun" element={<AddRun />} />
        <Route path="/updaterun/:id" element={<UpdateRun />} />
      </Routes>
    </BrowserRouter>
  )
}
