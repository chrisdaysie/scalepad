# JSON Format Documentation

This folder contains assessment JSON files in the standardized format for the modern assessment system.

## 📚 Quick Start Guide

**For adding/removing assessments, see the main README:**
[../README.md](../README.md)

## Standardized JSON Format

All assessment files follow this structure:

```json
{
  "assessment_template_create_payload": {
    "title": "string",
    "description": "string",
    "is_category_weight_evenly_distributed": true,
    "categories": [
      {
        "title": "string",
        "description": "string",
        "is_question_weight_evenly_distributed": true,
        "questions": [
          {
            "title": "string",
            "description": "string",
            "remediation_tips": "string",
            "criterion_label_type_enum": "MultiResponse" | "YesNo" | "Partial",
            "criteria": [
              {
                "label_enum": "Satisfactory" | "AcceptableRisk" | "NeedsAttention" | "AtRisk" | "Unknown" | "NotApplicable" | "Yes" | "No" | "Partial" | "PartialYes" | "PartialNo",
                "description": "string"
              }
            ],
            "scoring_instructions": "string",
            "weight_in_percentage": 0 // Only required if is_question_weight_evenly_distributed is false, all must add to 100
          }
        ],
        "weight_in_percentage": 0 // Only required if is_category_weight_evenly_distributed is false, all must add to 100
      }
    ]
  }
}
```

## Key Features

- **Standardized Enums**: All response types use standardized enums instead of free-form strings
- **Simplified Weighting**: Uses boolean flags instead of explicit weight calculations
- **Cleaner Structure**: Removes redundant fields and simplifies the overall structure
- **Consistent Format**: All assessments follow the same structure for easy processing

## Available Files

- `assessment-ai-readiness-data.json` - AI Readiness Assessment
- `assessment-cs-data.json` - Customer Success Readiness Assessment
- `assessment-cyber-insurance-data.json` - Cyber Insurance Readiness Assessment
- `assessment-cyber-resilience-data.json` - Cyber Resilience Assessment
- `assessment-dwa-data.json` - Digital Work Analytics Assessment
- `assessment-new-client-comprehensive-data.json` - New Client Assessment (Comprehensive)
- `assessment-new-client-quick-data.json` - New Client Assessment (Quick)
- `assessment-technology-alignment-data.json` - Technology Alignment Assessment
- `assessment-base-policies-data.json` - Base Policies & Procedures Assessment
- `assessment-test-coffee-data.json` - Coffee Quality Assessment (Test)
- `assessment-test-water-quality-data.json` - Water Quality Assessment (Test)

## Modern System

The modern assessment system is **configuration-driven** and **API-based**:

- ✅ **No Python scripts needed**
- ✅ **No HTML generation**
- ✅ **Automatic timestamps**
- ✅ **Smart recommendations**
- ✅ **Instant updates**

For detailed instructions on adding/removing assessments, see the main README: [../README.md](../README.md)