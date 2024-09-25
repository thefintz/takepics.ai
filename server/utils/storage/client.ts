import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL) {
	throw new Error("SUPABASE_URL environment variable is not set");
}

if (!process.env.SUPABASE_KEY) {
	throw new Error("SUPABASE_KEY environment variable is not set");
}

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)

const storageRef = supabase.storage.from('generated_images');
export type UploadReturnType = ReturnType<typeof storageRef.upload>;