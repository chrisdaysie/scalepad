import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    console.log('Loading assessment with ID:', id);

    // Read the assessment configs
    const configPath = path.join(process.cwd(), 'src/app/lmx/assessments/data/assessment-configs.json');
    console.log('Config path:', configPath);
    
    if (!fs.existsSync(configPath)) {
      console.error('Config file not found at:', configPath);
      return NextResponse.json({ error: 'Assessment config not found' }, { status: 404 });
    }
    
    const configData = fs.readFileSync(configPath, 'utf8');
    let configs: AssessmentConfigs;
    try {
      configs = JSON.parse(configData);
    } catch (parseError) {
      console.error('Error parsing config file:', parseError);
      return NextResponse.json({ error: 'Invalid config file format' }, { status: 500 });
    }
    
    console.log('Available assessments:', Object.keys(configs.assessment_types));

    // Find the assessment
    const assessment = configs.assessment_types[id];
    if (!assessment) {
      console.error('Assessment not found in config:', id);
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    console.log('Found assessment config:', assessment);

    // Read the JSON file - fix the path to match our structure
    const jsonPath = path.join(process.cwd(), 'src/app/lmx/assessments/data/json', path.basename(assessment.json_file));
    console.log('Looking for assessment file at:', jsonPath);
    
    if (!fs.existsSync(jsonPath)) {
      console.error('Assessment file not found at:', jsonPath);
      return NextResponse.json({ error: 'Assessment data not found' }, { status: 404 });
    }

    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    console.log('File size:', jsonData.length, 'characters');
    
    let assessmentData;
    try {
      assessmentData = JSON.parse(jsonData);
    } catch (parseError) {
      console.error('Error parsing assessment JSON:', parseError);
      console.error('Error details:', parseError instanceof Error ? parseError.message : 'Unknown parse error');
      
      // Try to find the problematic character
      if (parseError instanceof Error && parseError.message.includes('position')) {
        const match = parseError.message.match(/position (\d+)/);
        if (match) {
          const position = parseInt(match[1]);
          const context = jsonData.substring(Math.max(0, position - 20), position + 20);
          console.error('Context around error position:', context);
        }
      }
      
      return NextResponse.json({ 
        error: 'Invalid assessment data format',
        details: parseError instanceof Error ? parseError.message : 'Unknown parse error'
      }, { status: 500 });
    }
    
    console.log('Successfully loaded assessment data');

    return NextResponse.json(assessmentData);
  } catch (error) {
    console.error('Error loading assessment data:', error);
    return NextResponse.json({ 
      error: 'Failed to load assessment data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
