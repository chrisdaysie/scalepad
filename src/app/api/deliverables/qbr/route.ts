import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const configPath = path.join(process.cwd(), 'src/app/lmx/deliverables/data/qbr-configs.json');
    const jsonDir = path.join(process.cwd(), 'src/app/lmx/deliverables/data/json');
    
    if (!fs.existsSync(configPath)) {
      return NextResponse.json({ error: 'QBR configuration file not found' }, { status: 404 });
    }

    const configData = fs.readFileSync(configPath, 'utf8');
    const qbrConfigs = JSON.parse(configData);

    // Load each QBR report from its individual JSON file
    const qbrReports: Record<string, unknown> = {};
    
    for (const [reportId, config] of Object.entries(qbrConfigs)) {
      const jsonFilePath = path.join(jsonDir, (config as { json_file: string }).json_file);
      
      if (fs.existsSync(jsonFilePath)) {
        const reportData = fs.readFileSync(jsonFilePath, 'utf8');
        const parsedData = JSON.parse(reportData);
        qbrReports[reportId] = parsedData;
        
        // Debug logging for qbr-report-full
        if (reportId === 'qbr-report-full') {
          console.log('Loading qbr-report-full:', {
            hasAccountTeam: !!parsedData.accountTeam,
            hasUserDirectory: !!parsedData.userDirectory,
            accountTeamTitle: parsedData.accountTeam?.title,
            userDirectoryTitle: parsedData.userDirectory?.title
          });
        }
      } else {
        console.warn(`QBR report JSON file not found: ${jsonFilePath}`);
      }
    }

    return NextResponse.json(qbrReports);
  } catch (error) {
    console.error('Error loading QBR configurations:', error);
    return NextResponse.json({ error: 'Failed to load QBR configurations' }, { status: 500 });
  }
}
