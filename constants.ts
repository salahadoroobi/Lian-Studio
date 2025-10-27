
export const MAX_IMAGES = 5;
export const MAX_MERGE_IMAGES = 15;
export const MAX_FILE_SIZE_MB = 10;

// Fix: Refactor to use a specific translation key (`tKey`) to avoid type errors.
export const ASPECT_RATIOS = [
    { tKey: 'aspect_ratio_Default', value: 'Default' },
    { tKey: 'aspect_ratio_Square', value: '1:1' },
    { tKey: 'aspect_ratio_Portrait', value: '9:16' },
    { tKey: 'aspect_ratio_Landscape', value: '16:9' },
] as const;

// Fix: Refactor to use a specific translation key (`tKey`) to avoid type errors.
export const QUALITY_OPTIONS = [
    { tKey: 'quality_Standard', value: 'Standard' },
    { tKey: 'quality_HD', value: 'HD' },
] as const;

// Fix: Refactor to use a specific translation key (`tKey`) to avoid type errors.
export const EXTRACTION_LANGUAGES = [
    { tKey: 'output_language_en', value: 'English' },
    { tKey: 'output_language_ar', value: 'Arabic' },
    { tKey: 'output_language_es', value: 'Spanish' },
    { tKey: 'output_language_fr', value: 'French' },
    { tKey: 'output_language_de', value: 'German' },
    { tKey: 'output_language_ja', value: 'Japanese' },
] as const;

export const TRANSLATION_LANGUAGES = [
    { tKey: 'output_language_en', value: 'English' },
    { tKey: 'output_language_ar', value: 'Arabic' },
    { tKey: 'output_language_es', value: 'Spanish' },
    { tKey: 'output_language_fr', value: 'French' },
    { tKey: 'output_language_de', value: 'German' },
    { tKey: 'output_language_ja', value: 'Japanese' },
    { tKey: 'output_language_zh', value: 'Chinese' },
    { tKey: 'output_language_ru', value: 'Russian' },
    { tKey: 'output_language_hi', value: 'Hindi' },
] as const;

export const FORMALITY_OPTIONS = [
    { tKey: 'formality_default', value: 'default' },
    { tKey: 'formality_formal', value: 'formal' },
    { tKey: 'formality_informal', value: 'informal' },
] as const;

export const CORRECTION_LEVELS = [
    { tKey: 'correction_level_basic', value: 'basic' },
    { tKey: 'correction_level_advanced', value: 'advanced' },
    { tKey: 'correction_level_rewrite', value: 'rewrite' },
] as const;

export const TARGET_AUDIENCES = [
    { tKey: 'audience_general', value: 'general' },
    { tKey: 'audience_academic', value: 'academic' },
    { tKey: 'audience_business', value: 'business' },
] as const;

export const TONES_STEALTH = [
    { tKey: 'tone_professional', value: 'professional' },
    { tKey: 'tone_casual', value: 'casual' },
    { tKey: 'tone_academic', value: 'academic' },
    { tKey: 'tone_creative', value: 'creative' },
] as const;

export const COMPLEXITY_LEVELS = [
    { tKey: 'complexity_simple', value: 'simple' },
    { tKey: 'complexity_standard', value: 'standard' },
    { tKey: 'complexity_advanced', value: 'advanced' },
] as const;
