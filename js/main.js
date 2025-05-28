import { supabase } from './supabase.js';

const user = await supabase.auth.getUser();
console.log(user);
