import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import FooterSAU from './../components/FooterSAU'
import { getRunById, updateRun } from './../services/runningService'

export default function UpdateRun() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [runDate, setRunDate] = useState('')
  const [runLocation, setRunLocation] = useState('')
  const [runDistance, setRunDistance] = useState('')
  const [runTime, setRunTime] = useState('')
  const [runImagePreview, setRunImagePreview] = useState('')
  const [currentRunImageUrl, setCurrentRunImageUrl] = useState('')
  const [runImageFile, setRunImageFile] = useState(null)

  useEffect(() => {
    const fetchRun = async () => {
      try {
        const data = await getRunById(id)
        setRunDate(data.run_date)
        setRunLocation(data.run_location)
        setRunDistance(String(data.run_distance))
        setRunTime(String(data.run_time))
        setRunImagePreview(data.run_image_url)
        setCurrentRunImageUrl(data.run_image_url)
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'โหลดข้อมูลไม่สำเร็จ',
          text: 'ไม่พบข้อมูลการวิ่งที่ต้องการแก้ไข',
        })
        navigate('/showallrun')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRun()
  }, [id, navigate])

  useEffect(() => {
    return () => {
      if (runImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(runImagePreview)
      }
    }
  }, [runImagePreview])

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
    if (!runDate || !runLocation || !runDistance || !runTime) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบ',
        text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
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
      const nextRunImageUrl = await updateRun({
        id,
        runDate,
        runLocation,
        runDistance,
        runTime,
        runImageFile,
        currentRunImageUrl,
      })

      setCurrentRunImageUrl(nextRunImageUrl)

      await Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ',
        text: 'แก้ไขข้อมูลการวิ่งเรียบร้อยแล้ว',
      })

      navigate('/showallrun')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'บันทึกไม่สำเร็จ',
        text: error.message || 'ไม่สามารถแก้ไขข้อมูลการวิ่งได้ กรุณาตรวจสอบ Supabase',
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
            <p className='text-center text-lg font-bold text-blue-700'>วิ่งกันเถอะ (แก้ไข)</p>

            <div className='mt-8 w-full max-w-md border border-slate-300 px-4 py-5'>
              {isLoading ? (
                <div className='py-8 text-center text-sm text-slate-500'>กำลังโหลดข้อมูล...</div>
              ) : (
                <div className='space-y-3'>
                  <div>
                    <label className='mb-1 block text-sm'>วันที่วิ่ง</label>
                    <input
                      value={runDate}
                      onChange={(event) => setRunDate(event.target.value)}
                      type='text'
                      className='w-full rounded-sm border border-slate-400 px-3 py-2 text-sm outline-none focus:border-blue-500'
                    />
                  </div>

                  <div>
                    <label className='mb-1 block text-sm'>สถานที่วิ่ง</label>
                    <input
                      value={runLocation}
                      onChange={(event) => setRunLocation(event.target.value)}
                      type='text'
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
                      className='w-full rounded-sm border border-slate-400 px-3 py-2 text-sm outline-none focus:border-blue-500'
                    />
                  </div>

                  <div>
                    <label className='mb-1 block text-sm'>อัปโหลดรูป</label>
                    <div className='flex items-center gap-3'>
                      <input
                        id='update-run-image'
                        onChange={handleImageChange}
                        type='file'
                        accept='image/*'
                        className='hidden'
                      />
                      <label
                        htmlFor='update-run-image'
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

                  <button
                    onClick={handleSaveClick}
                    className='mt-6 w-full rounded-sm bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800'
                  >
                    บันทึกการวิ่ง
                  </button>
                </div>
              )}
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