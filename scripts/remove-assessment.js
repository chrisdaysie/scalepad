#!/usr/bin/env node

/**
 * Simple CLI tool to remove assessments
 * Usage: node remove-assessment.js "Test Coffee Assessment"
 */

const fs = require('fs');
const path = require('path');

function removeAssessment(assessmentName) {
  if (!assessmentName) {
    console.log('❌ Please provide an assessment name');
    console.log('Usage: node remove-assessment.js "Test Coffee Assessment"');
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

  // Check if assessment exists
  if (!fs.existsSync(jsonFilePath)) {
    console.log(`❌ Assessment "${assessmentName}" not found!`);
    process.exit(1);
  }

  // Load config
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  // Check if config entry exists
  if (!config.assessment_types[id]) {
    console.log(`❌ Assessment "${assessmentName}" not found in config!`);
    process.exit(1);
  }

  // Remove from config
  delete config.assessment_types[id];
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  // Remove JSON file
  fs.unlinkSync(jsonFilePath);

  console.log(`✅ Successfully removed "${assessmentName}"!`);
  console.log(`🗑️  Deleted: ${jsonFilePath}`);
  console.log(`⚙️  Config updated: ${configPath}`);
  console.log(`🌐 Assessment removed from: /lmx/assessments`);
}

// Get assessment name from command line
const assessmentName = process.argv[2];
removeAssessment(assessmentName);
