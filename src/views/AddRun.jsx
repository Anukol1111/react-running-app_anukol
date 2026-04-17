import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import FooterSAU from './../components/FooterSAU'
import { createRun } from './../services/runningService'

export default function AddRun() {
  const navigate = useNavigate()
  const [runDate, setRunDate] = useState('')
  const [runLocation, setRunLocation] = useState('')
  const [runDistance, setRunDistance] = useState('')
  const [runTime, setRunTime] = useState('')
  const [runImagePreview, setRunImagePreview] = useState('')
  const [runImageFile, setRunImageFile] = useState(null)

  useEffect(() => {
    return () => {
      if (runImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(runImagePreview)
      }
    }
  }, [runImagePreview])

  const resetForm = () => {
    setRunDate('')
    setRunLocation('')
    setRunDistance('')
    setRunTime('')
    setRunImagePreview('')
    setRunImageFile(null)
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (runImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(runImagePreview)
    }

    setRunImageFile(file)
    setRunImagePreview(URL.createObjectURL(file))
  }

  const handleSaveClick = async () => {
    if (!runDate || !runLocation || !runDistance || !runTime || !runImageFile) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบ',
        text: 'กรุณากรอกข้อมูลให้ครบทุกช่องและเลือกรูปภาพ',
      })
      return
    }

    if (Number(runDistance) < 0 || Number(runTime) < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ถูกต้อง',
        text: 'ระยะทางและเวลาต้องมีค่ามากกว่าหรือเท่ากับ 0',
      })
      return
    }

    try {
      await createRun({
        runDate,
        runLocation,
        runDistance,
        runTime,
        runImageFile,
      })

      await Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ',
        text: 'เพิ่มข้อมูลการวิ่งเรียบร้อยแล้ว',
      })

      navigate('/showallrun')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'บันทึกไม่สำเร็จ',
        text: error.message || 'ไม่สามารถบันทึกข้อมูลการวิ่งได้ กรุณาตรวจสอบ Supabase',
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
            <p className='text-center text-lg font-bold text-blue-700'>วิ่งกันเถอะ (เพิ่ม)</p>

            <div className='mt-8 w-full max-w-md border border-slate-300 px-4 py-5'>
              <div className='space-y-3'>
                <div>
                  <label className='mb-1 block text-sm'>วันที่วิ่ง</label>
                  <input
                    value={runDate}
                    onChange={(event) => setRunDate(event.target.value)}
                    type='text'
                    placeholder='เช่น 28 มีนาคม 2569, 10 พฤษภาคม 2569'
                    className='w-full rounded-sm border border-slate-400 px-3 py-2 text-sm outline-none focus:border-blue-500'
                  />
                </div>

                <div>
                  <label className='mb-1 block text-sm'>สถานที่วิ่ง</label>
                  <input
                    value={runLocation}
                    onChange={(event) => setRunLocation(event.target.value)}
                    type='text'
                    placeholder='เช่น สวนลุม, สวนจตุจักร'
                    className='w-full rounded-sm border border-slate-400 px-3 py-2 text-sm outline-none focus:border-blue-500'
                  />
                </div>

                <div>
                  <label className='mb-1 block text-sm'>ระยะทางที่วิ่ง (เมตร)</label>
                  <input
                    value={runDistance}
                    onChange={(event) => setRunDistance(event.target.value)}
                    type='number'
                    min='0'
                    placeholder='เช่น 2000, 5000'
                    className='w-full rounded-sm border border-slate-400 px-3 py-2 text-sm outline-none focus:border-blue-500'
                  />
                </div>

                <div>
                  <label className='mb-1 block text-sm'>เวลาที่ใช้ในการวิ่ง (นาที)</label>
                  <input
                    value={runTime}
                    onChange={(event) => setRunTime(event.target.value)}
                    type='number'
                    min='0'
                    placeholder='เช่น 30, 60'
                    className='w-full rounded-sm border border-slate-400 px-3 py-2 text-sm outline-none focus:border-blue-500'
                  />
                </div>

                <div>
                  <label className='mb-1 block text-sm'>อัปโหลดรูป</label>
                  <div className='flex items-center gap-3'>
                    <input
                      id='add-run-image'
                      onChange={handleImageChange}
                      type='file'
                      accept='image/*'
                      className='hidden'
                    />
                    <label
                      htmlFor='add-run-image'
                      className='cursor-pointer rounded-sm bg-blue-700 px-4 py-2 text-sm text-white transition hover:bg-blue-800'
                    >
                      เลือกรูป
                    </label>
                    {runImageFile ? <span className='text-xs text-slate-500'>{runImageFile.name}</span> : null}
                  </div>
                  {runImagePreview ? (
                    <img src={runImagePreview} alt='Run preview' className='mt-3 h-24 w-24 object-cover' />
                  ) : null}
                </div>
              </div>

              <button
                onClick={handleSaveClick}
                className='mt-6 w-full rounded-sm bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800'
              >
                บันทึกการวิ่ง
              </button>

              <button
                onClick={resetForm}
                className='mt-2 w-full rounded-sm border border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50'
              >
                ล้างข้อมูล
              </button>
            </div>

            <Link to='/showallrun' className='mt-6 text-sm text-green-600 hover:underline'>
              กลับไปยังหน้ารวมทั้งหมด
            </Link>
          </div>
        </div>
      </div>

      <FooterSAU />
    </div>
  )
}