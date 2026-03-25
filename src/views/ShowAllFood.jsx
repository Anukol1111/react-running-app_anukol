import React from 'react'
import FooterSAU from './../components/FooterSAU'
import logo from './../assets/logo.png'
import { Link } from 'react-router-dom'

export default function ShowAllFood() {
  return (
    <>
      {/* ส่วนของรายละเอียดของหน้าแสดงข้อมูลการกินทั้งหมด */}
      <div className='w-3/5 mx-auto flex flex-col items-center shadow-lg
                      border border-gray-300 rounded p-10 mt-30'>

        {/* แสดงรูป logo */}
        <img src={logo} alt="logo" className='w-30' />

        {/* แสดงชื่อเว็บ */}
        <h1 className='text-2xl mt-5 font-bold text-blue-500'>
          Food Log App (การกินของฉัน)
        </h1>
        <h1 className='text-2xl mt-2 font-bold text-blue-500'>
          🍔🍟🌭ข้อมูลการกินทั้งหมด 🥙🌮🍱
        </h1>

        {/* ส่วนปุ่มเพิ่มข้อมูลอยู่ทางด้านขวา */}
        <div className='w-full mt-5 flex justify-end'>
          <Link to='/addfood' className='p-2 bg-green-500 text-white
                                         rounded hover:bg-green-600'>
            เพิ่มข้อมูลการกิน
          </Link>
        </div>

        {/* ส่วนของตารางแสดงข้อมูลที่ดึงมาจาก Supabase */}
        <div className='w-full mt-5'>
          <table className='w-full border border-gray-600 text-sm'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='p-2 border border-gray-600'>รูป</th>
                <th className='p-2 border border-gray-600'>กินอะไร</th>
                <th className='p-2 border border-gray-600'>กินที่ไหน</th>
                <th className='p-2 border border-gray-600'>กินกับใคร</th>
                <th className='p-2 border border-gray-600'>กินไปเท่าไหร่</th>
                <th className='p-2 border border-gray-600'>ACTION</th>
              </tr>
            </thead>
            <tbody>

            </tbody>            
          </table>
        </div>

      </div>

      {/* ส่วนของ Footer */}
      <FooterSAU />
    </>
  )
}
