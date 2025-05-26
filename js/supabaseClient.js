// supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://TU-https://ejseoopywhotaxctscbm.supabase.co.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqc2Vvb3B5d2hvdGF4Y3RzY2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNjkyMjYsImV4cCI6MjA2Mjc0NTIyNn0.DmYXz1VRK9oHu5MT0oIxiX2NanLrvTSRyo4zagLJpfk';
export const supabase = createClient(supabaseUrl, supabaseKey);