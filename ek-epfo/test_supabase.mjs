import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://vmiikhbveduhkfcrtrew.supabase.co', 'sb_publishable_LcM0Efk7Zc4Ch-DuOOvuQw_ILtD8tFS');
supabase.from('members').select('*').then(res => console.log(JSON.stringify(res.data, null, 2))).catch(console.error);
