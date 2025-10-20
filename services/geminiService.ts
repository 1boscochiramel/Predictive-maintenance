import type { PdmAnalysis, HealthState, ShapFeature, AssetTagSummary, TagSummaryMetrics, AssetSummaryTag, ExplainPanel } from '../types';
import { TAG_REGISTRY, MANUAL_ASSET_TAGS, OVERRIDES_SCHEMA } from '../constants';

const MOCK_FEATURES: Omit<ShapFeature, 'phi' | 'direction' | 'note'>[] = [
    { feature: "rms_x", unit: "mm/s" },
    { feature: "bearing_deltaT", unit: "°C" },
    { feature: "kurtosis_y", unit: "g" },
    { feature: "motor_current", unit: "A" },
    { feature: "casing_temp", unit: "°C" },
];

const HEALTH_CONFIG = {
    Healthy: { color: '#2ECC71' },
    Degrading: { color: '#F1C40F' },
    Failure: { color: '#E74C3C' },
}

const pseudoRandom = (seed: string): number => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return (Math.abs(hash) % 1000) / 1000;
};

// --- New for v0.7 ---
const generateAssetTagSummary = (assetId: string, importMode: 'PHD' | 'CSV'): { summary: AssetTagSummary, metrics: TagSummaryMetrics, source: string } => {
    const manualTags = MANUAL_ASSET_TAGS[assetId];
    let tags: AssetSummaryTag[] = [];
    let auto_filled = false;
    let manual_tags_count = 0;
    let auto_filled_tags_count = 0;

    const tagLookup = new Map(TAG_REGISTRY.map(t => [t.tag, t]));

    if (manualTags) {
        const mapManualTags = (tagDefs: typeof manualTags.vibration, type: 'vibration' | 'temperature'): AssetSummaryTag[] => {
            return tagDefs.map(def => {
                const regInfo = tagLookup.get(def.tag);
                return {
                    ...def,
                    type,
                    unit: regInfo?.unit || 'N/A',
                    source: 'manual'
                };
            });
        };
        tags = [
            ...mapManualTags(manualTags.vibration, 'vibration'),
            ...mapManualTags(manualTags.temperature, 'temperature')
        ];
        manual_tags_count = tags.length;

    } else { // Auto-fill logic
        auto_filled = true;
        const assetNumber = assetId.split(' ')[1];
        tags = TAG_REGISTRY
            .filter(t => t.asset.includes(assetNumber))
            .map(t => {
                const type = t.tag.startsWith('VI') ? 'vibration' : (t.tag.startsWith('TI') ? 'temperature' : undefined);
                if (!type) return null;
                return {
                    tag: t.tag,
                    type: type,
                    stage: 'Auto',
                    unit: t.unit,
                    source: 'auto-fill',
                    location: t.parameter
                };
            })
            .filter((t): t is AssetSummaryTag => t !== null);
        auto_filled_tags_count = tags.length;
    }
    
    const hasVibration = tags.some(t => t.type === 'vibration');
    const hasTemperature = tags.some(t => t.type === 'temperature');
    const coverage_pct = (hasVibration && hasTemperature) ? 100 : (hasVibration || hasTemperature ? 50 : 0);

    const summary: AssetTagSummary = { asset_id: assetId, tags, auto_filled, coverage_pct };
    const metrics: TagSummaryMetrics = { manual_tags: manual_tags_count, auto_filled_tags: auto_filled_tags_count, total_tags: tags.length };
    const source = auto_filled ? (importMode === 'PHD' ? `phd://loup/${assetId.replace(' ','-')}` : 'CSV Upload') : 'Manual Registry';

    return { summary, metrics, source };
};


