'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
// import ScalepadLogo from '@/components/ScalepadLogo';

interface QBRData {
  id: string;
  title: string;
  company: string;
  dateRange: string;
  heroMetric?: {
    value: string;
    label: string;
    trend: string;
    description: string;
  };
  businessOverview?: {
    title: string;
    introText: string;
    subtitle: string;
  };
  sectionHeaders?: {
    clientGoals: string;
    technologyRoadmap: string;
    upcomingInitiatives: string;
    totalInvestment: string;
    hardwareLifecycle: string;
    softwareSummary: string;
    budgetForecast: string;
    vendorContracts: string;
    assessmentSummary: string;
    serviceAnalytics: string;
    assetsOverview: string;
    costOptimization: string;
    keyResults: string;
    enhancedAnalysis: string;
    risks: string;
    insights: string;
    recommendations: string;
  };
  tabNavigation?: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
  monthlyInvestment?: string;
  managedEndpoints?: string;
  type: 'aggregate' | 'individual';
  description: string;
  executiveSummary: string;
  liveData?: {
    enabled: boolean;
    refreshInterval: number;
    lastRefresh: string | null;
    selectedClientUuid: string | null;
    availableClients: Array<{
      uuid: string;
      name: string;
      status: string;
      created_at: string;
    }>;
  };
  goals?: Array<{
    title: string;
    description: string;
    targetDate: string;
    status: string;
    progress: number;
    metrics: Array<{
      name: string;
      current: string;
      target: string;
      trend: string;
    }>;
  }>;
  categories?: Array<{
    name: string;
    score: number;
    items: Array<{
      name: string;
      status: string;
    }>;
  }>;
  analytics?: {
    serviceMetrics: {
      uptime: string;
      responseTime: string;
      ticketVolume: number;
      resolutionRate: string;
      customerSatisfaction: string;
    };
    performanceTrends: Array<{
      metric: string;
      current: string;
      previous: string;
      trend: string;
      change: string;
    }>;
  };
  assessments?: {
    summary: {
      totalAssessments: number;
      completedAssessments: number;
      averageScore: string;
      improvementAreas: string[];
    };
    recentAssessments: Array<{
      name: string;
      date: string;
      score: string;
      status: string;
      keyFindings: string[];
    }>;
  };
  hardwareStats?: {
    totalAssets: number;
    overdueReplacement: number;
    unsupportedOS: number;
    replacementBudget: string;
  };
  assets?: {
    servers: Array<{
      name: string;
      type: string;
      location: string;
      os: string;
      age: string;
      status: string;
      specs: string;
    }>;
    workstations: Array<{
      name: string;
      user: string;
      department: string;
      os: string;
      age: string;
      status: string;
      specs: string;
    }>;
  };
  assetAnalytics?: {
    ageDistribution: {
      "0-1": number;
      "1-3": number;
      "3-5": number;
      "5+": number;
    };
    warrantyCoverage: {
      servers: number;
      workstations: number;
      network: number;
      storage: number;
    };
    summary: {
      totalAssets: number;
      underWarranty: number;
      outOfWarranty: number;
      replacementBudget: string;
    };
  };
  costOptimization?: Array<{
    title: string;
    description: string;
    savings: string;
    effort: string;
    timeline: string;
  }>;
  budgetSummary?: {
    totalAnnual: string;
    recurringCosts: string;
    capitalProjects: string;
    monthlyAverage: string;
    recurringPercentage: number;
    projectsPercentage: number;
    yearOverYearGrowth: string;
  };
  spendingCategories?: Array<{
    name: string;
    amount: string;
    percentage: number;
    color: string;
  }>;
  softwareStats?: {
    totalAssets: number;
    unsupported: number;
    unsupportedSoon: number;
    supported: number;
  };
  contracts?: {
    monthly: Array<{
      vendor: string;
      description: string;
      cost: string;
      nextDue: string;
    }>;
    quarterly: Array<{
      vendor: string;
      description: string;
      cost: string;
      nextDue: string;
    }>;
    annual: Array<{
      vendor: string;
      description: string;
      cost: string;
      nextDue: string;
    }>;
  };
  roadmap?: {
    totalInvestment: string;
    initiatives: Array<{
      priority: string;
      title: string;
      description: string;
      investment: string;
      assets?: number;
    }>;
    kanban?: {
      [key: string]: Array<{
        title: string;
        description: string;
        investment: string;
        status: string;
        priority: string;
      }>;
    };
  };
  enhancedSections: {
    risks: Array<{
      title: string;
      description: string;
      severity: 'high' | 'medium' | 'low';
      impact: string;
    }>;
    insights: Array<{
      title: string;
      description: string;
      metric: string;
      trend: 'positive' | 'negative' | 'neutral';
    }>;
    recommendations: Array<{
      title: string;
      description: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
      effort: string;
      impact: string;
    }>;
  };
}

