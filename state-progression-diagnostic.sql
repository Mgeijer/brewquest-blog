-- ==================================================
-- State Progression Diagnostic Script
-- Check current state of journey progression and identify why it hasn't moved to Alaska
-- ==================================================

-- Check what the current journey week function returns
SELECT get_current_journey_week() as calculated_current_week;

-- Check the start date configured in the function
SELECT 
  '2024-01-01'::date as configured_start_date,
  '2025-08-05'::date as actual_launch_date,
  CURRENT_DATE as today,
  EXTRACT(EPOCH FROM (CURRENT_DATE - '2024-01-01'::date)) / (7 * 24 * 60 * 60) as weeks_since_configured_start,
  EXTRACT(EPOCH FROM (CURRENT_DATE - '2025-08-05'::date)) / (7 * 24 * 60 * 60) as weeks_since_actual_launch;

-- Check current status of Alabama and Alaska specifically
SELECT 
  state_code,
  state_name,
  status,
  week_number,
  completion_date,
  created_at,
  updated_at
FROM state_progress 
WHERE state_code IN ('AL', 'AK')
ORDER BY week_number;

-- Check all states and their current status
SELECT 
  state_code,
  state_name,
  status,
  week_number,
  completion_date
FROM state_progress 
ORDER BY week_number
LIMIT 10;

-- Check if there are any states marked as 'current'
SELECT 
  COUNT(*) as current_states_count,
  STRING_AGG(state_code || ' (' || state_name || ')', ', ') as current_states
FROM state_progress 
WHERE status = 'current';

-- Check if there are any completed states
SELECT 
  COUNT(*) as completed_states_count,
  STRING_AGG(state_code || ' (' || state_name || ')', ', ') as completed_states
FROM state_progress 
WHERE status = 'completed';

-- Check what the automatic trigger would set based on current date
-- This simulates what should happen when the trigger runs
WITH current_week_calc AS (
  SELECT 
    CEIL(EXTRACT(EPOCH FROM (NOW() - '2025-08-05'::date)) / (7 * 24 * 60 * 60)) :: INTEGER as current_week_correct,
    CEIL(EXTRACT(EPOCH FROM (NOW() - '2024-01-01'::date)) / (7 * 24 * 60 * 60)) :: INTEGER as current_week_wrong
)
SELECT 
  sp.state_code,
  sp.state_name,
  sp.status as current_status,
  sp.week_number,
  cwc.current_week_correct,
  cwc.current_week_wrong,
  CASE 
    WHEN sp.week_number < cwc.current_week_correct THEN 'should_be_completed'
    WHEN sp.week_number = cwc.current_week_correct THEN 'should_be_current'
    WHEN sp.week_number > cwc.current_week_correct THEN 'should_be_upcoming'
  END as should_be_status_correct_date,
  CASE 
    WHEN sp.week_number < cwc.current_week_wrong THEN 'would_be_completed'
    WHEN sp.week_number = cwc.current_week_wrong THEN 'would_be_current'  
    WHEN sp.week_number > cwc.current_week_wrong THEN 'would_be_upcoming'
  END as would_be_status_wrong_date
FROM state_progress sp
CROSS JOIN current_week_calc cwc
WHERE sp.state_code IN ('AL', 'AK')
ORDER BY sp.week_number;

-- Check if the get_current_journey_week function exists and what it returns
SELECT 
  proname,
  prosrc
FROM pg_proc 
WHERE proname = 'get_current_journey_week';

-- Check recent audit trail entries to see if states have been updated
SELECT 
  table_name,
  record_id,
  operation,
  old_values->>'status' as old_status,
  new_values->>'status' as new_status,
  old_values->>'state_code' as state_code,
  changed_at
FROM state_progress_audit 
WHERE table_name = 'state_progress'
  AND (old_values->>'state_code' IN ('AL', 'AK') OR new_values->>'state_code' IN ('AL', 'AK'))
ORDER BY changed_at DESC
LIMIT 10;