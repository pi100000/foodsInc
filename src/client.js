import {createClient} from '@supabase/supabase-js'

export const supabase = createClient(
    "https://jtykmmviksvwaopccocp.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0eWttbXZpa3N2d2FvcGNjb2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgzNjc5NzQsImV4cCI6MTk5Mzk0Mzk3NH0.dgYuJzUBB34YEQ4jfeLqH-SCqpnwAwvaMUN6sC6GX10"
)