export interface ShapFeature {
  feature: string;
  unit?: string;
  phi: number;
  direction: '+' | '-';
  note?: string;
}

export type HealthState = 'Healthy' | 'Degrading' | 'Failure';

export interface Explanation {
    rul_equation: string;
    plain_text: string;
}

export interface UiState {
    panel: string;
    user_action?: string;
    latency_ms?: number;
    color: string;
}

export interface PerformanceMetrics {
    feature_ms: number;
    model_ms: number;
    shap_ms: number;
    render_ms: number;
}

export interface AccessibilityMetrics {
    contrast_ok: boolean;
    keyboard_ok: boolean;

    mobile_ok: boolean;
}

// --- New types for v0.6 ---
export interface TagInfo {
    tag: string;
    parameter: string;
    unit: string;
    used_in_model: boolean;
    description?: string;
    category?: string;
}

export interface ImportStatus {
    rows_read: number;
    valid_rows: number;
    quality_pct: number;
}

export interface DataQuality {
    missing_pct: number;
    unit_mismatch: boolean;
}

export interface ImportTelemetry {
    fetch_ms: number;
    parse_ms: number;
    map_ms: number;
}


// --- New types for v0.7 ---
export interface AssetSummaryTag {
    tag: string;
    type: 'vibration' | 'temperature';
    stage: string; 
    unit: string;
    source: 'manual' | 'auto-fill';
    location: string;
}

export interface AssetTagSummary {
    asset_id: string;
    tags: AssetSummaryTag[];
    auto_filled: boolean;
    coverage_pct: number;
}

export interface TagSummaryMetrics {
    manual_tags: number;
    auto_filled_tags: number;
    total_tags: number;
}

// --- Types for v0.5 & v0.5.1 ---
export interface ExplainStep {
    step: number;
    desc: string;
    formula?: string;
    result?: string | number | Record<string, number>;
    values?: Record<string, number | string>;
    units?: string;
    importance?: Record<string, number>;
}

export interface ExplainPanel {
    model: 'RUL' | 'Random Forest' | 'XGBoost + SHAP';
    steps: ExplainStep[];
    units?: string;
    narration?: string;
}

export interface OverrideUI {
    parameter: string;
    user_value: number;
    recommended_range: [number, number];
    status: 'accepted' | 'rejected';
    impact?: string;
}

export interface Audit {
    user: string;
    timestamp: string;
    change_reason: string;
}


// --- Main Analysis Type (Additive Patch) ---
export interface PdmAnalysis {
  // --- Fields from v0.4a ---
  asset_id: string;
  timestamp: string;
  RUL_days: number;
  risk: number;
  health_state: HealthState;
  shap_summary: ShapFeature[];
  explanation: Explanation;
  metrics: PerformanceMetrics;
  ui_state: UiState;
  feedback_id: string;
  
  // Optional fields from v0.4a
  window_s?: number;
  units?: {
    vibration: string;
    temperature: string;
  };
  RUL_method?: string;
  RUL_ci_days?: [number, number];
  models?: {
    rf_ver: string;
    xgb_ver: string;
    feature_schema: string;
  };
  recommendation?: string;
  tests_passed?: string[];
  changelog_ref?: string;
  accessibility?: AccessibilityMetrics;

  // --- New Additive Fields from v0.6 ---
  data_source?: 'PHD' | 'CSV';
  import_mode?: 'Historian Fetch' | 'CSV Upload';
  tags_tracked?: TagInfo[];
  import_status?: ImportStatus;
  rul_estimate?: number; // Kept for compatibility with new schema, alias for RUL_days
  explanation_text?: string; // Kept for compatibility, alias for explanation.plain_text
  data_quality?: DataQuality;
  source_file?: string;
  telemetry?: ImportTelemetry;

  // --- New Additive Fields from v0.7 ---
  asset_tag_summary?: AssetTagSummary;
  auto_fill_source?: string;
  tag_summary_metrics?: TagSummaryMetrics;
  
  // --- New Additive Fields from v0.5 & v0.5.1 ---
  explain_panel?: ExplainPanel; // RUL explanation
  rf_explain_panel?: ExplainPanel; // New for v0.5.1
  xgb_explain_panel?: ExplainPanel; // New for v0.5.1
  override_ui?: OverrideUI;
  audit?: Audit;
}