import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iljdfvkevpyutbnnlgnn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsamRmdmtldnB5dXRibm5sZ25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc5MjU2OTcsImV4cCI6MjAwMzUwMTY5N30.VUbonVkQny2G83WFFL33WAcKefAK-ApO_XgsF2ewj2E";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
