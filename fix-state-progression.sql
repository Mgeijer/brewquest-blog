-- ==================================================
-- Fix State Progression Script
-- Update the get_current_journey_week function to use correct launch date
-- and manually set correct state statuses
-- ==================================================

-- 1. First, update the get_current_journey_week function to use the correct launch date
CREATE OR REPLACE FUNCTION get_current_journey_week()
RETURNS INTEGER AS $$
DECLARE
  start_date DATE := '2025-08-05';  -- Correct launch date
  current_week INTEGER;
BEGIN
  current_week := CEIL(EXTRACT(EPOCH FROM (NOW() - start_date)) / (7 * 24 * 60 * 60)) :: INTEGER;
  RETURN GREATEST(current_week, 1);  -- Return at least week 1, no upper limit until journey progresses
END;
$$ LANGUAGE plpgsql;

-- 2. Check what the correct current week should be
SELECT 
  get_current_journey_week() as correct_current_week,
  '2025-08-05'::date as launch_date,
  CURRENT_DATE as today,
  EXTRACT(days FROM (CURRENT_DATE - '2025-08-05'::date)) as days_since_launch;

-- 3. Update state statuses based on the correct current week
-- This will be run after we see what the function returns

-- If we're on or after August 12 (Week 2), Alabama should be completed and Alaska should be current
-- If we're still in Week 1 (August 5-11), Alabama should stay current

DO $$
DECLARE
  current_week INTEGER;
BEGIN
  -- Get the correct current week
  current_week := get_current_journey_week();
  
  -- Update Alabama status
  IF current_week >= 2 THEN
    UPDATE state_progress 
    SET 
      status = 'completed',
      completion_date = '2025-08-11 23:59:59'::timestamp with time zone,
      updated_at = NOW()
    WHERE state_code = 'AL' AND status != 'completed';
    
    RAISE NOTICE 'Alabama marked as completed (Week % >= 2)', current_week;
  ELSE
    UPDATE state_progress 
    SET 
      status = 'current',
      completion_date = NULL,
      updated_at = NOW()
    WHERE state_code = 'AL' AND status != 'current';
    
    RAISE NOTICE 'Alabama remains current (Week %)', current_week;
  END IF;
  
  -- Update Alaska status
  IF current_week >= 2 THEN
    UPDATE state_progress 
    SET 
      status = 'current',
      completion_date = NULL,
      updated_at = NOW()
    WHERE state_code = 'AK' AND status != 'current';
    
    RAISE NOTICE 'Alaska marked as current (Week % >= 2)', current_week;
  ELSE
    UPDATE state_progress 
    SET 
      status = 'upcoming',
      completion_date = NULL,
      updated_at = NOW()
    WHERE state_code = 'AK' AND status != 'upcoming';
    
    RAISE NOTICE 'Alaska remains upcoming (Week %)', current_week;
  END IF;
  
  -- Update Arizona to upcoming if needed
  UPDATE state_progress 
  SET 
    status = 'upcoming',
    completion_date = NULL,
    updated_at = NOW()
  WHERE state_code = 'AZ' AND status != 'upcoming';
  
  RAISE NOTICE 'Process completed for current week %', current_week;
END $$;

-- 4. Verify the changes
SELECT 
  state_code,
  state_name,
  status,
  week_number,
  completion_date,
  updated_at
FROM state_progress 
WHERE state_code IN ('AL', 'AK', 'AZ')
ORDER BY week_number;

-- 5. Check if any other states need status updates
SELECT 
  state_code,
  state_name,
  status,
  week_number,
  get_current_journey_week() as current_week,
  CASE 
    WHEN week_number < get_current_journey_week() THEN 'should_be_completed'
    WHEN week_number = get_current_journey_week() THEN 'should_be_current'
    ELSE 'should_be_upcoming'
  END as should_be
FROM state_progress 
WHERE status != CASE 
  WHEN week_number < get_current_journey_week() THEN 'completed'
  WHEN week_number = get_current_journey_week() THEN 'current'
  ELSE 'upcoming'
END
ORDER BY week_number;

-- 6. Create a milestone for the transition if Alabama was just completed
DO $$
BEGIN
  -- Only create milestone if Alabama was just marked as completed
  IF EXISTS (
    SELECT 1 FROM state_progress 
    WHERE state_code = 'AL' 
    AND status = 'completed' 
    AND completion_date::date = CURRENT_DATE
  ) THEN
    INSERT INTO journey_milestones (
      milestone_type,
      title,
      description,
      state_code,
      week_number,
      milestone_date,
      celebration_level,
      social_media_posted,
      is_public
    ) VALUES (
      'state_completion',
      'Alabama Journey Complete!',
      'Successfully completed the craft beer exploration of Alabama, featuring local breweries and unique Southern beer culture.',
      'AL',
      1,
      NOW(),
      'major',
      false,
      true
    );
    
    RAISE NOTICE 'Created completion milestone for Alabama';
  END IF;
END $$;

-- 7. Final verification
SELECT 
  'Current journey week: ' || get_current_journey_week() as status_summary
UNION ALL
SELECT 
  'States with correct status: ' || COUNT(*)::text
FROM state_progress 
WHERE status = CASE 
  WHEN week_number < get_current_journey_week() THEN 'completed'
  WHEN week_number = get_current_journey_week() THEN 'current'
  ELSE 'upcoming'
END
UNION ALL
SELECT 
  'Current state: ' || STRING_AGG(state_name, ', ')
FROM state_progress 
WHERE status = 'current'
UNION ALL
SELECT 
  'Completed states: ' || COALESCE(STRING_AGG(state_name, ', '), 'None')
FROM state_progress 
WHERE status = 'completed';