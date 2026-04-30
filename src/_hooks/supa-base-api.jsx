import { createClient } from "@supabase/supabase-js";

const supabaseUrl       = import.meta.env.VITE_SUPA_URL; 
const supabaseAnonKey   = import.meta.env.VITE_SUPA_ANON; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);