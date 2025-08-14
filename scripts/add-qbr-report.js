#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function addQBRReport() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node add-qbr-report.js <report-id> <company-name> [type]');
    console.log('');
    console.log('Examples:');
    console.log('  node add-qbr-report.js qbr-report-huntress "Huntress" individual');
    console.log('  node add-qbr-report.js qbr-report-full "Moneta" aggregate');
    console.log('');
    console.log('Types: individual (default) or aggregate');
    process.exit(1);
  }

  const reportId = args[0];
  const companyName = args[1];
  const reportType = args[2] || 'individual';
  
  if (!['individual', 'aggregate'].includes(reportType)) {
    console.error('Error: Type must be "individual" or "aggregate"');
    process.exit(1);
  }

  const configPath = path.join(process.cwd(), 'src/app/lmx/deliverables/data/qbr-configs.json');
  const jsonDir = path.join(process.cwd(), 'src/app/lmx/deliverables/data/json');
  const jsonFilePath = path.join(jsonDir, `${reportId}.json`);
  
  if (!fs.existsSync(configPath)) {
    console.error('Error: QBR configuration file not found at:', configPath);
    process.exit(1);
  }

  if (!fs.existsSync(jsonDir)) {
    console.error('Error: QBR JSON directory not found at:', jsonDir);
    process.exit(1);
  }

  try {
    const configData = fs.readFileSync(configPath, 'utf8');
    const qbrConfigs = JSON.parse(configData);

    if (qbrConfigs[reportId]) {
      console.error(`Error: QBR report with ID "${reportId}" already exists`);
      process.exit(1);
    }

    if (fs.existsSync(jsonFilePath)) {
      console.error(`Error: QBR report JSON file already exists: ${jsonFilePath}`);
      process.exit(1);
    }

    // Create template QBR report JSON
    const templateReport = {
      id: reportId,
      title: `${toTitleCase(companyName)} Business Review Report`,
      company: companyName.toUpperCase(),
      dateRange: 'Q2 2025 • Business Intelligence',
      monthlyInvestment: '$2,500',
      managedEndpoints: '25 Managed Endpoints',
      type: reportType,
      description: `${toTitleCase(companyName)} business review and analysis report`,
      executiveSummary: `${toTitleCase(companyName)} demonstrates strong business performance with opportunities for optimization. This quarter, we've successfully managed 25 endpoints and achieved significant improvements in operational efficiency and security posture.`,
      categories: [
        {
          name: 'Security Posture',
          score: 75,
          items: [
            { name: 'Endpoint Protection', status: 'satisfactory' },
            { name: 'Email Security', status: 'satisfactory' },
            { name: 'Multi-Factor Authentication', status: 'satisfactory' },
            { name: 'Security Awareness', status: 'needs-attention' }
          ]
        },
        {
          name: 'Business Continuity',
          score: 80,
          items: [
            { name: 'Backup Success Rate', status: 'satisfactory' },
            { name: 'Disaster Recovery', status: 'satisfactory' },
            { name: 'Data Retention', status: 'satisfactory' },
            { name: 'Recovery Testing', status: 'needs-attention' }
          ]
        },
        {
          name: 'IT Infrastructure',
          score: 70,
          items: [
            { name: 'Hardware Lifecycle', status: 'needs-attention' },
            { name: 'Software Management', status: 'satisfactory' },
            { name: 'Network Security', status: 'satisfactory' },
            { name: 'Cloud Services', status: 'needs-attention' }
          ]
        }
      ],
      enhancedSections: {
        risks: [
          {
            title: 'Data Security Risk',
            description: 'Potential vulnerabilities in data protection and access controls.',
            severity: 'medium',
            impact: 'Data breaches and unauthorized access to sensitive information.'
          },
          {
            title: 'System Reliability Risk',
            description: 'Aging infrastructure may lead to system failures and downtime.',
            severity: 'medium',
            impact: 'Business disruption and potential data loss.'
          },
          {
            title: 'Compliance Risk',
            description: 'Need to ensure compliance with industry regulations and standards.',
            severity: 'low',
            impact: 'Potential regulatory penalties and audit findings.'
          }
        ],
        insights: [
          {
            title: 'Security Improvements',
            description: 'Significant progress in security posture with room for enhancement.',
            metric: '75% Security Score',
            trend: 'positive'
          },
          {
            title: 'Business Continuity',
            description: 'Strong backup and disaster recovery procedures in place.',
            metric: '80% Continuity Score',
            trend: 'positive'
          },
          {
            title: 'Infrastructure Health',
            description: 'Good overall infrastructure with some areas needing attention.',
            metric: '70% Infrastructure Score',
            trend: 'positive'
          }
        ],
        recommendations: [
          {
            title: 'Enhance Security Awareness',
            description: 'Implement comprehensive security training for all employees.',
            priority: 'high',
            effort: 'Medium',
            impact: 'Improved security culture and reduced human error'
          },
          {
            title: 'Improve Recovery Testing',
            description: 'Increase frequency and scope of disaster recovery testing.',
            priority: 'medium',
            effort: 'Low',
            impact: 'Faster recovery times and better preparedness'
          },
          {
            title: 'Infrastructure Modernization',
            description: 'Plan for hardware and software upgrades to improve reliability.',
            priority: 'medium',
            effort: 'High',
            impact: 'Reduced downtime and improved performance'
          }
        ]
      }
    };

    // Add optional sections for aggregate reports
    if (reportType === 'aggregate') {
      templateReport.hardwareStats = {
        totalAssets: 156,
        overdueReplacement: 12,
        unsupportedOS: 8,
        replacementBudget: '$18,000'
      };
      
      templateReport.softwareStats = {
        totalAssets: 892,
        unsupported: 34,
        unsupportedSoon: 23,
        supported: 835
      };
      
      templateReport.contracts = {
        monthly: [
          { vendor: 'Microsoft 365', description: 'Email and productivity suite', cost: '$2,500.00', nextDue: '2025-08-31' },
          { vendor: 'Security Platform', description: 'Enterprise security solution', cost: '$1,800.00', nextDue: '2025-08-31' }
        ],
        annual: [
          { vendor: 'Hardware Maintenance', description: 'Annual hardware support contracts', cost: '$15,000.00', nextDue: '2025-12-31' },
          { vendor: 'Software Licensing', description: 'Annual software license renewals', cost: '$8,000.00', nextDue: '2025-06-30' }
        ]
      };
      
      templateReport.roadmap = {
        totalInvestment: '$24,750.00',
        initiatives: [
          {
            priority: 'open',
            title: 'Workstation Modernization',
            description: 'Replace aging workstations to improve performance and security.',
            investment: '$18,000.00',
            assets: 12
          },
          {
            priority: 'proposed',
            title: 'Security Enhancement',
            description: 'Implement advanced security measures and training programs.',
            investment: '$6,750.00',
            assets: 25
          }
        ]
      };
    }

    // Write the individual JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(templateReport, null, 2));

    // Add the new report to the configuration index
    qbrConfigs[reportId] = {
      id: reportId,
      json_file: `${reportId}.json`,
      title: templateReport.title,
      company: templateReport.company,
      type: reportType,
      description: templateReport.description
    };

    // Write the updated configuration back to file
    fs.writeFileSync(configPath, JSON.stringify(qbrConfigs, null, 2));

    console.log(`✅ Successfully added QBR report: ${reportId}`);
    console.log(`   Company: ${companyName}`);
    console.log(`   Type: ${reportType}`);
    console.log(`   JSON file: ${jsonFilePath}`);
    console.log(`   Configuration file: ${configPath}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Customize the report data in the JSON file');
    console.log('2. Update the deliverables page to include the new report');
    console.log('3. Test the report by visiting /lmx/deliverables/qbr/' + reportId);

  } catch (error) {
    console.error('Error adding QBR report:', error.message);
    process.exit(1);
  }
}

addQBRReport();