export const runPdmAnalysis = (assetId: string, importMode: 'PHD' | 'CSV'): Promise<PdmAnalysis> => {
    return new Promise((resolve) => {
        setTimeout(() => { // Simulate network delay
            const rand = pseudoRandom(assetId);
            const risk = Math.round(rand * 90 + 5) / 100;
            
            let health_state: HealthState;
            if (risk < 0.3) health_state = 'Healthy';
            else if (risk < 0.6) health_state = 'Degrading';
            else health_state = 'Failure';

            // --- v0.5.1 Detailed RUL Calculation Logic ---
            const rul_explain_base = {
                limit: OVERRIDES_SCHEMA.limit_L_mm_s.default,
                current: parseFloat((rand * 3 + 5).toFixed(2)),
                slope: parseFloat((0.01 + rand * 0.08).toFixed(4))
            };
            const current_x = parseFloat((rul_explain_base.current - rand * 0.2).toFixed(2));
            const current_y = parseFloat((rul_explain_base.current + rand * 0.3).toFixed(2));
            const current_z = parseFloat((rul_explain_base.current - rand * 0.1).toFixed(2));
            const calculated_rms = Math.sqrt((current_x**2 + current_y**2 + current_z**2) / 3);

            const calculated_rul_hours = (rul_explain_base.limit - calculated_rms) / rul_explain_base.slope;
            const RUL_days = Math.max(1, Math.round(calculated_rul_hours / 24));
            const RUL_ci_days: [number, number] = [Math.max(1, RUL_days - Math.round(rand * 3)), RUL_days + Math.round(rand * 4) + 1];

            const explain_panel: ExplainPanel = {
                model: 'RUL',
                narration: `Current vibration ${calculated_rms.toFixed(2)} mm/s trending at +${rul_explain_base.slope} → RUL ≈ ${Math.round(calculated_rul_hours)}h (${RUL_days} days).`,
                steps: [
                    { step: 1, desc: 'Collect RMS values', values: { X: current_x, Y: current_y, Z: current_z }, units: 'mm/s' },
                    { step: 2, desc: 'Combine to RMS', formula: 'sqrt((X²+Y²+Z²)/3)', result: `${calculated_rms.toFixed(2)} mm/s` },
                    { step: 3, desc: 'Fit robust trend', result: `+${rul_explain_base.slope.toFixed(4)}`, units: 'mm/s/h' },
                    { step: 4, desc: 'Compute RUL', formula: '(L - xₜ) / dx/dt', result: `${Math.round(calculated_rul_hours)} h ≈ ${RUL_days} days` },
                    { step: 5, desc: 'Bootstrap 95% CI', result: `[${RUL_ci_days[0]} - ${RUL_ci_days[1]}] days`}
                ],
            };
            
            const tags_tracked = TAG_REGISTRY.filter(t => t.asset.includes(assetId.split(' ')[1]))
              .slice(0, Math.floor(rand * 2) + 2)
              .map(t => ({ ...t, used_in_model: true }));
            
            const shap_summary = MOCK_FEATURES.slice(0, 5).map((feat, index) => ({
                ...feat,
                phi: parseFloat(((risk / (index + 1.5)) * pseudoRandom(assetId + feat.feature)).toFixed(4)),
                direction: (pseudoRandom(assetId + feat.feature) > 0.5 ? '+' : '-') as '+' | '-',
                note: `${feat.feature} ${pseudoRandom(assetId + feat.feature) > 0.5 ? '↑' : '↓'} risk`
            })).sort((a,b) => b.phi - a.phi);

            // --- v0.5.1 RF Explain Panel ---
            const rf_votes = { Healthy: rand * 0.3, Degrading: 1 - rand * 0.5, Failure: rand * 0.2 };
            const total_votes = rf_votes.Healthy + rf_votes.Degrading + rf_votes.Failure;
            const rf_explain_panel: ExplainPanel = {
                model: 'Random Forest',
                narration: `${Math.round(rf_votes.Degrading/total_votes * 100)}% of trees vote Degrading, driven by rising vibration trend.`,
                steps: [
                    { step: 1, desc: 'Feature vector', values: { RMS: calculated_rms.toFixed(2), "ΔT": (rand * 5 + 2).toFixed(2), "RMS_slope": rul_explain_base.slope } },
                    { step: 2, desc: 'Tree votes', result: { Healthy: parseFloat((rf_votes.Healthy/total_votes).toFixed(2)), Degrading: parseFloat((rf_votes.Degrading/total_votes).toFixed(2)), Failure: parseFloat((rf_votes.Failure/total_votes).toFixed(2)) } },
                    { step: 3, desc: 'Top features', importance: { RMS_slope: 0.41, "ΔT_slope": 0.27, Kurtosis: 0.15 } }
                ]
            };
            
            // --- v0.5.1 XGB Explain Panel ---
            const xgb_baseline = 0.30;
            const xgb_features = shap_summary.slice(0, 3).reduce((acc, curr) => ({...acc, [curr.feature]: curr.direction === '+' ? curr.phi : -curr.phi }), {});
            const xgb_explain_panel: ExplainPanel = {
                model: 'XGBoost + SHAP',
                narration: `Predicted risk ${risk.toFixed(2)} (${health_state}). High vibration and ΔT drive risk ↑.`,
                steps: [
                    { step: 1, desc: 'Baseline', result: xgb_baseline },
                    { step: 2, desc: 'SHAP features', values: xgb_features },
                    { step: 3, desc: 'Final risk', formula: 'baseline + Σφᵢ', result: risk.toFixed(2) }
                ]
            };

            // --- v0.7 Logic ---
            const { summary: asset_tag_summary, metrics: tag_summary_metrics, source: auto_fill_source } = generateAssetTagSummary(assetId, importMode);

            const analysis: PdmAnalysis = {
                // --- v0.5 & v0.5.1 Fields ---
                explain_panel,
                rf_explain_panel,
                xgb_explain_panel,

                // --- v0.7 Fields ---
                asset_tag_summary,
                tag_summary_metrics,
                auto_fill_source: asset_tag_summary.auto_filled ? auto_fill_source : undefined,

                // --- v0.6 Fields ---
                data_source: importMode,
                import_mode: importMode === 'PHD' ? 'Historian Fetch' : 'CSV Upload',
                tags_tracked,
                import_status: {
                    rows_read: 20480,
                    valid_rows: 20231,
                    quality_pct: 98.8,
                },
                rul_estimate: RUL_days,
                explanation_text: `AI predicts ${RUL_days} days remaining; based on ${tags_tracked.length} sensor tags, primarily ${tags_tracked[0].parameter}.`,
                data_quality: {
                    missing_pct: 1.2,
                    unit_mismatch: false,
                },
                source_file: importMode === 'PHD' ? `phd://loup/${assetId.replace(' ','-')}` : `C:/uploads/asset_data_${assetId.replace(' ','_')}.csv`,
                telemetry: {
                    fetch_ms: importMode === 'PHD' ? 1950 : 0,
                    parse_ms: 480,
                    map_ms: 210,
                },

                // --- v0.4a Fields (preserved for additive patch) ---
                asset_id: `LOUP-${assetId}`,
                timestamp: new Date().toISOString(),
                RUL_days,
                RUL_ci_days,
                risk: parseFloat(risk.toFixed(2)),
                health_state,
                explanation: {
                    rul_equation: "(L - x_t)/slope",
                    plain_text: `The model assesses this asset as '${health_state}' with a risk score of ${risk.toFixed(2)}. Based on rising ${shap_summary[0].feature} readings, projected maintenance is due in approximately ${RUL_days} days.`
                },
                shap_summary,
                metrics: {
                    feature_ms: Math.round(pseudoRandom(assetId + 'feature') * 600) + 200,
                    model_ms: Math.round(pseudoRandom(assetId + 'model') * 250) + 50,
                    shap_ms: Math.round(pseudoRandom(assetId + 'shap') * 400) + 100,
                    render_ms: Math.round(pseudoRandom(assetId + 'render') * 150) + 50,
                },
                ui_state: {
                    panel: "Interpretation",
                    color: HEALTH_CONFIG[health_state].color,
                },
                feedback_id: `fbk_${new Date().toISOString().replace(/\.\d+Z$/, 'Z').replace(/[:-]/g, '')}`,
                recommendation: health_state === 'Healthy' 
                    ? 'Asset operating within normal parameters. Continue routine monitoring.' 
                    : `Inspect ${shap_summary[0].feature} — high contribution to risk. Check for ${health_state === 'Degrading' ? 'early signs of wear' : 'imminent failure conditions'}.`,
            };
            
            resolve(analysis);
        }, 1500);
    });
};