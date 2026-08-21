import { supabase } from './supabase'

export async function uploadSkinPhoto(file: File, userId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('skin-photos')
    .upload(fileName, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('skin-photos')
    .getPublicUrl(fileName)

  return { path: data.path, url: publicUrl }
}