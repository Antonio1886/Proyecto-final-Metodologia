// js/supabase.js
import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'; 

const SUPABASE_URL = 'https://sbhvdpmmhqkpqbhsboev.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiaHZkcG1taHFrcHFiaHNib2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDk0NzMsImV4cCI6MjA2MzgyNTQ3M30.2UrKxt1jsJBImsXUo36Kq-8bHNnBk5A908p6qjmcWf4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
