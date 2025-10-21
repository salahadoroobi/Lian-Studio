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
    { tKey: 'output_language_en', value: 'en' },
    { tKey: 'output_language_ar', value: 'ar' },
    { tKey: 'output_language_es', value: 'es' },
    { tKey: 'output_language_fr', value: 'fr' },
    { tKey: 'output_language_de', value: 'de' },
    { tKey: 'output_language_ja', value: 'ja' },
] as const;