#!/usr/bin/env python3
"""
Cork Data Analysis Script

This script analyzes the actual data available from the Cork API
to understand what metrics and insights we can generate for QBR reports.

Usage:
    python analyze_cork_data.py --client-uuid <UUID> --config cork_config.json
"""

import json
import argparse
import logging
import requests
from datetime import datetime, timedelta
import sys
from collections import defaultdict

class CorkDataAnalyzer:
    """Analyze Cork API data to understand available metrics"""
    
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
    
    def analyze_client_data(self, client_uuid: str):
        """Analyze all available data for a client"""
        api_key = self.config.get('cork_api_key', '')
        base_url = self.config.get('cork_base_url', 'https://api.cork.dev')
        
        session = requests.Session()
        session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })
        
        analysis = {
            'client_info': {},
            'devices': {},
            'domains': {},
            'inboxes': {},
            'compliance_events': {},
            'integrations': {},
            'data_insights': {}
        }
        
        # 1. Get client info
        try:
            clients_response = session.get(f"{base_url}/api/v1/clients", params={
                'page_size': 100,
                'show_hidden': False
            })
            clients_data = clients_response.json()
            client_info = next((c for c in clients_data.get('items', []) if c['uuid'] == client_uuid), None)
            if client_info:
                analysis['client_info'] = {
                    'name': client_info.get('name'),
                    'uuid': client_info.get('uuid'),
                    'created_at': client_info.get('created_at'),
                    'warranty_status': client_info.get('warranty_status'),
                    'associated_tenants': len(client_info.get('associated_tenants', []))
                }
        except Exception as e:
            logging.error(f"Error fetching client info: {e}")
        
        # 2. Get devices
        try:
            devices_response = session.get(f"{base_url}/api/v1/clients/{client_uuid}/devices")
            devices_data = devices_response.json()
            devices = devices_data.get('items', [])
            
            analysis['devices'] = {
                'total_count': len(devices),
                'with_endpoints': len([d for d in devices if d.get('associated_endpoints')]),
                'without_endpoints': len([d for d in devices if not d.get('associated_endpoints')]),
                'device_types': defaultdict(int)
            }
            
            for device in devices:
                if device.get('associated_endpoints'):
                    for endpoint in device['associated_endpoints']:
                        if endpoint.get('integration', {}).get('vendor', {}).get('type'):
                            analysis['devices']['device_types'][endpoint['integration']['vendor']['type']] += 1
                            
        except Exception as e:
            logging.error(f"Error fetching devices: {e}")
        
        # 3. Get domains
        try:
            domains_response = session.get(f"{base_url}/api/v1/clients/{client_uuid}/domains")
            domains_data = domains_response.json()
            domains = domains_data.get('items', [])
            
            analysis['domains'] = {
                'total_count': len(domains),
                'domain_list': [d.get('domain') for d in domains]
            }
        except Exception as e:
            logging.error(f"Error fetching domains: {e}")
        
        # 4. Get inboxes
        try:
            inboxes_response = session.get(f"{base_url}/api/v1/clients/{client_uuid}/inboxes")
            inboxes_data = inboxes_response.json()
            inboxes = inboxes_data.get('items', [])
            
            analysis['inboxes'] = {
                'total_count': len(inboxes),
                'with_domains': len([i for i in inboxes if i.get('associated_domains')]),
                'with_users': len([i for i in inboxes if i.get('associated_users')]),
                'email_providers': defaultdict(int)
            }
            
            for inbox in inboxes:
                if inbox.get('associated_domains'):
                    for domain in inbox['associated_domains']:
                        if domain:
                            provider = domain.split('.')[-1] if '.' in domain else 'unknown'
                            analysis['inboxes']['email_providers'][provider] += 1
                            
        except Exception as e:
            logging.error(f"Error fetching inboxes: {e}")
        
        # 5. Get compliance events (last 90 days)
        try:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=90)
            
            events_response = session.get(
                f"{base_url}/api/v1/compliance/client/{client_uuid}/events",
                params={
                    'created_after': start_date.isoformat() + 'Z',
                    'created_before': end_date.isoformat() + 'Z',
                    'page_size': 100,
                    'show_resolved': True,
                    'show_silenced': False
                }
            )
            events_data = events_response.json()
            events = events_data.get('items', [])
            
            analysis['compliance_events'] = {
                'total_count': len(events),
                'resolved_count': len([e for e in events if e.get('resolved_at')]),
                'unresolved_count': len([e for e in events if not e.get('resolved_at')]),
                'at_risk_count': len([e for e in events if e.get('at_risk', False)]),
                'event_types': defaultdict(int),
                'by_device': defaultdict(int),
                'by_domain': defaultdict(int),
                'by_inbox': defaultdict(int)
            }
            
            for event in events:
                event_type = event.get('event_type', 'unknown')
                analysis['compliance_events']['event_types'][event_type] += 1
                
                if event.get('device_uuid'):
                    analysis['compliance_events']['by_device'][event['device_uuid']] += 1
                if event.get('domain_uuid'):
                    analysis['compliance_events']['by_domain'][event['domain_uuid']] += 1
                if event.get('inbox_uuid'):
                    analysis['compliance_events']['by_inbox'][event['inbox_uuid']] += 1
                    
        except Exception as e:
            logging.error(f"Error fetching compliance events: {e}")
        
        # 6. Analyze integrations from client info
        if analysis['client_info']:
            try:
                clients_response = session.get(f"{base_url}/api/v1/clients")
                clients_data = clients_response.json()
                client_info = next((c for c in clients_data.get('items', []) if c['uuid'] == client_uuid), None)
                
                if client_info and client_info.get('associated_tenants'):
                    analysis['integrations'] = {
                        'total_tenants': len(client_info['associated_tenants']),
                        'vendor_types': defaultdict(int),
                        'connection_status': defaultdict(int),
                        'vendors': defaultdict(int)
                    }
                    
                    for tenant in client_info['associated_tenants']:
                        if tenant.get('integration', {}).get('vendor', {}).get('type'):
                            vendor_type = tenant['integration']['vendor']['type']
                            analysis['integrations']['vendor_types'][vendor_type] += 1
                            
                        if tenant.get('integration', {}).get('vendor', {}).get('name'):
                            vendor_name = tenant['integration']['vendor']['name']
                            analysis['integrations']['vendors'][vendor_name] += 1
                            
                        if tenant.get('integration', {}).get('connection_status'):
                            status = tenant['integration']['connection_status']
                            analysis['integrations']['connection_status'][status] += 1
                            
            except Exception as e:
                logging.error(f"Error analyzing integrations: {e}")
        
        # 7. Generate data insights
        analysis['data_insights'] = self._generate_insights(analysis)
        
        return analysis
    
    def _generate_insights(self, analysis):
        """Generate insights from the analyzed data"""
        insights = []
        
        # Device insights
        if analysis['devices']['total_count'] > 0:
            protection_rate = (analysis['devices']['with_endpoints'] / analysis['devices']['total_count']) * 100
            insights.append(f"Device Protection: {analysis['devices']['with_endpoints']}/{analysis['devices']['total_count']} devices protected ({protection_rate:.1f}%)")
            
            if analysis['devices']['without_endpoints'] > 0:
                insights.append(f"Security Gap: {analysis['devices']['without_endpoints']} devices lack endpoint protection")
        
        # Integration insights
        if analysis.get('integrations', {}).get('total_tenants', 0) > 0:
            insights.append(f"Active Integrations: {analysis['integrations']['total_tenants']} connected services")
            
            if 'EDR' in analysis.get('integrations', {}).get('vendor_types', {}):
                insights.append("Endpoint Detection & Response: Active EDR solution detected")
            if 'RMM' in analysis.get('integrations', {}).get('vendor_types', {}):
                insights.append("Remote Monitoring: RMM solution active")
            if 'Email' in analysis.get('integrations', {}).get('vendor_types', {}):
                insights.append("Email Security: Email protection services active")
        
        # Compliance insights
        if analysis['compliance_events']['total_count'] > 0:
            resolution_rate = (analysis['compliance_events']['resolved_count'] / analysis['compliance_events']['total_count']) * 100
            insights.append(f"Event Resolution: {analysis['compliance_events']['resolved_count']}/{analysis['compliance_events']['total_count']} events resolved ({resolution_rate:.1f}%)")
            
            if analysis['compliance_events']['at_risk_count'] > 0:
                insights.append(f"Risk Alert: {analysis['compliance_events']['at_risk_count']} events marked as at-risk")
        
        # Domain insights
        if analysis['domains']['total_count'] > 0:
            insights.append(f"Domain Management: {analysis['domains']['total_count']} domains under management")
        
        return insights
    
    def display_analysis(self, analysis):
        """Display the analysis results"""
        print("\n" + "="*80)
        print("CORK DATA ANALYSIS RESULTS")
        print("="*80)
        
        # Client Info
        if analysis['client_info']:
            print(f"\n📋 CLIENT INFORMATION")
            print(f"Name: {analysis['client_info']['name']}")
            print(f"Status: {analysis['client_info']['warranty_status']}")
            print(f"Tenants: {analysis['client_info']['associated_tenants']}")
        
        # Devices
        if analysis['devices']['total_count'] > 0:
            print(f"\n💻 DEVICE ANALYSIS")
            print(f"Total Devices: {analysis['devices']['total_count']}")
            print(f"Protected: {analysis['devices']['with_endpoints']}")
            print(f"Unprotected: {analysis['devices']['without_endpoints']}")
            
            if analysis['devices']['device_types']:
                print("Device Types:")
                for device_type, count in analysis['devices']['device_types'].items():
                    print(f"  - {device_type}: {count}")
        
        # Integrations
        if analysis.get('integrations', {}).get('total_tenants', 0) > 0:
            print(f"\n🔗 INTEGRATION ANALYSIS")
            print(f"Total Integrations: {analysis['integrations']['total_tenants']}")
            
            if analysis.get('integrations', {}).get('vendor_types'):
                print("Vendor Types:")
                for vendor_type, count in analysis['integrations']['vendor_types'].items():
                    print(f"  - {vendor_type}: {count}")
            
            if analysis.get('integrations', {}).get('connection_status'):
                print("Connection Status:")
                for status, count in analysis['integrations']['connection_status'].items():
                    print(f"  - {status}: {count}")
        
        # Compliance Events
        if analysis['compliance_events']['total_count'] > 0:
            print(f"\n🚨 COMPLIANCE EVENTS (Last 90 Days)")
            print(f"Total Events: {analysis['compliance_events']['total_count']}")
            print(f"Resolved: {analysis['compliance_events']['resolved_count']}")
            print(f"Unresolved: {analysis['compliance_events']['unresolved_count']}")
            print(f"At Risk: {analysis['compliance_events']['at_risk_count']}")
            
            if analysis['compliance_events']['event_types']:
                print("Event Types:")
                for event_type, count in analysis['compliance_events']['event_types'].items():
                    print(f"  - {event_type}: {count}")
        
        # Domains & Inboxes
        if analysis['domains']['total_count'] > 0:
            print(f"\n🌐 DOMAIN ANALYSIS")
            print(f"Total Domains: {analysis['domains']['total_count']}")
            print(f"Domains: {', '.join(analysis['domains']['domain_list'][:5])}{'...' if len(analysis['domains']['domain_list']) > 5 else ''}")
        
        if analysis['inboxes']['total_count'] > 0:
            print(f"\n📧 EMAIL ANALYSIS")
            print(f"Total Inboxes: {analysis['inboxes']['total_count']}")
            print(f"With Domains: {analysis['inboxes']['with_domains']}")
            print(f"With Users: {analysis['inboxes']['with_users']}")
        
        # Insights
        if analysis['data_insights']:
            print(f"\n💡 KEY INSIGHTS")
            for insight in analysis['data_insights']:
                print(f"• {insight}")
        
        print("\n" + "="*80)
        print("ANALYSIS COMPLETE")
        print("="*80)

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Analyze Cork API Data')
    parser.add_argument('--client-uuid', required=True, help='Client UUID to analyze')
    parser.add_argument('--config', default='cork_config.json', help='Configuration file path')
    parser.add_argument('--output', help='Output JSON file for analysis')
    parser.add_argument('--verbose', '-v', action='store_true', help='Enable verbose logging')
    
    args = parser.parse_args()
    
    # Setup logging
    log_level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(level=log_level, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # Analyze data
    analyzer = CorkDataAnalyzer(args.config)
    analysis = analyzer.analyze_client_data(args.client_uuid)
    
    # Display results
    analyzer.display_analysis(analysis)
    
    # Save to file if requested
    if args.output:
        try:
            with open(args.output, 'w') as f:
                json.dump(analysis, f, indent=2)
            print(f"\n✅ Analysis saved to {args.output}")
        except Exception as e:
            logging.error(f"Error saving analysis: {e}")

if __name__ == "__main__":
    main()
