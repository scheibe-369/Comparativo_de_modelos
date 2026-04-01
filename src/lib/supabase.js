import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ovolvslspwdhqserciyi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92b2x2c2xzcHdkaHFzZXJjaXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTIyMDUsImV4cCI6MjA5MDU4ODIwNX0.yK8szy2xXR5eEhU2iNChwpo7yzKjFzHUWHOl-Pt2xds';

export const supabase = createClient(supabaseUrl, supabaseKey);
