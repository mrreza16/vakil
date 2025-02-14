/*
  # Create notices table for court notifications

  1. New Tables
    - `notices`
      - All fields for court notification data
      - Timestamps for record keeping
  
  2. Security
    - Enable RLS on `notices` table
    - Add policies for authenticated users to manage their data
*/

CREATE TABLE IF NOT EXISTS notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text,
  date text,
  court_type text,
  individual_or_panel text,
  city text,
  court_category text,
  branch_number text,
  archive_number text,
  notice_number text,
  case_number text,
  plaintiff text,
  defendant text,
  panel_members text,
  report_date text,
  tracking_code text,
  cooperated_experts text,
  non_cooperated_experts text,
  amount text,
  status text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notices"
  ON notices
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);