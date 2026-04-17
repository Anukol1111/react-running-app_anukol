import FooterSAU from './../components/FooterSAU'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  // สร้าง state 
  // [ชื่อ state, ฟังก์ชันสำหรับอัปเดตค่า state] = useState(ค่าเริ่มต้น)
  const [secureCode, setSecureCode] = useState('')

  // ฟังก์ชันตรวจสอบ Secure Code เพื่อเปิดไปยังหน้า /showallrun
  const handleAccessClick = () => {
    // Validate UI
    if (secureCode === '') {
      //ว่างจริงแสดงข้อความเตือน
      // alert('กรุณาป้อน Secure Code ก่อนเข้าใช้งาน') ง่ายแต่ไม่สวย
      Swal.fire({
        icon: 'warning',
        title: 'คำเตือน',
        text: 'กรุณาป้อน Secure Code ก่อนเข้าใช้งาน',
        confirmButtonText: 'ตกลง'
      })
      return
    }

    // ตรวจสอบว่า secureCode ตรงกับ 'SAU' หรือไม่ ถ้าใช่ให้เปิดหน้า /showallrun
    if (secureCode.toUpperCase() === 'SAU') {
      // เปิดหน้า /showallrun
      navigate('/showallrun')
    } else {
      // แสดงข้อความเตือนว่า Secure Code ไม่ถูกต้อง
      Swal.fire({
        icon: 'warning',
        title: 'คำเตือน',
        text: 'Secure Code ไม่ถูกต้อง',
        confirmButtonText: 'ตกลง'
      })
    }
  }

  return (
    <div className='min-h-screen flex flex-col px-4 py-10'>
      <div className='flex-1 flex items-center justify-center'>
        <div className='w-full max-w-4xl rounded-sm border border-slate-200 bg-white px-6 py-10 shadow-[0_12px_40px_rgba(15,23,42,0.08)] md:px-12'>
          <div className='mx-auto flex max-w-3xl flex-col items-center'>
            <h1 className='text-center text-xl font-bold text-blue-700 md:text-2xl'>
              Running APP
            </h1>
            <p className='mt-1 text-center text-lg font-bold text-blue-700'>วิ่งกันเถอะ</p>

            <img src='/training.png' alt='Running App logo' className='mt-5 w-24 md:w-28' />

            <input
              value={secureCode}
              onChange={(e) => setSecureCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAccessClick()
                }
              }}
              type='text'
              placeholder='Enter secure code'
              className='mt-6 w-full rounded-sm border border-slate-300 px-4 py-2 text-sm outline-none transition focus:border-blue-500'
            />

            <button
              onClick={handleAccessClick}
              className='mt-4 w-full rounded-sm bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800'
            >
              เข้าใช้งาน
            </button>
          </div>
        </div>
      </div>

      <FooterSAU />
    </div>
  )
}
