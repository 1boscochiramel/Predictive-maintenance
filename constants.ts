import type { TagInfo } from './types';

export const REFINERY_UNITS: Record<string, string[]> = {
  'LOUP': ['99 P-02', '99 P-11', '99 C-01', '99 C-02'],
  'SEU1-3': ['SEU1-P-01', 'SEU2-C-05', 'SEU3-P-10'],
  'PDA': ['PDA-P-01', 'PDA-C-01'],
  'PDU': ['PDU-P-05', 'PDU-P-08'],
};

// FIX: Renamed the refinery unit property to `refineryUnit` to avoid conflict with the measurement `unit` from `TagInfo`.
export const TAG_REGISTRY: (Omit<TagInfo, 'used_in_model'> & { asset: string, refineryUnit: string })[] = [
    {
        refineryUnit: 'LOUP',
        asset: '99-P-02',
        category: 'Rotary',
        tag: 'VI1213AA',
        parameter: '1st Stage X-Vibration',
        unit: 'mm/s',
        description: 'Measures lateral vibration at 1st stage bearing to detect imbalance.',
    },
    {
        refineryUnit: 'LOUP',
        asset: '99-P-02',
        category: 'Rotary',
        tag: 'TI1260A',
        parameter: '1st Stage Motor Bearing Temp',
        unit: '°C',
        description: 'Tracks heat buildup in motor bearing, indicating friction or wear.',
    },
    {
        refineryUnit: 'LOUP',
        asset: '99-P-02',
        category: 'Rotary',
        tag: 'PI1255B',
        parameter: 'Discharge Pressure',
        unit: 'bar',
        description: 'Monitors the output pressure of the pump system.',
    },
    {
        refineryUnit: 'LOUP',
        asset: '99-P-11',
        category: 'Rotary',
        tag: 'VI2313AB',
        parameter: '2nd Stage Y-Vibration',
        unit: 'mm/s',
        description: 'Detects imbalance or misalignment in the second stage.',
    },
    {
        refineryUnit: 'LOUP',
        asset: '99-P-11',
        category: 'Rotary',
        tag: 'TI2360C',
        parameter: '2nd Stage Casing Temp',
        unit: '°C',
        description: 'Measures temperature on the pump casing.',
    },
     {
        refineryUnit: 'SEU1-3',
        asset: 'SEU1-P-01',
        category: 'Pump',
        tag: 'SE1-VI-001A',
        parameter: 'Motor Vibration X',
        unit: 'mm/s',
        description: 'Primary motor vibration sensor.',
    },
    {
        refineryUnit: 'SEU1-3',
        asset: 'SEU2-C-05',
        category: 'Compressor',
        tag: 'SE2-TI-105',
        parameter: 'Outlet Temperature',
        unit: '°C',
        description: 'Measures gas temperature at the compressor outlet.',
    }
];

// --- New for v0.7 ---
export interface ManualTagDef {
  tag: string;
  location: string;
  stage: string;
}

export const MANUAL_ASSET_TAGS: Record<string, { vibration: ManualTagDef[], temperature: ManualTagDef[] }> = {
  '99 P-02': {
    vibration: [
      { tag: 'VI1213AA', location: '1st Stage X', stage: '1X' },
      { tag: 'VI1213AB', location: '1st Stage Y', stage: '1Y' },
      { tag: 'VI1213AC', location: '1st Stage Z', stage: '1Z' },
      { tag: 'VI1214AA', location: '2nd Stage X', stage: '2X' },
      { tag: 'VI1214AB', location: '2nd Stage Y', stage: '2Y' },
      { tag: 'VI1214AC', location: '2nd Stage Z', stage: '2Z' },
    ],
    temperature: [
      { tag: 'TI1260A', location: '1st Stage Motor Bearing', stage: '1M' },
      { tag: 'TI1261A', location: '1st Stage Impeller Bearing', stage: '1I' },
      { tag: 'TI1262A', location: '1st Stage Motor Bearing 2', stage: '1M2' },
      { tag: 'TI1263A', location: '2nd Stage Motor Bearing', stage: '2M' },
      { tag: 'TI1264A', location: '2nd Stage Impeller Bearing', stage: '2I' },
      { tag: 'TI1265A', location: '2nd Stage Motor Bearing 2', stage: '2M2' },
    ]
  },
  '99 P-11': {
    vibration: [
      { tag: 'VI2313AA', location: '1st Stage X', stage: '1X' },
      { tag: 'VI2313AB', location: '1st Stage Y', stage: '1Y' },
      { tag: 'VI2313AC', location: '1st Stage Z', stage: '1Z' },
      { tag: 'VI2314AA', location: '2nd Stage X', stage: '2X' },
      { tag: 'VI2314AB', location: '2nd Stage Y', stage: '2Y' },
      { tag: 'VI2314AC', location: '2nd Stage Z', stage: '2Z' },
    ],
    temperature: [
      { tag: 'TI2360A', location: '1st Stage Motor Bearing', stage: '1M' },
      { tag: 'TI2361A', location: '1st Stage Impeller Bearing', stage: '1I' },
      { tag: 'TI2362A', location: '1st Stage Motor Bearing 2', stage: '1M2' },
      { tag: 'TI2363A', location: '2nd Stage Motor Bearing', stage: '2M' },
      { tag: 'TI2364A', location: '2nd Stage Impeller Bearing', stage: '2I' },
      { tag: 'TI2365A', location: '2nd Stage Motor Bearing 2', stage: '2M2' },
    ]
  }
};

// --- New for v0.5 ---
export const OVERRIDES_SCHEMA = {
  limit_L_mm_s: { min: 6.0, max: 9.6, default: 8.0, step: 0.1, units: "mm/s", label: "Vibration Limit (L)", tooltip: "ISO 20816 zone B limit for pumps." },
  trend_window_h: { min: 6, max: 168, default: 24, step: 6, units: "h", label: "Trend Window", tooltip: "Longer window = smoother trend." },
  ewma_alpha: { min: 0.05, max: 0.40, default: 0.2, step: 0.01, units: "", label: "EWMA Alpha", tooltip: "Lower α filters noise." },
  rf_degrading_threshold: { min: 0.3, max: 0.7, default: 0.5, step: 0.05, units: "", label: "Degrading Threshold", tooltip: "Probability threshold for 'Degrading' state." },
  rf_failure_threshold: { min: 0.6, max: 0.9, default: 0.7, step: 0.05, units: "", label: "Failure Threshold", tooltip: "Probability threshold for 'Failure' state." },
};