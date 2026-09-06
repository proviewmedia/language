import { createClient } from "@supabase/supabase-js";

// Same project/keys app.html uses — one backend, two frontends during the
// Phase 2 transition. Anon key only; never the service role key here.
const SUPABASE_URL = "https://ljichtaunpiulzjpftoc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqaWNodGF1bnBpdWx6anBmdG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1OTAxMTQsImV4cCI6MjEwNDE2NjExNH0.umBhSg6gRljQ8disxDAeU4mQEeeEyr3NqIrGDcJoyWM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface Profile {
  id: string;
  is_pro: boolean;
}
