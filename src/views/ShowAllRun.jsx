import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import FooterSAU from './../components/FooterSAU'
import { deleteRun, getAllRuns } from './../services/runningService'

export default function ShowAllRun() {
  const [runs, setRuns] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const data = await getAllRuns()
        setRuns(data)
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถดึงข้อมูลการวิ่งได้ กรุณาลองใหม่อีกครั้ง',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRuns()
  }, [])

  const handleDeleteRunClick = async (id, runImageUrl) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าจะลบข้อมูลการวิ่งนี้?')) {
      return
    }

    try {
      await deleteRun(id, runImageUrl)
      setRuns((currentRuns) => currentRuns.filter((run) => run.id !== id))

      await Swal.fire({
        icon: 'success',
        title: 'ลบข้อมูลสำเร็จ',
        text: 'ข้อมูลการวิ่งถูกลบเรียบร้อยแล้ว',
      })
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถลบข้อมูลการวิ่งได้ กรุณาลองใหม่อีกครั้ง',
      })
    }
  }

  return (
    <div className='min-h-screen flex flex-col px-4 py-10'>
      <div className='flex-1 flex items-center justify-center'>
        <div className='w-full max-w-5xl rounded-sm border border-slate-200 bg-white px-6 py-10 shadow-[0_12px_40px_rgba(15,23,42,0.08)] md:px-12'>
          <div className='flex flex-col items-center'>
            <img src='/training.png' alt='Running App logo' className='w-24 md:w-28' />

            <h1 className='mt-4 text-center text-xl font-bold text-blue-700 md:text-2xl'>
              Running APP (Supabase)
            </h1>
            <p className='text-center text-lg font-bold text-blue-700'>วิ่งกันเถอะ</p>

            <div className='mt-8 flex w-full justify-end'>
              <Link
                to='/addrun'
                className='rounded-sm bg-blue-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-800'
              >
                เพิ่มการวิ่ง
              </Link>
            </div>

            <div className='mt-4 w-full overflow-x-auto'>
              {isLoading ? (
                <div className='py-10 text-center text-sm text-slate-500'>กำลังโหลดข้อมูลการวิ่ง...</div>
              ) : (
                <table className='w-full border border-slate-500 text-sm'>
                  <thead className='bg-slate-100 font-semibold'>
                    <tr>
                      <th className='border border-slate-500 px-3 py-2'>รูป</th>
                      <th className='border border-slate-500 px-3 py-2'>วันที่วิ่ง</th>
                      <th className='border border-slate-500 px-3 py-2'>สถานที่วิ่ง</th>
                      <th className='border border-slate-500 px-3 py-2'>ระยะทางที่วิ่ง (เมตร)</th>
                      <th className='border border-slate-500 px-3 py-2'>เวลาที่ใช้ในการวิ่ง (นาที)</th>
                      <th className='border border-slate-500 px-3 py-2'>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runs.length === 0 ? (
                      <tr>
                        <td colSpan='6' className='border border-slate-500 px-3 py-8 text-center text-slate-500'>
                          ยังไม่มีข้อมูลการวิ่ง
                        </td>
                      </tr>
                    ) : (
                      runs.map((item) => (
                        <tr key={item.id}>
                          <td className='border border-slate-500 px-3 py-2'>
                            <img
                              src={item.run_image_url}
                              alt={item.run_location}
                              className='mx-auto h-16 w-20 object-cover'
                            />
                          </td>
                          <td className='border border-slate-500 px-3 py-2 text-center'>{item.run_date}</td>
                          <td className='border border-slate-500 px-3 py-2 text-center'>{item.run_location}</td>
                          <td className='border border-slate-500 px-3 py-2 text-center'>{item.run_distance}</td>
                          <td className='border border-slate-500 px-3 py-2 text-center'>{item.run_time}</td>
                          <td className='border border-slate-500 px-3 py-2 text-center'>
                            <Link to={`/updaterun/${item.id}`} className='text-blue-700 hover:underline'>
                              [แก้ไข]
                            </Link>
                            {' '}
                            <button
                              onClick={() => handleDeleteRunClick(item.id, item.run_image_url)}
                              className='cursor-pointer text-red-600 hover:underline'
                            >
                              [ลบ]
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <Link to='/' className='mt-6 text-sm text-blue-700 hover:underline'>
              ออกจากการใช้งาน
            </Link>
          </div>
        </div>
      </div>

      <FooterSAU />
    </div>
  )
}