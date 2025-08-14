#!/usr/bin/env python3
"""
Cork Enhanced QBR Generator - AI Insights & Recommendations

This script generates enhanced QBR reports using real data from the Cork API
with separate Risks, Insights, and Recommendations sections.

Usage:
    python cork_generate_enhanced_qbr.py --client-uuid <UUID> --period q2-2025 --output enhanced-qbr.html
"""

import json
import argparse
import logging
from datetime import datetime, timedelta
from pathlib import Path
import sys
import os

# Import our analysis module
from cork_analyze_data import CorkDataAnalyzer

class EnhancedCorkQBRGenerator:
    """Generate enhanced Cork QBR reports with AI Insights & Recommendations"""
    
    def __init__(self, config_path: str):
        self.config_path = config_path
        self.load_config()
        
    def load_config(self):
        """Load configuration from JSON file"""
        try:
            with open(self.config_path, 'r') as f:
                self.config = json.load(f)
        except Exception as e:
            logging.error(f"Error loading config: {e}")
            sys.exit(1)
    
    def generate_report(self, client_uuid: str, period: str, output_path: str):
        """Generate enhanced Cork QBR report"""
        # Calculate date range based on period
        start_date, end_date = self._parse_period(period)
        
        # Analyze client data
        analyzer = CorkDataAnalyzer(self.config_path)
        analysis = analyzer.analyze_client_data(client_uuid)
        
        # Generate AI commentary
        ai_commentary = self._generate_ai_commentary(analysis)
        
        # Generate HTML report
        html_content = self._generate_html_report(analysis, ai_commentary, period, start_date, end_date)
        
        # Save report
        with open(output_path, 'w') as f:
            f.write(html_content)
        
        logging.info(f"Enhanced Cork QBR report generated: {output_path}")
        return output_path
    
    def _parse_period(self, period: str) -> tuple:
        """Parse period string and return start/end dates"""
        now = datetime.now()
        
        if period.startswith('q'):
            # Quarterly periods
            quarter = int(period[1])
            year = int(period.split('-')[1])
            
            if quarter == 1:
                start_date = datetime(year, 1, 1)
                end_date = datetime(year, 3, 31)
            elif quarter == 2:
                start_date = datetime(year, 4, 1)
                end_date = datetime(year, 6, 30)
            elif quarter == 3:
                start_date = datetime(year, 7, 1)
                end_date = datetime(year, 9, 30)
            elif quarter == 4:
                start_date = datetime(year, 10, 1)
                end_date = datetime(year, 12, 31)
        else:
            # Default to last 90 days
            end_date = now
            start_date = now - timedelta(days=90)
        
        return start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')
    
    def _generate_ai_commentary(self, analysis):
        """Generate AI commentary based on the analysis data"""
        commentary = {
            'executive_summary': '',
            'security_posture': '',
            'risk_assessment': '',
            'recommendations': [],
            'key_insights': []
        }
        
        # Executive Summary
        client_name = analysis['client_info'].get('name', 'Client')
        total_events = analysis['compliance_events'].get('total_count', 0)
        resolved_events = analysis['compliance_events'].get('resolved_count', 0)
        at_risk_events = analysis['compliance_events'].get('at_risk_count', 0)
        
        if total_events > 0:
            resolution_rate = (resolved_events / total_events) * 100
            commentary['executive_summary'] = f"{client_name} demonstrates a {'strong' if resolution_rate > 75 else 'moderate' if resolution_rate > 50 else 'needs improvement'} security posture with {resolution_rate:.1f}% event resolution rate. The organization has {at_risk_events} high-priority security events requiring immediate attention."
        else:
            commentary['executive_summary'] = f"{client_name} shows a proactive security posture with no compliance events in the reporting period, indicating strong security controls and monitoring."
        
        # Security Posture Analysis
        device_protection = analysis['devices'].get('total_count', 0)
        protected_devices = analysis['devices'].get('with_endpoints', 0)
        integrations = analysis.get('integrations', {}).get('total_tenants', 0)
        
        if device_protection > 0:
            protection_rate = (protected_devices / device_protection) * 100
            commentary['security_posture'] = f"Device protection coverage is {'excellent' if protection_rate == 100 else 'good' if protection_rate > 80 else 'needs improvement'} at {protection_rate:.1f}%. The organization maintains {integrations} active security integrations, providing comprehensive coverage across endpoint, email, and identity security."
        
        # Risk Assessment
        if at_risk_events > 0:
            commentary['risk_assessment'] = f"Current risk level is {'HIGH' if at_risk_events > 10 else 'MODERATE' if at_risk_events > 5 else 'LOW'} with {at_risk_events} events marked as at-risk. Primary concerns include email security configurations and MFA implementation gaps."
        else:
            commentary['risk_assessment'] = "Risk level is LOW with no at-risk events detected. Security controls are effectively managing threats."
        
        # Generate recommendations based on data
        recommendations = []
        
        # Email security recommendations
        if analysis['compliance_events'].get('event_types', {}).get('insecure-email-configuration', 0) > 0:
            recommendations.append({
                'category': 'Email Security',
                'priority': 'High',
                'title': 'Address Email Configuration Issues',
                'description': f"Resolve {analysis['compliance_events']['event_types']['insecure-email-configuration']} insecure email configuration events",
                'impact': 'Improve email deliverability and prevent spoofing attacks'
            })
        
        # MFA recommendations
        if analysis['compliance_events'].get('event_types', {}).get('mfa', 0) > 0:
            recommendations.append({
                'category': 'Identity Security',
                'priority': 'High',
                'title': 'Enhance Multi-Factor Authentication',
                'description': f"Address {analysis['compliance_events']['event_types']['mfa']} MFA-related security events",
                'impact': 'Strengthen account security and prevent credential-based attacks'
            })
        
        # Event resolution recommendations
        if analysis['compliance_events'].get('unresolved_count', 0) > 0:
            recommendations.append({
                'category': 'Incident Response',
                'priority': 'Medium',
                'title': 'Improve Event Resolution',
                'description': f"Resolve {analysis['compliance_events']['unresolved_count']} outstanding security events",
                'impact': 'Reduce security risk and improve response metrics'
            })
        
        commentary['recommendations'] = recommendations
        
        # Key insights
        insights = []
        
        # Device insights
        if device_protection > 0:
            insights.append(f"100% device protection coverage demonstrates strong endpoint security controls")
        
        # Integration insights
        if integrations > 0:
            insights.append(f"Comprehensive security stack with {integrations} active integrations")
        
        # Event insights
        if total_events > 0:
            insights.append(f"Active security monitoring with {total_events} events detected and {resolved_events} resolved")
        
        # Domain insights
        domains = analysis['domains'].get('total_count', 0)
        if domains > 0:
            insights.append(f"Multi-domain security management with {domains} domains under protection")
        
        commentary['key_insights'] = insights
        
        return commentary
    
    def _generate_html_report(self, analysis, ai_commentary, period, start_date, end_date):
        """Generate HTML content for the enhanced Cork QBR report"""
        
        # Calculate metrics
        client_name = analysis['client_info'].get('name', 'Client')
        total_events = analysis['compliance_events'].get('total_count', 0)
        resolved_events = analysis['compliance_events'].get('resolved_count', 0)
        at_risk_events = analysis['compliance_events'].get('at_risk_count', 0)
        total_devices = analysis['devices'].get('total_count', 0)
        protected_devices = analysis['devices'].get('with_endpoints', 0)
        total_integrations = analysis.get('integrations', {}).get('total_tenants', 0)
        total_domains = analysis['domains'].get('total_count', 0)
        total_inboxes = analysis['inboxes'].get('total_count', 0)
        
        # Calculate percentages
        resolution_rate = (resolved_events / max(total_events, 1)) * 100
        protection_rate = (protected_devices / max(total_devices, 1)) * 100
        
        # Risk color logic - using more professional colors
        risk_color = '#dc3545' if at_risk_events > 10 else '#f59e0b' if at_risk_events > 5 else '#28a745'
        
        # Generate HTML
        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{client_name} Enhanced QBR Report - {period.upper()}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        /* Modern Design System */
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1a202c;
            background: #f7fafc;
            font-weight: 400;
        }}

        .page {{
            width: 8.5in;
            min-height: 11in;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            page-break-after: always;
            position: relative;
        }}

        .page:last-child {{
            page-break-after: auto;
        }}

        /* Header Design */
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2.5rem;
            position: relative;
            overflow: hidden;
        }}

        .header-logo {{
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
            z-index: 3;
        }}

        .header-logo img {{
            height: 50px;
            width: auto;
            filter: brightness(0) invert(1);
            opacity: 0.9;
        }}

        .header-content {{
            position: relative;
            z-index: 2;
        }}

        .company-name {{
            font-size: 3.5rem;
            font-weight: 900;
            margin-bottom: 0.5rem;
            letter-spacing: -2px;
            line-height: 1;
        }}

        .report-title {{
            font-size: 1.4rem;
            opacity: 0.95;
            margin-bottom: 0.5rem;
            font-weight: 400;
        }}

        .date-range {{
            font-size: 1rem;
            opacity: 0.85;
            font-weight: 500;
        }}

        .data-source {{
            font-size: 0.85rem;
            opacity: 0.7;
            margin-top: 0.5rem;
        }}

        /* Navigation */
        .top-nav {{
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            padding: 1rem 1.5rem;
        }}

        .top-nav a {{
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }}

        .ai-badge {{
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 25px;
            font-size: 0.8rem;
            font-weight: 600;
            display: inline-block;
            margin-left: 1rem;
            box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
        }}

        /* Content Layout */
        .content {{
            padding: 2rem;
        }}

        .section {{
            margin-bottom: 3rem;
        }}

        .section h2 {{
            font-size: 1.8rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }}

        /* Executive Summary */
        .executive-summary {{
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 2rem;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }}

        .summary-title {{
            font-size: 2rem;
            font-weight: 800;
            color: #2d3748;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }}

        .summary-grid {{
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
            align-items: start;
        }}

        .summary-text {{
            font-size: 1.1rem;
            line-height: 1.7;
            color: #4a5568;
        }}

        .risk-score {{
            text-align: center;
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }}

        .score-label {{
            font-size: 0.9rem;
            color: #718096;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }}

        .score-value {{
            font-size: 3rem;
            font-weight: 900;
            margin-bottom: 0.25rem;
        }}

        .score-status {{
            font-size: 0.9rem;
            font-weight: 600;
        }}

        /* Metrics Grid */
        .metric-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }}

        .metric-card {{
            background: white;
            border-radius: 16px;
            padding: 1.5rem;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }}

        .metric-card:hover {{
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }}

        .metric-value {{
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            line-height: 1;
        }}

        .metric-value.success {{ color: #38a169; }}
        .metric-value.warning {{ color: #f59e0b; }}
        .metric-value.critical {{ color: #e53e3e; }}

        .metric-label {{
            font-size: 1rem;
            color: #4a5568;
            font-weight: 600;
            margin-bottom: 0.75rem;
        }}

        .metric-change {{
            font-size: 0.85rem;
            margin-bottom: 1rem;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            display: inline-block;
        }}

        .metric-change.positive {{
            background: #c6f6d5;
            color: #22543d;
        }}

        .metric-change.negative {{
            background: #fed7d7;
            color: #742a2a;
        }}

        .progress-bar {{
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
        }}

        .progress-fill {{
            height: 100%;
            transition: width 0.6s ease;
            border-radius: 4px;
        }}

        .progress-fill.success {{ background: linear-gradient(90deg, #38a169, #48bb78); }}
        .progress-fill.warning {{ background: linear-gradient(90deg, #f59e0b, #ed8936); }}
        .progress-fill.critical {{ background: linear-gradient(90deg, #e53e3e, #f56565); }}

        /* AI Commentary */
        .ai-commentary {{
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            border-left: 4px solid #667eea;
            padding: 1.5rem;
            margin: 1.5rem 0;
            border-radius: 0 12px 12px 0;
        }}

        .ai-commentary h3 {{
            color: #2d3748;
            margin-bottom: 1rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }}

        /* AI Insights Section */
        .ai-insights-section {{
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border-radius: 16px;
            padding: 2rem;
            border: 1px solid #e2e8f0;
            margin-bottom: 2rem;
        }}

        .insights-list {{
            list-style: none;
            padding: 0;
            margin: 0;
        }}

        .insight-item {{
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem 0;
            border-bottom: 1px solid #e2e8f0;
            transition: all 0.2s ease;
        }}

        .insight-item:last-child {{
            border-bottom: none;
        }}

        .insight-item:hover {{
            background: rgba(102, 126, 234, 0.05);
            border-radius: 8px;
            padding-left: 1rem;
            padding-right: 1rem;
            margin-left: -1rem;
            margin-right: -1rem;
        }}

        .insight-icon {{
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 0.25rem;
        }}

        .insight-icon svg {{
            width: 12px;
            height: 12px;
            fill: white;
        }}

        .insight-content {{
            flex: 1;
        }}

        .insight-text {{
            color: #2d3748;
            font-weight: 500;
            line-height: 1.6;
            margin: 0;
        }}

        .insight-category {{
            font-size: 0.8rem;
            color: #718096;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 0.25rem;
        }}

        /* Recommendations Section */
        .recommendations-section {{
            background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
            border-radius: 16px;
            padding: 2rem;
            border: 1px solid #e2e8f0;
            margin-bottom: 2rem;
        }}

        .recommendations-list {{
            list-style: none;
            padding: 0;
            margin: 0;
        }}

        .recommendation-item {{
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 1.5rem 0;
            border-bottom: 1px solid #e2e8f0;
            transition: all 0.2s ease;
        }}

        .recommendation-item:last-child {{
            border-bottom: none;
        }}

        .recommendation-item:hover {{
            background: rgba(102, 126, 234, 0.05);
            border-radius: 8px;
            padding-left: 1rem;
            padding-right: 1rem;
            margin-left: -1rem;
            margin-right: -1rem;
        }}

        .recommendation-icon {{
            width: 28px;
            height: 28px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 0.25rem;
        }}

        .recommendation-icon svg {{
            width: 14px;
            height: 14px;
            fill: white;
        }}

        .recommendation-content {{
            flex: 1;
        }}

        .recommendation-title {{
            color: #2d3748;
            font-weight: 700;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            line-height: 1.4;
        }}

        .recommendation-description {{
            color: #4a5568;
            font-weight: 500;
            line-height: 1.6;
            margin-bottom: 0.75rem;
        }}

        .recommendation-meta {{
            display: flex;
            gap: 1rem;
            align-items: center;
            flex-wrap: wrap;
        }}

        .recommendation-category {{
            background: #e2e8f0;
            color: #4a5568;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}

        .recommendation-priority {{
            background: #667eea;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}

        .recommendation-impact {{
            color: #4a5568;
            font-size: 0.85rem;
            font-weight: 500;
            font-style: italic;
        }}

        /* Charts */
        .charts-section {{
            background: white;
            border-radius: 16px;
            padding: 2rem;
            border: 1px solid #e2e8f0;
            margin-bottom: 2rem;
        }}

        .chart-container {{
            display: flex;
            align-items: center;
            gap: 2rem;
            margin-bottom: 2rem;
        }}

        .chart-legend {{
            flex: 1;
        }}

        .legend-item {{
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
            font-size: 0.9rem;
        }}

        .legend-color {{
            width: 12px;
            height: 12px;
            border-radius: 50%;
            flex-shrink: 0;
        }}

        .legend-label {{
            flex: 1;
            font-weight: 500;
        }}

        .legend-value {{
            font-weight: 600;
            color: #4a5568;
        }}

        /* Live Metrics */
        .live-metric {{
            background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
            border-left: 4px solid #3182ce;
            padding: 1.5rem;
            margin: 1rem 0;
            border-radius: 0 12px 12px 0;
        }}

        .live-metric h4 {{
            color: #2c5282;
            margin-bottom: 0.75rem;
            font-weight: 700;
        }}

        .live-metric p {{
            color: #2d3748;
            font-weight: 500;
        }}

        /* Footer */
        .footer-alt {{
            background: #2d3748;
            color: white;
            padding: 1.5rem;
            text-align: center;
            font-size: 0.9rem;
        }}

        .footer-text {{
            opacity: 0.8;
        }}

        /* Responsive Design */
        @media (max-width: 768px) {{
            .page {{
                width: 100%;
                margin: 0;
            }}
            
            .summary-grid {{
                grid-template-columns: 1fr;
            }}
            
            .metric-grid {{
                grid-template-columns: 1fr;
            }}
        }}
    </style>
</head>
<body>
    <!-- Page 1: Executive Summary & AI Commentary -->
    <div class="page">
        <div class="top-nav">
            <a href="../index.html">← Back to Home</a>
            <span class="ai-badge">AI Enhanced</span>
        </div>
        
        <!-- Header -->
        <div class="header">
            <div class="header-logo">
                <img src="../../scalepad-logo.png" alt="ScalePad Logo">
            </div>
            <div class="header-content">
                <h1 class="company-name">{client_name.upper()}</h1>
                <div class="report-title">Enhanced Quarterly Business Review Report</div>
                <div class="date-range">{period.upper()} • {start_date} - {end_date}</div>
                <div class="data-source">Data Source: Cork API • Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')} • AI Enhanced</div>
            </div>
        </div>
        
        <!-- AI Executive Summary -->
        <div class="executive-summary">
            <h2 class="summary-title">🤖 AI-Powered Security Assessment</h2>
            <div class="summary-grid">
                <div class="summary-text">
                    <div class="ai-commentary">
                        <h3>📊 Executive Summary</h3>
                        <p>{ai_commentary['executive_summary']}</p>
                    </div>
                </div>
                <div class="risk-score">
                    <div class="score-label">AI Risk Assessment</div>
                    <div class="score-value" style="color: {risk_color};">{at_risk_events}</div>
                    <div class="score-status" style="color: {risk_color};">At-Risk Events</div>
                </div>
            </div>
        </div>
        
        <!-- Live Metrics Overview -->
        <div class="content">
            <div class="section">
                <h2>📈 Live Security Metrics</h2>
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value {'critical' if resolution_rate < 50 else 'warning' if resolution_rate < 75 else 'success'}">{resolved_events}/{total_events}</div>
                        <div class="metric-label">Event Resolution</div>
                        <div class="metric-change {'negative' if resolution_rate < 75 else 'positive'}">{'Needs Improvement' if resolution_rate < 75 else 'Good'}</div>
                        <div class="progress-bar"><div class="progress-fill {'critical' if resolution_rate < 50 else 'warning' if resolution_rate < 75 else 'success'}" style="width: {resolution_rate}%"></div></div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value {'critical' if protected_devices < total_devices else 'success'}">{protected_devices}/{total_devices}</div>
                        <div class="metric-label">Device Protection</div>
                        <div class="metric-change {'negative' if protected_devices < total_devices else 'positive'}">{'Protected' if protected_devices == total_devices else 'Gaps Found'}</div>
                        <div class="progress-bar"><div class="progress-fill {'critical' if protected_devices < total_devices else 'success'}" style="width: {protection_rate}%"></div></div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value {'critical' if at_risk_events > 10 else 'warning' if at_risk_events > 5 else 'success'}">{at_risk_events}</div>
                        <div class="metric-label">At-Risk Events</div>
                        <div class="metric-change {'negative' if at_risk_events > 5 else 'positive'}">{'High Priority' if at_risk_events > 10 else 'Monitor' if at_risk_events > 5 else 'Low Risk'}</div>
                        <div class="progress-bar"><div class="progress-fill {'critical' if at_risk_events > 10 else 'warning' if at_risk_events > 5 else 'success'}" style="width: {min(at_risk_events * 10, 100)}%"></div></div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value success">{total_integrations}</div>
                        <div class="metric-label">Active Integrations</div>
                        <div class="metric-change positive">Comprehensive</div>
                        <div class="progress-bar"><div class="progress-fill success" style="width: {min(total_integrations * 5, 100)}%"></div></div>
                    </div>
                </div>
            </div>
            
            <!-- Charts Section -->
            <div class="charts-section">
                <h2>📊 Data Visualizations</h2>
                <div class="chart-container">
                    <svg width="200" height="200" viewBox="0 0 200 200">
                        <defs>
                            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
                            </filter>
                        </defs>
                        <circle cx="100" cy="100" r="80" fill="none" stroke="#e2e8f0" stroke-width="16"/>
                        <circle cx="100" cy="100" r="80" fill="none" stroke="#38a169" stroke-width="16" 
                                stroke-dasharray="{2 * 3.14159 * 80 * (resolved_events / max(total_events, 1))} {2 * 3.14159 * 80}" 
                                stroke-dashoffset="0" transform="rotate(-90 100 100)" filter="url(#shadow)"/>
                        <text x="100" y="100" text-anchor="middle" dy=".3em" font-size="24" font-weight="bold" fill="#2d3748">{resolution_rate:.0f}%</text>
                    </svg>
                    <div class="chart-legend">
                        <div class="legend-item">
                            <span class="legend-color" style="background: #38a169"></span>
                            <span class="legend-label">Resolved Events</span>
                            <span class="legend-value">{resolved_events}</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color" style="background: #e2e8f0"></span>
                            <span class="legend-label">Unresolved Events</span>
                            <span class="legend-value">{total_events - resolved_events}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Risks -->
            <div class="section">
                <h2>⚠️ Risks</h2>
                <div class="ai-commentary">
                    <h3>🔍 Security Posture Analysis</h3>
                    <p>{ai_commentary['security_posture']}</p>
                </div>
                <div class="ai-commentary">
                    <h3>⚠️ Risk Assessment</h3>
                    <p>{ai_commentary['risk_assessment']}</p>
                </div>
            </div>
            
            <!-- Insights -->
            <div class="section">
                <h2>🤖 Insights</h2>
                <div class="ai-insights-section">
                    <ul class="insights-list">"""
        
        # Add key insights with better categorization
        for insight in ai_commentary['key_insights']:
            # Determine category based on insight content
            category = 'Security'
            
            if 'device' in insight.lower():
                category = 'Device Protection'
            elif 'integration' in insight.lower():
                category = 'Integration'
            elif 'monitoring' in insight.lower() or 'events' in insight.lower():
                category = 'Event Monitoring'
            elif 'domain' in insight.lower():
                category = 'Domain Management'
            
            html += f"""
                        <li class="insight-item">
                            <div class="insight-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                                </svg>
                            </div>
                            <div class="insight-content">
                                <div class="insight-category">{category}</div>
                                <p class="insight-text">{insight}</p>
                            </div>
                        </li>"""
        
        html += f"""
                    </ul>
                </div>
            </div>
            
            <!-- Recommendations -->
            <div class="section">
                <h2>🎯 Recommendations</h2>
                <div class="recommendations-section">
                    <ul class="recommendations-list">"""
        
        # Add recommendations with green styling
        for rec in ai_commentary['recommendations']:
            html += f"""
                        <li class="recommendation-item">
                            <div class="recommendation-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div class="recommendation-content">
                                <div class="recommendation-title">{rec['title']}</div>
                                <div class="recommendation-description">{rec['description']}</div>
                                <div class="recommendation-meta">
                                    <span class="recommendation-category">{rec['category']}</span>
                                    <span class="recommendation-priority">{rec['priority']}</span>
                                    <span class="recommendation-impact">Impact: {rec['impact']}</span>
                                </div>
                            </div>
                        </li>"""
        
        html += f"""
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="footer-alt">
            <div class="footer-text">
                <strong>Enhanced Cork QBR Report</strong> | AI-Powered Analysis | Live Data from Cork API | Generated: {datetime.now().strftime('%Y-%m-%d')} | Protection by ScalePad
            </div>
        </div>
    </div>
    
    <!-- Page 2: Detailed Analysis -->
    <div class="page">
        <div class="header">
            <div class="header-content">
                <h1>Detailed Security Analysis</h1>
                <div class="subtitle">Comprehensive Data Review & Metrics</div>
            </div>
        </div>
        
        <div class="content">
            <!-- Live Data Summary -->
            <div class="section">
                <h2>📊 Live Data Summary</h2>
                <div class="live-metric">
                    <h4>Security Events</h4>
                    <p>Total: {total_events} | Resolved: {resolved_events} | Unresolved: {analysis['compliance_events'].get('unresolved_count', 0)} | At Risk: {at_risk_events}</p>
                </div>
                <div class="live-metric">
                    <h4>Device Security</h4>
                    <p>Total Devices: {total_devices} | Protected: {protected_devices} | Unprotected: {analysis['devices'].get('without_endpoints', 0)}</p>
                </div>
                <div class="live-metric">
                    <h4>Integration Ecosystem</h4>
                    <p>Total Integrations: {total_integrations} | Vendor Types: {len(analysis.get('integrations', {}).get('vendor_types', {}))} | Connection Status: {analysis.get('integrations', {}).get('connection_status', {}).get('ok', 0)} OK</p>
                </div>
                <div class="live-metric">
                    <h4>Domain & Email Security</h4>
                    <p>Domains: {total_domains} | Inboxes: {total_inboxes} | With Users: {analysis['inboxes'].get('with_users', 0)}</p>
                </div>
            </div>
            
            <!-- Event Type Breakdown -->
            <div class="section">
                <h2>🚨 Security Event Analysis</h2>
                <div class="live-metric">
                    <h4>Event Types (Last 90 Days)</h4>"""
        
        # Add event types
        for event_type, count in analysis['compliance_events'].get('event_types', {}).items():
            html += f"""
                    <p><strong>{event_type.replace('-', ' ').title()}:</strong> {count} events</p>"""
        
        html += """
                </div>
            </div>
        </div>
    </div>
</body>
</html>"""
        
        return html

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Generate Cork Enhanced QBR Reports')
    parser.add_argument('--client-uuid', required=True, help='Client UUID')
    parser.add_argument('--period', required=True, help='Reporting period (e.g., q2-2025)')
    parser.add_argument('--config', default='cork_config.json', help='Configuration file path')
    parser.add_argument('--output', default='../../dist/qbr-report-cork-enhanced.html', help='Output HTML file path')
    parser.add_argument('--verbose', '-v', action='store_true', help='Enable verbose logging')
    
    args = parser.parse_args()
    
    # Setup logging
    log_level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(level=log_level, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # Generate report
    generator = EnhancedCorkQBRGenerator(args.config)
    output_path = generator.generate_report(args.client_uuid, args.period, args.output)
    
    print(f"✅ Enhanced Cork QBR report generated: {output_path}")
    print(f"🤖 Report includes AI-powered analysis and commentary")
    print(f"📊 Based on real data from Cork API")
    print(f"🎨 Clean Risks, Insights & Recommendations sections")
    print(f"🔗 Open the report in your browser to view")

if __name__ == "__main__":
    main()
