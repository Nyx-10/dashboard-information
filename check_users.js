import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('profiles').select('id, username, email').ilike('username', '%Ichigo%');
  console.log('Profiles:', data);
  const { data: msgs, error: err2 } = await supabase.from('messages').select('*').limit(10);
  console.log('Messages sample:', msgs);
}
check();
