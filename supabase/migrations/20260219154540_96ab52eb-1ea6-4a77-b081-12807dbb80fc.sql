
-- Drop existing SELECT policy on notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;

-- Recreate with explicit authenticated role restriction
CREATE POLICY "Users can view own notifications" 
ON public.notifications 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Also restrict UPDATE policy to authenticated
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

CREATE POLICY "Users can update own notifications" 
ON public.notifications 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);
