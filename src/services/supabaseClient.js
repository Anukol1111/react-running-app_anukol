// ไฟล์ที่ใช้ในการเชื่อมต่อกับ Supabase
import { createClient } from '@supabase/supabase-js'

// ตั้งค่าการเชื่อมต่อกับ Supabase โดยใช้ URL และ ANON KEY จากไฟล์ .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const missingSupabaseEnvVars = [
	!supabaseUrl ? 'VITE_SUPABASE_URL' : null,
	!supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY' : null,
].filter(Boolean)

export const supabaseConfigError = missingSupabaseEnvVars.length > 0
	? `Missing Supabase environment variables: ${missingSupabaseEnvVars.join(', ')}`
	: ''

export const getSupabaseClientOrThrow = () => {
	if (supabaseConfigError) {
		throw new Error(
			`${supabaseConfigError}. Add these variables in Vercel Project Settings > Environment Variables, then redeploy.`
		)
	}

	return supabase
}

// สร้าง instance ของ Supabase client เพื่อเชื่อมต่อไปยัง supabase
const supabase = supabaseConfigError ? null : createClient(supabaseUrl, supabaseAnonKey)

// ส่งออก instance ของ Supabase client เพื่อให้สามารถนำไปใช้ในไฟล์อื่น ๆ ได้
export default supabase