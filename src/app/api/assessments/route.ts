import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface AssessmentConfig {
  aliases: string[];
  json_file: string;
  recommendation_function: string;
  titles: string[];
  keywords: string[];
  description: string;
}

interface AssessmentConfigs {
  assessment_types: {
    [key: string]: AssessmentConfig;
  };
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  status: string;
  lastUpdated: number;
  runAssessmentUrl: string;
  viewReportUrl: string;
  downloadJsonUrl: string;
  aliases: string[];
  keywords: string[];
  categoryTitles: string[];
}

// Icon mapping based on keywords
const getIconForAssessment = (keywords: string[], title: string): string => {
  const text = (title + ' ' + keywords.join(' ')).toLowerCase();
  
  if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning')) return '🧠';
  if (text.includes('security') || text.includes('cyber') || text.includes('threat') || text.includes('vulnerability')) return '🔒';
  if (text.includes('insurance') || text.includes('compliance') || text.includes('risk')) return '🛡️';
  if (text.includes('data') || text.includes('analytics') || text.includes('metrics') || text.includes('performance')) return '📊';
  if (text.includes('technology') || text.includes('tech') || text.includes('digital')) return '💻';
  if (text.includes('business') || text.includes('process') || text.includes('workflow')) return '📋';
  if (text.includes('policies') || text.includes('procedures')) return '📋';
  if (text.includes('customer') || text.includes('success')) return '📊';
  if (text.includes('new client') || text.includes('onboarding')) return '📋';
  if (text.includes('alignment') || text.includes('architecture')) return '🔍';
  
  return '📋'; // Default
};

// Gradient mapping
const getGradientForAssessment = (id: string): string => {
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-teal-500 to-blue-500',
    'from-yellow-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-cyan-500 to-blue-500'
  ];
  
  const index = id.length % gradients.length;
  return gradients[index];
};

export async function GET() {
  try {
    // Read the assessment configs
    const configPath = path.join(process.cwd(), 'src/app/lmx/assessments/data/assessment-configs.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    const configs: AssessmentConfigs = JSON.parse(configData);

    const assessments: Assessment[] = [];

    // Process each assessment type
    for (const [id, config] of Object.entries(configs.assessment_types)) {
      // Read the JSON file to get the full description - fix the path to match our structure
      const jsonPath = path.join(process.cwd(), 'src/app/lmx/assessments/data/json', path.basename(config.json_file));
      let description = config.description;
      
      try {
        if (fs.existsSync(jsonPath)) {
          const jsonData = fs.readFileSync(jsonPath, 'utf8');
          const assessmentData = JSON.parse(jsonData);
          
          if (assessmentData.assessment_template_create_payload?.description) {
            description = assessmentData.assessment_template_create_payload.description;
          }
        }
      } catch (error) {
        console.warn(`Could not read JSON file for ${id}:`, error);
      }

      // Get file stats for last updated time
      let lastUpdated = Math.floor(Date.now() / 1000);
      try {
        if (fs.existsSync(jsonPath)) {
          const stats = fs.statSync(jsonPath);
          lastUpdated = Math.floor(stats.mtime.getTime() / 1000);
        }
      } catch (error) {
        console.warn(`Could not get file stats for ${id}:`, error);
      }

      // Create proper mixed case titles
      const getProperTitle = (id: string, description: string): string => {
        const titleMap: { [key: string]: string } = {
          'ai-readiness': 'AI Readiness Assessment',
          'cs-readiness': 'Customer Success Readiness Assessment',
          'cyber-insurance-readiness': 'Cyber Insurance Readiness Assessment',
          'cyber-resilience': 'Cyber Resilience Assessment',
          'digital-work-analytics': 'Digital Work Analytics Assessment',
          'technology-alignment': 'Technology Alignment Assessment',
          'new-client-comprehensive': 'New Client Assessment (Comprehensive)',
          'new-client-quick': 'New Client Assessment (Quick)',
          'base-policies': 'Base Policies & Procedures Assessment'
        };
        
        return titleMap[id] || description.split(' ').slice(0, 3).join(' ') + ' Assessment';
      };

      const assessment: Assessment = {
        id,
        title: getProperTitle(id, config.description),
        description,
        icon: getIconForAssessment(config.keywords, config.description),
        gradient: getGradientForAssessment(id),
        status: 'Active',
        lastUpdated,
        runAssessmentUrl: `/lmx/assessments/run/${id}`,
        viewReportUrl: `/lmx/assessments/report/${id}`,
        downloadJsonUrl: `/api/assessments/download/${id}`,
        aliases: config.aliases,
        keywords: config.keywords,
        categoryTitles: config.titles
      };

      assessments.push(assessment);
    }

    // Sort assessments alphabetically by title
    assessments.sort((a, b) => a.title.localeCompare(b.title));

    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Error loading assessments:', error);
    return NextResponse.json({ error: 'Failed to load assessments' }, { status: 500 });
  }
}
