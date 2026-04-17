import { getSupabaseClientOrThrow } from './supabaseClient'

const RUNNING_TABLE = 'running_tb'
const RUNNING_BUCKET = 'running_bk'
const RUNNING_BUCKET_FOLDER = 'runs'
const SUPABASE_STORAGE_PUBLIC_PATH = `/storage/v1/object/public/${RUNNING_BUCKET}/`

const normalizeRunPayload = ({ runDate, runLocation, runDistance, runTime, runImageUrl }) => ({
  run_date: runDate.trim(),
  run_location: runLocation.trim(),
  run_distance: Number(runDistance),
  run_time: Number(runTime),
  run_image_url: runImageUrl,
})

const getStorageObjectPathFromPublicUrl = (fileUrl) => {
  if (!fileUrl || fileUrl.startsWith('blob:')) {
    return null
  }

  try {
    const { pathname } = new URL(fileUrl)
    if (!pathname.includes(SUPABASE_STORAGE_PUBLIC_PATH)) {
      return null
    }

    return decodeURIComponent(pathname.split(SUPABASE_STORAGE_PUBLIC_PATH).pop() ?? '')
  } catch {
    return fileUrl.includes(SUPABASE_STORAGE_PUBLIC_PATH)
      ? decodeURIComponent(fileUrl.split(SUPABASE_STORAGE_PUBLIC_PATH).pop() ?? '')
      : null
  }
}

const getSafeFileExtension = (fileName) => {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? ''
  return /^[a-z0-9]+$/.test(extension) ? extension : 'bin'
}

const generateUniqueFileId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return `run-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

const buildRunImagePath = (runImageFile) => {
  const fileExtension = getSafeFileExtension(runImageFile.name)
  const uniqueId = generateUniqueFileId()
  return `${RUNNING_BUCKET_FOLDER}/${uniqueId}.${fileExtension}`
}

export const getAllRuns = async () => {
  const supabase = getSupabaseClientOrThrow()
  const { data, error } = await supabase
    .from(RUNNING_TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export const getRunById = async (id) => {
  const supabase = getSupabaseClientOrThrow()
  const { data, error } = await supabase
    .from(RUNNING_TABLE)
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data
}

export const uploadRunImage = async (runImageFile) => {
  const supabase = getSupabaseClientOrThrow()
  const objectPath = buildRunImagePath(runImageFile)
  const { error: uploadError } = await supabase.storage
    .from(RUNNING_BUCKET)
    .upload(objectPath, runImageFile)

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage.from(RUNNING_BUCKET).getPublicUrl(objectPath)
  return data.publicUrl
}

export const removeRunImage = async (runImageUrl) => {
  const supabase = getSupabaseClientOrThrow()
  const objectPath = getStorageObjectPathFromPublicUrl(runImageUrl)

  if (!objectPath) {
    return
  }

  const { error } = await supabase.storage.from(RUNNING_BUCKET).remove([objectPath])

  if (error) {
    throw error
  }
}

export const createRun = async ({ runDate, runLocation, runDistance, runTime, runImageFile }) => {
  const supabase = getSupabaseClientOrThrow()
  const runImageUrl = await uploadRunImage(runImageFile)

  const { error } = await supabase
    .from(RUNNING_TABLE)
    .insert(normalizeRunPayload({
      runDate,
      runLocation,
      runDistance,
      runTime,
      runImageUrl,
    }))

  if (error) {
    await removeRunImage(runImageUrl)
    throw error
  }
}

export const updateRun = async ({
  id,
  runDate,
  runLocation,
  runDistance,
  runTime,
  runImageFile,
  currentRunImageUrl,
}) => {
  const supabase = getSupabaseClientOrThrow()
  let nextRunImageUrl = currentRunImageUrl

  if (runImageFile) {
    nextRunImageUrl = await uploadRunImage(runImageFile)
  }

  const { error } = await supabase
    .from(RUNNING_TABLE)
    .update(normalizeRunPayload({
      runDate,
      runLocation,
      runDistance,
      runTime,
      runImageUrl: nextRunImageUrl,
    }))
    .eq('id', id)

  if (error) {
    if (runImageFile && nextRunImageUrl !== currentRunImageUrl) {
      await removeRunImage(nextRunImageUrl)
    }
    throw error
  }

  if (runImageFile && currentRunImageUrl && currentRunImageUrl !== nextRunImageUrl) {
    try {
      await removeRunImage(currentRunImageUrl)
    } catch (cleanupError) {
      console.warn('Could not remove previous run image from bucket:', cleanupError)
    }
  }

  return nextRunImageUrl
}

export const deleteRun = async (id, runImageUrl) => {
  const supabase = getSupabaseClientOrThrow()
  const { error } = await supabase.from(RUNNING_TABLE).delete().eq('id', id)

  if (error) {
    throw error
  }

  if (runImageUrl) {
    await removeRunImage(runImageUrl)
  }
}