-- Drop existing policies on scan_history
DROP POLICY IF EXISTS "Users can view own scans" ON public.scan_history;
DROP POLICY IF EXISTS "Users can insert own scans" ON public.scan_history;
DROP POLICY IF EXISTS "Users can update own scans" ON public.scan_history;
DROP POLICY IF EXISTS "Users can delete own scans" ON public.scan_history;

-- Create new policies explicitly for authenticated users only
CREATE POLICY "Users can view own scans" 
ON public.scan_history 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans" 
ON public.scan_history 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scans" 
ON public.scan_history 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scans" 
ON public.scan_history 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);