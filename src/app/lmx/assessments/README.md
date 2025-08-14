# Assessment System - Quick Start Guide

## 🚀 How to Add a New Assessment

### ⚠️ IMPORTANT: Use the Script (Recommended)
The script handles all the complexity for you. **Don't manually edit files unless you know what you're doing.**

```bash
node scripts/add-assessment.js "Your Assessment Name"
```

This will automatically:
- ✅ Create the JSON file with proper structure
- ✅ Add the config entry with correct metadata
- ✅ Set up proper naming and file paths
- ✅ Avoid common pitfalls (JSON syntax errors, wrong file names, etc.)

### 🔧 After Running the Script
1. **Replace the template content** in the generated JSON file with your actual assessment data
2. **Update the config** if needed (the script creates basic metadata)
3. **Test the assessment** by visiting `/lmx/assessments`

### ❌ Common Mistakes to Avoid
- **Don't manually edit config files** - use the script
- **Don't create duplicate files** - the script handles naming
- **Don't forget to replace template content** - the script creates a basic template
- **Don't use wrong file names** - the script ensures consistency

### Option 2: Manual Steps (Advanced Users Only)
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

## 🔧 Troubleshooting

### Assessment Not Showing Up?
1. **Check the API**: Visit `/api/assessments` to see if the assessment is in the API response
2. **Check the page**: Visit `/lmx/assessments` to see if it appears in the UI
3. **Check file paths**: Ensure the JSON file exists and the config points to the correct file
4. **Check JSON syntax**: Validate your JSON file for syntax errors
5. **Check browser console**: Look for any JavaScript errors

### React Hook Errors?
- The assessments page uses React hooks that can be sensitive to dependency changes
- If you see "useEffect changed size" errors, check the dependency arrays
- The page should automatically load API data on mount

### JSON Structure Issues?
- Don't include `"is_category_weight_evenly_distributed": true` at the top level
- Follow the exact structure shown in the examples
- Use the working assessments as templates

## 🎉 That's It!

The modern system is **configuration-driven** - just add a JSON file and a config entry, and everything works automatically!

- ✅ **No Python scripts needed**
- ✅ **No HTML generation**
- ✅ **No manual file management**
- ✅ **Automatic timestamps**
- ✅ **Smart recommendations**

**Pro Tip**: Use the scripts! They handle all the complexity and avoid common mistakes.

Your assessment will be live immediately! 🚀
