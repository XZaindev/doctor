-- ============================================
-- ANEMIA RESEARCH APP - DATABASE SCHEMA
-- Supabase PostgreSQL
-- ============================================

-- 1. USERS TABLE (Doctors/Researchers)
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  institution TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. PATIENT RECORDS TABLE
CREATE TABLE patient_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id TEXT NOT NULL, -- E.g., "P-001-2024"
  data_collection_date DATE NOT NULL,
  
  -- Step 0: Patient Identification
  -- (patient_id and data_collection_date above)
  
  -- Step 1: Eligibility Criteria
  inclusion_age_18 BOOLEAN,
  inclusion_dialysis_3months BOOLEAN,
  inclusion_dialysis_center BOOLEAN,
  inclusion_informed_consent BOOLEAN,
  
  exclusion_bleeding BOOLEAN,
  exclusion_transfusion BOOLEAN,
  exclusion_hematologic_malignancy BOOLEAN,
  exclusion_chemotherapy BOOLEAN,
  exclusion_pregnancy BOOLEAN,
  
  eligibility_status TEXT CHECK (eligibility_status IN ('Included', 'Excluded')),
  eligibility_notes TEXT,
  
  -- Step 2: Demographics & Socioeconomic
  age_years INTEGER,
  gender TEXT CHECK (gender IN ('Male', 'Female')),
  marital_status TEXT CHECK (marital_status IN ('Single', 'Married', 'Divorced', 'Widowed')),
  education_level TEXT CHECK (education_level IN ('Illiterate', 'Read & Write', 'Primary-Intermediate', 'Secondary', 'University or Higher')),
  employment_status TEXT CHECK (employment_status IN ('Employed (Full-time)', 'Employed (Part-time)', 'Unemployed-Retired', 'Homemaker')),
  residence_type TEXT CHECK (residence_type IN ('Urban', 'Rural')),
  weight_kg NUMERIC(5,2),
  height_cm NUMERIC(5,2),
  
  -- Step 3: Medical History & Comorbidities
  esrd_cause TEXT CHECK (esrd_cause IN ('Diabetic Nephropathy', 'Hypertensive Nephropathy', 'Glomerulonephritis', 'Polycystic Kidney Disease (PKD)', 'Unknown-Idiopathic', 'Other')),
  esrd_cause_other TEXT,
  ckd_duration_years NUMERIC(5,2),
  
  comorbidities TEXT[], -- Array of selected comorbidities
  hospitalization_count TEXT CHECK (hospitalization_count IN ('None', '1 time', '≥ 2 times')),
  
  -- Step 4: Dialysis Parameters
  dialysis_duration_value NUMERIC(5,2),
  dialysis_duration_unit TEXT CHECK (dialysis_duration_unit IN ('Months', 'Years')),
  dialysis_sessions_per_week TEXT CHECK (dialysis_sessions_per_week IN ('1 session/week', '2 sessions/week', '3 sessions/week')),
  session_duration TEXT CHECK (session_duration IN ('3 hours', '3.5 hours', '4 hours')),
  vascular_access_type TEXT CHECK (vascular_access_type IN ('Arteriovenous Fistula (AVF)', 'Arteriovenous Graft (AVG)', 'Permcath (Tunneled Cuffed Catheter)', 'Temporary Non-tunneled Catheter')),
  kt_v NUMERIC(3,2), -- Optional
  
  -- Step 5: Laboratory Tests
  hemoglobin_g_dl NUMERIC(4,2) NOT NULL,
  anemia_severity TEXT, -- Calculated: Non-anemic, Mild, Moderate, Severe
  
  ferritin_ng_ml NUMERIC(8,2),
  tsat_percent NUMERIC(5,2),
  
  albumin_g_dl NUMERIC(4,2),
  crp_mg_l NUMERIC(6,2),
  
  ipth_pg_ml NUMERIC(8,2),
  
  -- Step 6: Treatments & Transfusion History
  esa_therapy BOOLEAN DEFAULT FALSE,
  esa_dose_frequency TEXT,
  
  iron_supplementation TEXT CHECK (iron_supplementation IN ('None', 'Oral Iron', 'Intravenous (IV) Iron')),
  
  vitamin_b12 BOOLEAN DEFAULT FALSE,
  folic_acid BOOLEAN DEFAULT FALSE,
  
  blood_transfusion_6months BOOLEAN DEFAULT FALSE,
  transfusion_units_count INTEGER,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes for faster queries
  CONSTRAINT unique_patient_per_date UNIQUE (doctor_id, patient_id, data_collection_date)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_patient_records_doctor_id ON patient_records(doctor_id);