export default function QBRReportPage() {
  const params = useParams();
  // const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [qbrReports, setQbrReports] = useState<Record<string, QBRData>>({});
  const [error, setError] = useState<string | null>(null);

  const reportId = params.id as string;
  const report = qbrReports[reportId];
  const isAggregateReport = report?.type === 'aggregate';

  useEffect(() => {
    const fetchQBRData = async () => {
      try {
        const response = await fetch('/api/deliverables/qbr');
        if (!response.ok) {
          throw new Error('Failed to fetch QBR data');
        }
        const data = await response.json();
        setQbrReports(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load QBR data');
        setIsLoading(false);
      }
    };

    fetchQBRData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading QBR Report...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Report</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              href="/lmx/deliverables"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Deliverables
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h1>
            <p className="text-gray-600 mb-6">The requested QBR report could not be found.</p>
            <Link 
              href="/lmx/deliverables"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Deliverables
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'satisfactory': return 'bg-green-100 text-green-800';
      case 'needs-attention': return 'bg-yellow-100 text-yellow-800';
      case 'at-risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'proposed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <div className="flex items-center space-x-4">
              <Link 
                href="/lmx/deliverables"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Deliverables
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">{report.company} QBR Report</h1>
            </div>
            <div className="text-sm text-gray-500">{report.dateRange}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Only for Aggregate Report */}
      {isAggregateReport && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {report.tabNavigation?.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAggregateReport ? (
          // Tabbed content for aggregate report
          <>
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Executive Summary */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                  <h2 className="text-2xl font-bold mb-6">{report.businessOverview?.title}</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <p className="text-lg leading-relaxed opacity-95">
                        <strong>{report.company} {report.businessOverview?.introText}</strong> {report.executiveSummary}
                      </p>
                    </div>
                                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                    <div className="text-sm opacity-90 mb-2">{report.heroMetric?.label}</div>
                    <div className="text-4xl font-bold text-green-300 mb-2">{report.heroMetric?.value}</div>
                    <div className="text-sm opacity-80">{report.heroMetric?.trend}</div>
                  </div>
                  </div>
                </div>

                {/* Client Goals & Roadmap Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Client Goals Summary */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{report.sectionHeaders?.clientGoals}</h2>
                    <div className="space-y-4">
                      {report.goals?.slice(0, 3).map((goal, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                              goal.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {goal.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4 text-sm">{goal.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-full bg-gray-200 rounded-full h-2 w-24">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${goal.progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{goal.progress}%</span>
                            </div>
                            <span className="text-sm text-gray-500">{goal.targetDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Roadmap Summary */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{report.sectionHeaders?.technologyRoadmap}</h2>
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{report.sectionHeaders?.upcomingInitiatives}</h3>
                        <div className="space-y-3">
                          {report.roadmap?.initiatives.map((initiative, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium text-gray-900 text-sm">{initiative.title}</div>
                                <div className="text-xs text-gray-600">{initiative.description}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">{initiative.investment}</div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(initiative.priority)}`}>
                                  {initiative.priority.charAt(0).toUpperCase() + initiative.priority.slice(1)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">{report.sectionHeaders?.totalInvestment}</span>
                            <span className="text-lg font-bold text-gray-900">{report.roadmap?.totalInvestment}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hardware' && (
              <div className="space-y-8">
                {/* Hardware Stats */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{report.sectionHeaders?.hardwareLifecycle}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-red-600 mb-2">{report.hardwareStats?.totalAssets}</div>
                      <div className="text-sm text-gray-600">Total Hardware Assets</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-red-600 mb-2">{report.hardwareStats?.overdueReplacement}</div>
                      <div className="text-sm text-gray-600">Overdue for Replacement</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-red-600 mb-2">{report.hardwareStats?.unsupportedOS}</div>
                      <div className="text-sm text-gray-600">Unsupported OS</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">{report.hardwareStats?.replacementBudget}</div>
                      <div className="text-sm text-gray-600">Est. Replacement Budget</div>
                    </div>
                  </div>
                </div>

                {/* Software Stats */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{report.sectionHeaders?.softwareSummary}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">{report.softwareStats?.totalAssets}</div>
                      <div className="text-sm text-gray-600">Total Software Assets</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-red-600 mb-2">{report.softwareStats?.unsupported}</div>
                      <div className="text-sm text-gray-600">Unsupported</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">{report.softwareStats?.unsupportedSoon}</div>
                      <div className="text-sm text-gray-600">Unsupported Soon</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">{report.softwareStats?.supported}</div>
                      <div className="text-sm text-gray-600">Supported</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contracts' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{report.sectionHeaders?.vendorContracts}</h2>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center">
                    <div className="text-2xl font-bold mb-2">$13,250</div>
                    <div className="text-sm opacity-90">Monthly Spend</div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white text-center">
                    <div className="text-2xl font-bold mb-2">$5,500</div>
                    <div className="text-sm opacity-90">Quarterly Spend</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center">
                    <div className="text-2xl font-bold mb-2">$62,000</div>
                    <div className="text-sm opacity-90">Annual Spend</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white text-center">
                    <div className="text-2xl font-bold mb-2">$221,400</div>
                    <div className="text-sm opacity-90">Total Annual</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Cycle</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Spend</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {report.contracts?.monthly.map((contract, index) => (
                          <tr key={`monthly-${index}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contract.vendor}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{contract.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Monthly</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{contract.cost}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.nextDue}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              ${(parseFloat(contract.cost.replace(/[$,]/g, '')) * 12).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        {report.contracts?.quarterly.map((contract, index) => (
                          <tr key={`quarterly-${index}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contract.vendor}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{contract.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Quarterly</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{contract.cost}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.nextDue}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              ${(parseFloat(contract.cost.replace(/[$,]/g, '')) * 4).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        {report.contracts?.annual.map((contract, index) => (
                          <tr key={`annual-${index}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contract.vendor}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{contract.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Annual</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{contract.cost}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.nextDue}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{contract.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{report.sectionHeaders?.technologyRoadmap} - Kanban View</h2>
                
                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Q3 2025 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Q3 2025</h3>
                    <div className="space-y-4">
                      {report.roadmap?.kanban?.['q3-2025']?.map((project, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{project.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              project.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                              project.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                              project.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{project.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900">{project.investment}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                              project.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Q4 2025 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Q4 2025</h3>
                    <div className="space-y-4">
                      {report.roadmap?.kanban?.['q4-2025']?.map((project, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{project.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              project.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                              project.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                              project.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{project.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900">{project.investment}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                              project.status === 'Scheduled' ? 'bg-purple-100 text-purple-800' :
                              project.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Q1 2026 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Q1 2026</h3>
                    <div className="space-y-4">
                      {report.roadmap?.kanban?.['q1-2026']?.map((project, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{project.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              project.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                              project.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                              project.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{project.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900">{project.investment}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                              project.status === 'Planned' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Q2 2026 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Q2 2026</h3>
                    <div className="space-y-4">
                      {report.roadmap?.kanban?.['q2-2026']?.map((project, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{project.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              project.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                              project.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                              project.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{project.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900">{project.investment}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                              project.status === 'Planned' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'goals' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{report.sectionHeaders?.clientGoals}</h2>
                
                <div className="grid grid-cols-1 gap-6">
                  {report.goals?.map((goal, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{goal.title}</h3>
                          <p className="text-gray-600 mb-3">{goal.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-500">Target: {goal.targetDate}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                              goal.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {goal.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{goal.progress}%</div>
                          <div className="text-sm text-gray-500">Progress</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {goal.metrics.map((metric, mIndex) => (
                          <div key={mIndex} className="bg-gray-50 rounded-lg p-3">
                            <div className="text-sm font-medium text-gray-900 mb-1">{metric.name}</div>
                            <div className="text-lg font-semibold text-gray-900">{metric.current}</div>
                            <div className="text-xs text-gray-500">Target: {metric.target}</div>
                            <div className={`text-xs mt-1 ${
                              metric.trend === 'improving' ? 'text-green-600' :
                              metric.trend === 'stable' ? 'text-blue-600' :
                              metric.trend === 'excellent' ? 'text-green-600' :
                              'text-red-600'
                            }`}>
                              {metric.trend.charAt(0).toUpperCase() + metric.trend.slice(1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{report.sectionHeaders?.budgetForecast}</h2>
                
                {/* Budget Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="text-2xl font-bold mb-2">{report.budgetSummary?.totalAnnual}</div>
                    <div className="text-sm opacity-90 mb-1">Total Annual IT Budget</div>
                    <div className="text-xs opacity-75">{report.budgetSummary?.yearOverYearGrowth} vs last year</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="text-2xl font-bold mb-2">{report.budgetSummary?.recurringCosts}</div>
                    <div className="text-sm opacity-90 mb-1">Recurring Costs</div>
                    <div className="text-xs opacity-75">{report.budgetSummary?.recurringPercentage}% of total budget</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="text-2xl font-bold mb-2">{report.budgetSummary?.capitalProjects}</div>
                    <div className="text-sm opacity-90 mb-1">Capital Projects</div>
                    <div className="text-xs opacity-75">{report.budgetSummary?.projectsPercentage}% of total budget</div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                    <div className="text-2xl font-bold mb-2">{report.budgetSummary?.monthlyAverage}</div>
                    <div className="text-sm opacity-90 mb-1">Monthly Average</div>
                    <div className="text-xs opacity-75">$13,250 recurring + $5,500 projects</div>
                  </div>
                </div>

                {/* Detailed Budget Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Spending by Category */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending by Category</h3>
                    <div className="space-y-4">
                      {report.spendingCategories?.map((category, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 bg-${category.color}-500 rounded`}></div>
                              <span className="text-sm font-medium text-gray-900">{category.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-900">{category.amount}</div>
                              <div className="text-xs text-gray-500">{category.percentage}%</div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`bg-${category.color}-500 h-2 rounded-full`} style={{ width: `${category.percentage}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quarterly Forecast */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Quarterly Budget Forecast</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Q3 2025</div>
                          <div className="text-sm text-gray-600">Jul - Sep 2025</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">$39,750</div>
                          <div className="text-sm text-gray-600">$13,250 × 3 months</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <div>
                          <div className="font-medium text-gray-900">Q4 2025</div>
                          <div className="text-sm text-gray-600">Oct - Dec 2025</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">$64,500</div>
                          <div className="text-sm text-gray-600">$13,250 × 3 + $24,750 projects</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Q1 2026</div>
                          <div className="text-sm text-gray-600">Jan - Mar 2026</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">$39,750</div>
                          <div className="text-sm text-gray-600">$13,250 × 3 months</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Q2 2026</div>
                          <div className="text-sm text-gray-600">Apr - Jun 2026</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">$39,750</div>
                          <div className="text-sm text-gray-600">$13,250 × 3 months</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget vs Actual Analysis */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Budget vs Actual Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">$155,400</div>
                      <div className="text-sm text-gray-600 mb-1">Budgeted Recurring</div>
                      <div className="text-xs text-green-600">On track</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">$66,000</div>
                      <div className="text-sm text-gray-600 mb-1">Budgeted Projects</div>
                      <div className="text-xs text-blue-600">Planned Q4</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">$221,400</div>
                      <div className="text-sm text-gray-600 mb-1">Total Budget</div>
                      <div className="text-xs text-purple-600">100% allocated</div>
                    </div>
                  </div>
                </div>

                {/* Capital Projects */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Capital Projects & Initiatives</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {report.roadmap?.initiatives.map((initiative, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(initiative.priority)}`}>
                            {initiative.priority.charAt(0).toUpperCase() + initiative.priority.slice(1)}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">{initiative.investment}</span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">{initiative.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{initiative.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{initiative.assets} assets affected</span>
                          <span>Q4 2025</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Optimization Opportunities */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{report.sectionHeaders?.costOptimization}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {report.costOptimization?.map((opportunity, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                        <h4 className="font-medium text-gray-900 mb-2">{opportunity.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-green-600">Potential Savings: {opportunity.savings}</div>
                          <div className="text-xs text-gray-500">{opportunity.timeline}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assessments' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{report.sectionHeaders?.assessmentSummary}</h2>
                
                {/* Assessment Overview */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{report.assessments?.summary.totalAssessments}</div>
                      <div className="text-sm text-gray-600">Total Assessments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">{report.assessments?.summary.completedAssessments}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">{report.assessments?.summary.averageScore}</div>
                      <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">{report.assessments?.summary.improvementAreas.length}</div>
                      <div className="text-sm text-gray-600">Areas to Improve</div>
                    </div>
                  </div>
                </div>

                {/* Recent Assessments */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {report.assessments?.recentAssessments.map((assessment, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{assessment.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          assessment.status === 'at-risk' ? 'bg-red-100 text-red-800' :
                          assessment.status === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {assessment.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">{assessment.score}</div>
                      <div className="text-sm text-gray-500 mb-3">{assessment.date}</div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">Key Findings:</div>
                        {assessment.keyFindings.map((finding, fIndex) => (
                          <div key={fIndex} className="text-sm text-gray-600">• {finding}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{report.sectionHeaders?.serviceAnalytics}</h2>
                
                {/* Service Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{report.analytics?.serviceMetrics.uptime}</div>
                    <div className="text-sm text-gray-600">System Uptime</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{report.analytics?.serviceMetrics.responseTime}</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{report.analytics?.serviceMetrics.ticketVolume}</div>
                    <div className="text-sm text-gray-600">Tickets This Month</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">{report.analytics?.serviceMetrics.resolutionRate}</div>
                    <div className="text-sm text-gray-600">Resolution Rate</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">{report.analytics?.serviceMetrics.customerSatisfaction}</div>
                    <div className="text-sm text-gray-600">Customer Satisfaction</div>
                  </div>
                </div>

                {/* Performance Trends */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Trends</h3>
                  <div className="space-y-4">
                    {report.analytics?.performanceTrends.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{trend.metric}</div>
                          <div className="text-sm text-gray-600">Previous: {trend.previous}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">{trend.current}</div>
                          <div className={`text-sm ${
                            trend.trend === 'improving' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {trend.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assets' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{report.sectionHeaders?.assetsOverview}</h2>
                
                {/* Asset Analytics Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Age Distribution Chart */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Age Distribution</h3>
                    <div className="flex items-center justify-center h-64">
                      <div className="relative w-48 h-48">
                        {/* Pie Chart - Age Distribution */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {/* 0-1 years: 40% */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="20" 
                            strokeDasharray="251.2" strokeDashoffset="150.72" />
                          {/* 1-3 years: 35% */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="20" 
                            strokeDasharray="251.2" strokeDashoffset="87.92" />
                          {/* 3-5 years: 20% */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="20" 
                            strokeDasharray="251.2" strokeDashoffset="50.24" />
                          {/* 5+ years: 5% */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="20" 
                            strokeDasharray="251.2" strokeDashoffset="0" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{report.assetAnalytics?.summary.totalAssets}</div>
                            <div className="text-sm text-gray-600">Total Assets</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">0-1 years (40%)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">1-3 years (35%)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">3-5 years (20%)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">5+ years (5%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Warranty Coverage Chart */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Warranty Coverage by Asset Type</h3>
                    <div className="flex items-center justify-center h-64">
                      <div className="relative w-48 h-48">
                        {/* Pie Chart - Warranty Coverage */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {/* Servers: 80% covered */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="20" 
                            strokeDasharray="251.2" strokeDashoffset="50.24" />
                          {/* Workstations: 60% covered */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="20" 
                            strokeDasharray="251.2" strokeDashoffset="100.48" />
                          {/* Network: 90% covered */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#8B5CF6" strokeWidth="20" 
                            strokeDasharray="251.2" strokeDashoffset="25.12" />
                          {/* Storage: 70% covered */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="20" 
                            strokeDasharray="251.2" strokeDashoffset="75.36" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">75%</div>
                            <div className="text-sm text-gray-600">Avg Coverage</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Servers (80%)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Workstations (60%)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Network (90%)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Storage (70%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Asset Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{report.assetAnalytics?.summary.totalAssets}</div>
                    <div className="text-sm text-gray-600">Total Assets</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{report.assetAnalytics?.summary.underWarranty}</div>
                    <div className="text-sm text-gray-600">Under Warranty</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">{report.assetAnalytics?.summary.outOfWarranty}</div>
                    <div className="text-sm text-gray-600">Out of Warranty</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">{report.assetAnalytics?.summary.replacementBudget}</div>
                    <div className="text-sm text-gray-600">Replacement Budget</div>
                  </div>
                </div>
                
                {/* Servers Table */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Servers ({report.assets?.servers.length} Total)</h3>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Server</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OS</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specs</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {report.assets?.servers.map((server, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{server.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{server.type}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{server.location}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{server.os}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{server.age}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  server.status === 'Healthy' ? 'bg-green-100 text-green-800' :
                                  server.status === 'Needs Upgrade' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {server.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={server.specs}>{server.specs}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Workstations Table */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Workstations ({report.assets?.workstations.length} Total)</h3>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workstation</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OS</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specs</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {report.assets?.workstations.map((workstation, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{workstation.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workstation.user}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workstation.department}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workstation.os}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workstation.age}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  workstation.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                                  workstation.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                                  workstation.status === 'Needs Upgrade' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {workstation.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={workstation.specs}>{workstation.specs}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'enhanced' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">🤖 Enhanced QBR Report Sections</h2>
                
                {/* Risks Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="text-2xl mr-3">⚠️</span>
                    Risks
                  </h3>
                  <div className="space-y-4">
                    {report.enhancedSections.risks.map((risk, index) => (
                      <div key={index} className="border-l-4 border-red-500 pl-4 py-3">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{risk.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            risk.severity === 'high' ? 'bg-red-100 text-red-800' :
                            risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {risk.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{risk.description}</p>
                        <p className="text-sm text-gray-500"><strong>Impact:</strong> {risk.impact}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insights Section */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="text-2xl mr-3">🤖</span>
                    Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.enhancedSections.insights.map((insight, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-1">{insight.title}</div>
                            <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-blue-600">{insight.metric}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                insight.trend === 'positive' ? 'bg-green-100 text-green-800' :
                                insight.trend === 'negative' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {insight.trend}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    Recommendations
                  </h3>
                  <div className="space-y-4">
                    {report.enhancedSections.recommendations.map((recommendation, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                recommendation.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                recommendation.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {recommendation.priority.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{recommendation.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span><strong>Effort:</strong> {recommendation.effort}</span>
                              <span><strong>Impact:</strong> {recommendation.impact}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          // Single-page layout for individual reports
          <div className="space-y-8">
            {/* Executive Summary */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">{report.title}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <p className="text-lg leading-relaxed opacity-95">
                    {report.executiveSummary}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="text-sm opacity-90 mb-2">{report.heroMetric?.label}</div>
                  <div className="text-4xl font-bold text-green-300 mb-2">{report.heroMetric?.value}</div>
                  <div className="text-sm opacity-80">{report.heroMetric?.description}</div>
                </div>
              </div>
            </div>

            {/* Live Data Controls - Only for Cork */}
            {report.liveData?.enabled && (
              <LiveDataControls report={report} />
            )}
            
            {/* Debug info */}
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <strong>Debug Info:</strong> 
              <br />
              Report ID: {report.id}
              <br />
              Live Data Enabled: {report.liveData?.enabled ? 'Yes' : 'No'}
              <br />
              Report Type: {report.type}
            </div>

            {/* Key Results */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{report.sectionHeaders?.keyResults}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {report.categories?.map((category) => (
                  <div key={category.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.name}</h3>
                    <div className={`text-3xl font-bold mb-3 ${getScoreColor(category.score)}`}>
                      {category.score}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getScoreBarColor(category.score)}`}
                        style={{ width: `${category.score}%` }}
                      ></div>
                    </div>
                    <ul className="space-y-2">
                      {category.items.map((item) => (
                        <li key={item.name} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">{item.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Analysis Sections */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{report.sectionHeaders?.enhancedAnalysis}</h2>
              
              {/* Risks Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {report.sectionHeaders?.risks}
                </h3>
                <div className="space-y-4">
                  {report.enhancedSections.risks.map((risk, index) => (
                    <div key={index} className="border-l-4 border-red-500 pl-4 py-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{risk.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          risk.severity === 'high' ? 'bg-red-100 text-red-800' :
                          risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {risk.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{risk.description}</p>
                      <p className="text-sm text-gray-500"><strong>Impact:</strong> {risk.impact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights Section */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {report.sectionHeaders?.insights}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.enhancedSections.insights.map((insight, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">{insight.title}</div>
                          <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-blue-600">{insight.metric}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              insight.trend === 'positive' ? 'bg-green-100 text-green-800' :
                              insight.trend === 'negative' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {insight.trend}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {report.sectionHeaders?.recommendations}
                </h3>
                <div className="space-y-4">
                  {report.enhancedSections.recommendations.map((recommendation, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              recommendation.priority === 'critical' ? 'bg-red-100 text-red-800' :
                              recommendation.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {recommendation.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{recommendation.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span><strong>Effort:</strong> {recommendation.effort}</span>
                            <span><strong>Impact:</strong> {recommendation.impact}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <strong>{report.company} QBR Report</strong> | Report Generated: August 7th, 2025 | QBR by ScalePad
          </div>
        </div>
      </div>
    </div>
  );
}

// Live Data Controls Component for Cork
function LiveDataControls({ report }: { report: QBRData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [availableClients, setAvailableClients] = useState<Array<{
    uuid: string;
    name: string;
    status: string;
    created_at: string;
    deviceCount: number;
  }>>([]);
  const [selectedClientUuid, setSelectedClientUuid] = useState<string>(
    report.liveData?.selectedClientUuid || ''
  );

  // Fetch available clients on component mount
  useEffect(() => {
    if (report.liveData?.enabled) {
      fetchAvailableClients();
    }
  }, [report.liveData?.enabled]);

  const fetchAvailableClients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/deliverables/cork/clients');
      if (response.ok) {
        const data = await response.json();
        setAvailableClients(data.clients || []);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    if (!selectedClientUuid) {
      alert('Please select a client first');
      return;
    }

    setIsRefreshing(true);
    try {
      const response = await fetch('/api/deliverables/cork/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientUuid: selectedClientUuid }),
      });

      if (response.ok) {
        // Reload the page to show updated data
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Failed to refresh data: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
      alert('Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastRefresh = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">🔄 Live Data Controls</h3>
          <p className="text-sm text-gray-600">Refresh data from Cork API</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Live
          </span>
          {report.liveData?.lastRefresh && (
            <span className="text-xs text-gray-500">
              Last updated: {formatLastRefresh(report.liveData.lastRefresh)}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Client Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Client
          </label>
          <select
            value={selectedClientUuid}
            onChange={(e) => setSelectedClientUuid(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          >
            <option value="">Choose a client...</option>
            {availableClients.map((client) => (
              <option key={client.uuid} value={client.uuid}>
                {client.name} ({client.status}) - {client.deviceCount} devices
              </option>
            ))}
          </select>
          {isLoading && (
            <p className="text-xs text-gray-500 mt-1">Loading clients...</p>
          )}
        </div>

        {/* Refresh Button */}
        <div className="flex items-end">
          <button
            onClick={handleRefreshData}
            disabled={!selectedClientUuid || isRefreshing}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isRefreshing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <span>🔄</span>
                <span>Refresh Data</span>
              </>
            )}
          </button>
        </div>

        {/* Status */}
        <div className="flex items-end">
          <div className="w-full text-center">
            {selectedClientUuid && (
              <p className="text-sm text-gray-600">
                Selected: {availableClients.find(c => c.uuid === selectedClientUuid)?.name} 
                ({availableClients.find(c => c.uuid === selectedClientUuid)?.deviceCount} devices)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This will fetch the latest security metrics, device data, and compliance events from the Cork API for the selected client.
        </p>
      </div>
    </div>
  );
}
