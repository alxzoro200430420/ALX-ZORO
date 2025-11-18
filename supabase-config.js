// supabase-config.js
const SUPABASE_URL = 'https://jqpjmnqsafyhmqaehybk.supabase.co';
const SUPABASE_ANON_KEY = 'الـ anon public key هون'; // حط الـ key هنا

// إنشاء العميل
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.supabase = supabase;
console.log('✅ Supabase connected successfully!');