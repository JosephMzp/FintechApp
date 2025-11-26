import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

//const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
//const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

//export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//  auth: {
//    storage: AsyncStorage, // Aquí le decimos que use el storage del celular
//    autoRefreshToken: true,
//    persistSession: true,
//    detectSessionInUrl: false, // Importante: poner en false en React Native
//  },
//})

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);