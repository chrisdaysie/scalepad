#!/usr/bin/env node

/**
 * Simple CLI tool to add new assessments
 * Usage: node add-assessment.js "Test Coffee Assessment"
 */

const fs = require('fs');
const path = require('path');

function addAssessment(assessmentName) {
  if (!assessmentName) {
    console.log('❌ Please provide an assessment name');
    console.log('Usage: node add-assessment.js "Test Coffee Assessment"');
    process.exit(1);
  }

  // Convert to kebab-case
  const id = assessmentName.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const configPath = path.join(__dirname, '../src/app/lmx/assessments/data/assessment-configs.json');
  const jsonFilePath = path.join(__dirname, `../src/app/lmx/assessments/data/json/assessment-${id}-data.json`);

  // Check if assessment already exists
  if (fs.existsSync(jsonFilePath)) {
    console.log(`❌ Assessment "${assessmentName}" already exists!`);
    process.exit(1);
  }

  // Convert to proper mixed case title
  const toTitleCase = (str) => {
    return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Create JSON file
  const jsonTemplate = {
    assessment_template_create_payload: {
      title: toTitleCase(assessmentName),
      description: `Comprehensive ${assessmentName.toLowerCase()} evaluation and analysis.`,
      is_category_weight_evenly_distributed: true,
      categories: [
        {
          title: "Category 1",
          description: "First category description",
          is_question_weight_evenly_distributed: true,
          questions: [
            {
              title: "Sample Question",
              description: "This is a sample question for your assessment.",
              remediation_tips: "Add remediation tips here for this question.",
              criterion_label_type_enum: "MultiResponse",
              criteria: [
                {
                  label_enum: "AtRisk",
                  description: "At risk description"
                },
                {
                  label_enum: "NeedsAttention", 
                  description: "Needs attention description"
                },
                {
                  label_enum: "Satisfactory",
                  description: "Satisfactory description"
                },
                {
                  label_enum: "NotApplicable",
                  description: "Not applicable"
                }
              ],
              scoring_instructions: "Instructions for scoring this question."
            }
          ]
        }
      ]
    }
  };

  // Create config entry
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  config.assessment_types[id] = {
    aliases: [id],
    json_file: `assessment-${id}-data.json`,
    recommendation_function: "generate_ai_recommendations",
    lastUpdated: Math.floor(Date.now() / 1000),
    titles: [
      "Strategic Initiative",
      "Operational Excellence", 
      "Performance Optimization",
      "Capability Enhancement",
      "Continuous Improvement"
    ],
    keywords: [id.replace(/-/g, ' ')],
    description: `${toTitleCase(assessmentName)} assessment`
  };

  // Write files
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonTemplate, null, 2));
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log(`✅ Successfully added "${assessmentName}"!`);
  console.log(`📁 JSON file: ${jsonFilePath}`);
  console.log(`⚙️  Config updated: ${configPath}`);
  console.log(`🌐 Assessment will appear at: /lmx/assessments`);
  console.log(`📝 Edit the JSON file to customize questions and categories`);
}

// Get assessment name from command line
const assessmentName = process.argv[2];
addAssessment(assessmentName);
