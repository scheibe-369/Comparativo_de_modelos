import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agwvbehvvfdozyjtcnnz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnd3ZiZWh2dmZkb3p5anRjbm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MzQ2NDUsImV4cCI6MjA4ODMxMDY0NX0.UZf3As8L5eHgMhIgKJaBlfmf2vqqXSEPTDuBOe5NfIs';

export const supabase = createClient(supabaseUrl, supabaseKey);
