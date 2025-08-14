const fs = require('fs');
const path = require('path');

// Sample answers for the compliance readiness assessment
const sampleAnswers = {
  "Industry-specific cybersecurity requirements understanding": "Satisfactory",
  "Business criticality and service classification": "NeedsAttention",
  "Sensitive data handling and classification": "AtRisk",
  "Cybersecurity leadership and governance structure": "Satisfactory",
  "Cybersecurity policy framework completeness": "NeedsAttention",
  "Security awareness training program effectiveness": "AtRisk",
  "Asset inventory and management system": "Satisfactory",
  "Secure asset disposal procedures": "NeedsAttention",
  "Configuration management and baseline enforcement": "Satisfactory",
  "Endpoint protection solution deployment": "Satisfactory",
  "Network security and segmentation": "NeedsAttention",
  "Firewall implementation and rule management": "Satisfactory",
  "VPN solution for remote access security": "Satisfactory",
  "Periodic cybersecurity risk assessment program": "NeedsAttention",
  "Continuous vulnerability scanning and management": "AtRisk",
  "Patch management procedures and automation": "Satisfactory",
  "Email security and anti-phishing protection": "Satisfactory",
  "Centralized account and access management": "NeedsAttention",
  "Strong password policy and multi-factor authentication": "Satisfactory",
  "Centralized logging and security monitoring": "AtRisk",
  "Data encryption implementation": "Satisfactory",
  "Data disposition and secure deletion procedures": "NeedsAttention",
  "Data Loss Prevention (DLP) measures": "AtRisk",
  "Backup and recovery procedures": "Satisfactory",
  "Business continuity planning and procedures": "NeedsAttention",
  "Disaster recovery and failover capabilities": "Satisfactory",
  "Incident response and recovery playbook": "AtRisk",
  "Vendor risk assessment and management program": "NeedsAttention"
};

// Load the assessment data
const assessmentPath = path.join(__dirname, 'src/app/lmx/assessments/data/json/assessment-compliance-readiness-data.json');
const assessmentData = JSON.parse(fs.readFileSync(assessmentPath, 'utf8'));

// Calculate assessment results
function calculateAssessmentResults(assessment, answers) {
  const categories = assessment.assessment_template_create_payload.categories;
  const results = {
    totalQuestions: 0,
    answeredQuestions: 0,
    categoryResults: [],
    overallScore: 0,
    riskLevel: '',
    recommendations: []
  };

  let totalScore = 0;
  let totalPossibleScore = 0;

  categories.forEach(category => {
    const categoryResult = {
      title: category.title,
      questions: [],
      score: 0,
      possibleScore: 0,
      riskLevel: ''
    };

    category.questions.forEach(question => {
      results.totalQuestions++;
      const answer = answers[question.title];
      
      if (answer) {
        results.answeredQuestions++;
        
        // Calculate score based on answer
        let score = 0;
        let possibleScore = 4; // Assuming 4-point scale
        
        switch (answer.toLowerCase()) {
          case 'satisfactory':
            score = 3;
            break;
          case 'needsattention':
            score = 2;
            break;
          case 'atrisk':
            score = 1;
            break;
          case 'notapplicable':
            score = 2; // Neutral score for N/A
            break;
          default:
            score = 0;
        }
        
        categoryResult.questions.push({
          title: question.title,
          answer: answer,
          score: score,
          possibleScore: possibleScore,
          remediation: question.remediation_tips
        });
        
        categoryResult.score += score;
        categoryResult.possibleScore += possibleScore;
        totalScore += score;
        totalPossibleScore += possibleScore;
      }
    });

    // Calculate category risk level
    const categoryPercentage = categoryResult.possibleScore > 0 ? 
      (categoryResult.score / categoryResult.possibleScore) * 100 : 0;
    
    if (categoryPercentage >= 75) {
      categoryResult.riskLevel = 'Low Risk';
    } else if (categoryPercentage >= 50) {
      categoryResult.riskLevel = 'Medium Risk';
    } else {
      categoryResult.riskLevel = 'High Risk';
    }

    results.categoryResults.push(categoryResult);
  });

  // Calculate overall score
  results.overallScore = totalPossibleScore > 0 ? 
    Math.round((totalScore / totalPossibleScore) * 100) : 0;

  // Determine overall risk level
  if (results.overallScore >= 75) {
    results.riskLevel = 'Low Risk';
  } else if (results.overallScore >= 50) {
    results.riskLevel = 'Medium Risk';
  } else {
    results.riskLevel = 'High Risk';
  }

  // Generate recommendations based on low-scoring areas
  results.categoryResults.forEach(category => {
    if (category.riskLevel === 'High Risk' || category.riskLevel === 'Medium Risk') {
      const lowScoringQuestions = category.questions.filter(q => q.score <= 2);
      lowScoringQuestions.forEach(question => {
        results.recommendations.push({
          category: category.title,
          issue: question.title,
          remediation: question.remediation
        });
      });
    }
  });

  return results;
}

// Generate the assessment report
function generateAssessmentReport(results) {
  const report = {
    assessmentTitle: "Cybersecurity Compliance Readiness Assessment",
    assessmentDate: new Date().toISOString(),
    overallScore: results.overallScore,
    riskLevel: results.riskLevel,
    completionRate: Math.round((results.answeredQuestions / results.totalQuestions) * 100),
    summary: {
      totalQuestions: results.totalQuestions,
      answeredQuestions: results.answeredQuestions,
      categories: results.categoryResults.length
    },
    categoryBreakdown: results.categoryResults.map(category => ({
      title: category.title,
      score: Math.round((category.score / category.possibleScore) * 100),
      riskLevel: category.riskLevel,
      questionsAnswered: category.questions.length
    })),
    recommendations: results.recommendations.slice(0, 10), // Top 10 recommendations
    nextSteps: generateNextSteps(results)
  };

  return report;
}

function generateNextSteps(results) {
  const nextSteps = [];
  
  if (results.overallScore < 50) {
    nextSteps.push("Immediate action required: Focus on high-risk areas first");
  }
  
  if (results.overallScore < 75) {
    nextSteps.push("Develop comprehensive remediation plan");
  }
  
  nextSteps.push("Schedule follow-up assessment in 3-6 months");
  nextSteps.push("Implement continuous monitoring and improvement processes");
  
  return nextSteps;
}

// Run the test
console.log('🧪 Testing Compliance Readiness Assessment Generator...\n');

const results = calculateAssessmentResults(assessmentData, sampleAnswers);
const report = generateAssessmentReport(results);

console.log('📊 Assessment Results:');
console.log('=====================');
console.log(`Overall Score: ${report.overallScore}%`);
console.log(`Risk Level: ${report.riskLevel}`);
console.log(`Completion Rate: ${report.completionRate}%`);
console.log(`Questions Answered: ${report.summary.answeredQuestions}/${report.summary.totalQuestions}`);
console.log(`Categories Assessed: ${report.summary.categories}\n`);

console.log('📋 Category Breakdown:');
console.log('=====================');
report.categoryBreakdown.forEach(category => {
  console.log(`${category.title}: ${category.score}% (${category.riskLevel})`);
});
console.log('');

console.log('🎯 Top Recommendations:');
console.log('======================');
report.recommendations.slice(0, 5).forEach((rec, index) => {
  console.log(`${index + 1}. ${rec.category}: ${rec.issue}`);
  console.log(`   💡 ${rec.remediation}\n`);
});

console.log('📈 Next Steps:');
console.log('==============');
report.nextSteps.forEach((step, index) => {
  console.log(`${index + 1}. ${step}`);
});

console.log('\n✅ Assessment generator test completed successfully!');
