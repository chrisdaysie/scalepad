# Assessment System - Quick Start Guide

## 🚀 How to Add a New Assessment

### Option 1: Simple Command (Recommended)
```bash
node scripts/add-assessment.js "Test Coffee Assessment"
```

This will automatically:
- ✅ Create the JSON file with a template
- ✅ Add the config entry
- ✅ Set up proper naming and structure

### Option 2: Manual Steps
#### Step 1: Create the Assessment JSON File
Create a new JSON file in `src/app/lmx/assessments/data/json/`:

```bash
# Example: assessment-test-coffee-data.json
```

#### Step 2: Add Configuration Entry
Add to `src/app/lmx/assessments/data/assessment-configs.json`:

```json
{
  "assessment_types": {
    "test-coffee": {
      "aliases": ["coffee", "test-coffee"],
      "json_file": "assessment-test-coffee-data.json",
      "recommendation_function": "generate_ai_recommendations",
      "titles": [
        "Coffee Quality Strategy",
        "Bean Selection & Sourcing",
        "Brewing Process Optimization",
        "Quality Control & Testing",
        "Customer Experience Enhancement"
      ],
      "keywords": ["coffee", "quality", "brewing", "beans"],
      "description": "Coffee quality assessment"
    }
  }
}
```

### Step 3: Done! ✅
The assessment will automatically appear on the assessments page with:
- ✅ Proper mixed case title
- ✅ Dynamic timestamp
- ✅ Working run/view/download buttons
- ✅ Smart recommendations

---

## 🗑️ How to Remove an Assessment

### Option 1: Remove from Config (Keeps Data)
Remove the entry from `src/app/lmx/assessments/data/assessment-configs.json`:
```json
{
  "assessment_types": {
    // Remove the assessment entry here
  }
}
```

### Option 2: Remove Completely
1. Delete the config entry (see Option 1)
2. Delete the JSON file: `src/app/lmx/assessments/data/json/assessment-[name]-data.json`

### Option 3: Simple Command
```bash
node scripts/remove-assessment.js "Test Coffee Assessment"
```

This will automatically:
- ✅ Remove the config entry
- ✅ Delete the JSON file
- ✅ Clean up completely

---

## 📋 Assessment JSON Structure

```json
{
  "assessment_template_create_payload": {
    "title": "Test Coffee Assessment",
    "description": "Comprehensive coffee quality evaluation...",
    "categories": [
      {
        "title": "Bean Quality",
        "description": "Evaluates coffee bean selection...",
        "questions": [
          {
            "title": "Bean Freshness",
            "description": "How fresh are your coffee beans?",
            "criteria": [
              {"label_enum": "AtRisk", "description": "Stale beans"},
              {"label_enum": "NeedsAttention", "description": "Somewhat fresh"},
              {"label_enum": "Satisfactory", "description": "Very fresh"}
            ]
          }
        ]
      }
    ]
  }
}
```

---

## 🎯 Quick Examples

### Add "Test Coffee Assessment"
1. Create `assessment-test-coffee-data.json`
2. Add config entry with `"test-coffee"` key
3. Done!

### Add "Data Privacy Assessment"  
1. Create `assessment-data-privacy-data.json`
2. Add config entry with `"data-privacy"` key
3. Done!

### Remove "Test Coffee Assessment"
1. Delete config entry for `"test-coffee"`
2. Optionally delete `assessment-test-coffee-data.json`

---

## 🔧 Configuration Options

| Field | Required | Description |
|-------|----------|-------------|
| `aliases` | Yes | Alternative names for the assessment |
| `json_file` | Yes | Path to the assessment JSON file |
| `recommendation_function` | No | Custom recommendation function (defaults to AI) |
| `titles` | Yes | Category titles for recommendations |
| `keywords` | Yes | Keywords for search and categorization |
| `description` | Yes | Human-readable description |

---

## 🎉 That's It!

The modern system is **configuration-driven** - just add a JSON file and a config entry, and everything works automatically!

- ✅ **No Python scripts needed**
- ✅ **No HTML generation**
- ✅ **No manual file management**
- ✅ **Automatic timestamps**
- ✅ **Smart recommendations**

Your assessment will be live immediately! 🚀
