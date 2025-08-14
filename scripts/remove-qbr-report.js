#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function removeQBRReport() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Usage: node remove-qbr-report.js <report-id>');
    console.log('');
    console.log('Examples:');
    console.log('  node remove-qbr-report.js qbr-report-huntress');
    console.log('  node remove-qbr-report.js qbr-report-example');
    console.log('');
    console.log('This will remove the QBR report from the configuration file and delete the JSON file.');
    process.exit(1);
  }

  const reportId = args[0];
  const configPath = path.join(process.cwd(), 'src/app/lmx/deliverables/data/qbr-configs.json');
  const jsonDir = path.join(process.cwd(), 'src/app/lmx/deliverables/data/json');
  
  if (!fs.existsSync(configPath)) {
    console.error('Error: QBR configuration file not found at:', configPath);
    process.exit(1);
  }

  try {
    const configData = fs.readFileSync(configPath, 'utf8');
    const qbrConfigs = JSON.parse(configData);

    if (!qbrConfigs[reportId]) {
      console.error(`Error: QBR report with ID "${reportId}" not found`);
      console.log('');
      console.log('Available reports:');
      Object.keys(qbrConfigs).forEach(id => {
        console.log(`  - ${id} (${qbrConfigs[id].company})`);
      });
      process.exit(1);
    }

    const reportToRemove = qbrConfigs[reportId];
    const jsonFilePath = path.join(jsonDir, reportToRemove.json_file);
    
    // Remove the report from the configuration
    delete qbrConfigs[reportId];

    // Write the updated configuration back to file
    fs.writeFileSync(configPath, JSON.stringify(qbrConfigs, null, 2));

    // Delete the JSON file if it exists
    if (fs.existsSync(jsonFilePath)) {
      fs.unlinkSync(jsonFilePath);
      console.log(`   Deleted JSON file: ${jsonFilePath}`);
    } else {
      console.log(`   Warning: JSON file not found: ${jsonFilePath}`);
    }

    console.log(`✅ Successfully removed QBR report: ${reportId}`);
    console.log(`   Company: ${reportToRemove.company}`);
    console.log(`   Type: ${reportToRemove.type}`);
    console.log(`   Configuration file: ${configPath}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Update the deliverables page if this report was listed there');
    console.log('2. Test to ensure no broken links remain');
    console.log('3. Consider updating any documentation that referenced this report');

  } catch (error) {
    console.error('Error removing QBR report:', error.message);
    process.exit(1);
  }
}

removeQBRReport();
