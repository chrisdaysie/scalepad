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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Read the assessment configs
    const configPath = path.join(process.cwd(), 'src/app/lmx/assessments/data/assessment-configs.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    const configs: AssessmentConfigs = JSON.parse(configData);

    // Find the assessment
    const assessment = configs.assessment_types[id];
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Read the JSON file - fix the path to match our structure
    const jsonPath = path.join(process.cwd(), 'src/app/lmx/assessments/data/json', path.basename(assessment.json_file));
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({ error: 'Assessment data not found' }, { status: 404 });
    }

    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    // Parse to validate JSON but don't store in unused variable
    JSON.parse(jsonData);

    // Return the JSON file as a download
    return new NextResponse(jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="assessment-${id}-data.json"`,
      },
    });
  } catch (error) {
    console.error('Error downloading assessment:', error);
    return NextResponse.json({ error: 'Failed to download assessment' }, { status: 500 });
  }
}
