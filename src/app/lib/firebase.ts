import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mptggusclzjnumbrfnmpe.supabase.co';
const supabaseAnonKey = 'sb_publishable_gptlP4ytd0u-z8YAUGlR_Q_ziOAJW35';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
