import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface QBRConfig {
  id: string;
  json_file: string;
  title: string;
  company: string;
  type: string;
  description: string;
}

interface QBRConfigs {
  [key: string]: QBRConfig;
}

interface QBRReport {
  id: string;
  title: string;
  company: string;
  type: string;
  description: string;
  icon: string;
  gradient: string;
  status: string;
  lastUpdated: number;
  qbrUrl: string;
  dataQuality: string;
  product: string;
}

// Icon mapping based on company and type
const getIconForQBR = (company: string, type: string): string => {
  const text = (company + ' ' + type).toLowerCase();
  
  if (text.includes('backup') || text.includes('radar')) return '🛡️';
  if (text.includes('control') || text.includes('map')) return '🗺️';
  if (text.includes('cork')) return '🍷';
  if (text.includes('huntress')) return '🔍';
  if (text.includes('produce') || text.includes('8')) return '📊';
  if (text.includes('rewst')) return '⚡';
  if (text.includes('aggregate') || text.includes('comprehensive')) return '📋';
  
  return '📋'; // Default
};

// Gradient mapping
const getGradientForQBR = (id: string): string => {
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-teal-500 to-blue-500',
    'from-yellow-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-cyan-500 to-blue-500',
    'from-gray-600 to-slate-800'
  ];
  
  const index = id.length % gradients.length;
  return gradients[index];
};

// Product mapping - use company name as product
const getProductForQBR = (company: string): string => {
  return company;
};

// Data quality mapping
const getDataQualityForQBR = (type: string): string => {
  if (type === 'aggregate') return 'Aggregate';
  return 'Comprehensive';
};

export async function GET() {
  try {
    // Read the QBR configs
    const configPath = path.join(process.cwd(), 'src/app/lmx/deliverables/data/qbr-configs.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    const configs: QBRConfigs = JSON.parse(configData);

    const qbrReports: QBRReport[] = [];

    // Process each QBR report
    for (const [id, config] of Object.entries(configs)) {
      // Read the JSON file to get additional details
      const jsonPath = path.join(process.cwd(), 'src/app/lmx/deliverables/data/json', config.json_file);
      let description = config.description;
      
      try {
        if (fs.existsSync(jsonPath)) {
          const jsonData = fs.readFileSync(jsonPath, 'utf8');
          const reportData = JSON.parse(jsonData);
          
          if (reportData.description) {
            description = reportData.description;
          }
        }
      } catch (error) {
        console.warn(`Could not read JSON file for ${id}:`, error);
      }

      // Use current timestamp for last updated time
      const lastUpdated = Math.floor(Date.now() / 1000);

      const qbrReport: QBRReport = {
        id,
        title: config.title,
        company: config.company,
        type: config.type,
        description,
        icon: getIconForQBR(config.company, config.type),
        gradient: getGradientForQBR(id),
        status: 'Available',
        lastUpdated,
        qbrUrl: `/lmx/deliverables/qbr/${id}`,
        dataQuality: getDataQualityForQBR(config.type),
        product: getProductForQBR(config.company)
      };

      qbrReports.push(qbrReport);
    }

    // Sort reports alphabetically by title
    qbrReports.sort((a, b) => a.title.localeCompare(b.title));

    return NextResponse.json(qbrReports);
  } catch (error) {
    console.error('Error loading QBR reports:', error);
    return NextResponse.json({ error: 'Failed to load QBR reports' }, { status: 500 });
  }
}