CREATE INDEX idx_patient_records_created_at ON patient_records(created_at DESC);
CREATE INDEX idx_patient_records_eligibility ON patient_records(eligibility_status);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_records ENABLE ROW LEVEL SECURITY;

-- Doctors can only view their own records
CREATE POLICY "Doctors can view own records"
  ON patient_records
  FOR SELECT
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert own records"
  ON patient_records
  FOR INSERT
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own records"
  ON patient_records
  FOR UPDATE
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete own records"
  ON patient_records
  FOR DELETE
  USING (doctor_id = auth.uid());

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to calculate anemia severity based on hemoglobin and gender
CREATE OR REPLACE FUNCTION calculate_anemia_severity(
  hb NUMERIC,
  gender TEXT
) RETURNS TEXT AS $$
BEGIN
  IF gender = 'Female' THEN
    IF hb >= 12.0 THEN RETURN 'Non-anemic';
    ELSIF hb >= 10.0 AND hb < 12.0 THEN RETURN 'Mild';
    ELSIF hb >= 8.0 AND hb < 10.0 THEN RETURN 'Moderate';
    ELSE RETURN 'Severe';
    END IF;
  ELSIF gender = 'Male' THEN
    IF hb >= 13.0 THEN RETURN 'Non-anemic';
    ELSIF hb >= 10.0 AND hb < 13.0 THEN RETURN 'Mild';
    ELSIF hb >= 8.0 AND hb < 10.0 THEN RETURN 'Moderate';
    ELSE RETURN 'Severe';
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to determine eligibility
CREATE OR REPLACE FUNCTION calculate_eligibility_status(
  inc_age BOOLEAN,
  inc_dialysis BOOLEAN,
  inc_center BOOLEAN,
  inc_consent BOOLEAN,
  exc_bleeding BOOLEAN,
  exc_transfusion BOOLEAN,
  exc_malignancy BOOLEAN,
  exc_chemo BOOLEAN,
  exc_pregnancy BOOLEAN
) RETURNS TEXT AS $$
BEGIN
  IF (inc_age = TRUE AND 
      inc_dialysis = TRUE AND 
      inc_center = TRUE AND 
      inc_consent = TRUE AND
      exc_bleeding = FALSE AND
      exc_transfusion = FALSE AND
      exc_malignancy = FALSE AND
      exc_chemo = FALSE AND
      exc_pregnancy = FALSE) THEN
    RETURN 'Included';
  ELSE
    RETURN 'Excluded';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- TRIGGER for updating timestamps
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_patient_records_updated_at
  BEFORE UPDATE ON patient_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON doctors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS (for easier querying)
-- ============================================

CREATE VIEW patient_summary AS
SELECT 
  pr.id,
  pr.patient_id,
  pr.data_collection_date,
  pr.age_years,
  pr.gender,
  pr.hemoglobin_g_dl,
  pr.anemia_severity,
  pr.eligibility_status,
  d.email as doctor_email,
  d.full_name as doctor_name,
  pr.created_at
FROM patient_records pr
JOIN doctors d ON pr.doctor_id = d.id
ORDER BY pr.created_at DESC;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
