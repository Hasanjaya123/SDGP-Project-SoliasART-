import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cyishjpdiwdxnceaiahp.supabase.co";
const supabaseKey = "sb_publishable_9uuxIMAFrGeEAQtfMqAE2Q_PBlduT2G";

export const supabase = createClient(supabaseUrl, supabaseKey);