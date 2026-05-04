import { createClient } from "@supabase/supabase-js";

// anon key is safe to be public
export const supabase = createClient(
  "https://rvncjvivfrfvptmzodcv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bmNqdml2ZnJmdnB0bXpvZGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTA5NjYsImV4cCI6MjA5MTc4Njk2Nn0.7QJwrs5b7Px13BkbbXSeXsaNWJtg8MrceJaIkdSnVss"
);
