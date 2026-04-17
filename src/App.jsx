import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { supabaseConfigError } from './services/supabaseClient'
import Home from './views/Home'
import ShowAllRun from './views/ShowAllRun'
import AddRun from './views/AddRun'
import UpdateRun from './views/UpdateRun'

export default function App() {
  if (supabaseConfigError) {
    return (
      <div className='min-h-screen bg-slate-50 px-4 py-10 text-slate-800'>
        <div className='mx-auto max-w-2xl rounded-lg border border-amber-200 bg-white p-6 shadow-sm'>
          <h1 className='text-2xl font-bold text-amber-700'>Supabase Config Missing</h1>
          <p className='mt-3 text-sm leading-6 text-slate-600'>
            แอปยังเชื่อมต่อ Supabase ไม่ได้ เพราะยังไม่มี environment variables ที่จำเป็นตอน deploy
          </p>
          <div className='mt-4 rounded-md bg-slate-900 px-4 py-3 font-mono text-sm text-slate-100'>
            <div>VITE_SUPABASE_URL</div>
            <div>VITE_SUPABASE_ANON_KEY</div>
          </div>
          <p className='mt-4 text-sm leading-6 text-slate-600'>
            ถ้า deploy บน Vercel ให้ไปที่ Project Settings &gt; Environment Variables, เพิ่มค่าทั้งสองตัวนี้ แล้ว redeploy ใหม่
          </p>
          <p className='mt-3 text-sm text-red-600'>{supabaseConfigError}</p>
        </div>
      </div>
    )
  }

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
