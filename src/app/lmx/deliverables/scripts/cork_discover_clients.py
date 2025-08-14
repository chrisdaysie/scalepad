#!/usr/bin/env python3
"""
Cork Client Discovery Script

This script helps discover clients and their UUIDs from the Cork API
for use in generating QBR reports.

Usage:
    python cork_discover_clients.py --config cork_config.json
"""

import json
import argparse
import logging
import requests
from datetime import datetime
import sys

class CorkClientDiscovery:
    """Discover clients from Cork API"""
    
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
    
    def discover_clients(self):
        """Discover all clients from Cork API"""
        api_key = self.config.get('cork_api_key', '')
        base_url = self.config.get('cork_base_url', 'https://api.cork.dev')
        
        if not api_key or api_key == 'your_cork_api_key_here':
            print("⚠️  No valid API key found in config. Using mock data for demonstration.")
            return self._get_mock_clients()
        
        try:
            # Create session with API key
            session = requests.Session()
            session.headers.update({
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            })
            
            # Get clients endpoint
            endpoint = f"{base_url}/api/v1/clients"
            params = {
                'page_size': 100,
                'show_hidden': False
            }
            
            response = session.get(endpoint, params=params)
            response.raise_for_status()
            
            data = response.json()
            clients = data.get('items', [])
            
            return clients
            
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching clients: {e}")
            print("⚠️  API request failed. Using mock data for demonstration.")
            return self._get_mock_clients()
    
    def _get_mock_clients(self):
        """Return mock clients for demonstration"""
        return [
            {
                "uuid": "550e8400-e29b-41d4-a716-446655440001",
                "name": "Cork Inc.",
                "created_at": "2024-01-15T10:30:00Z",
                "hidden": False,
                "warranty_status": "active"
            },
            {
                "uuid": "550e8400-e29b-41d4-a716-446655440002",
                "name": "TechCorp Solutions",
                "created_at": "2024-02-20T14:15:00Z",
                "hidden": False,
                "warranty_status": "active"
            },
            {
                "uuid": "550e8400-e29b-41d4-a716-446655440003",
                "name": "Global Manufacturing Co.",
                "created_at": "2024-03-10T09:45:00Z",
                "hidden": False,
                "warranty_status": "pending_activation"
            }
        ]
    
    def display_clients(self, clients):
        """Display clients in a formatted table"""
        print("\n" + "="*80)
        print("CORK CLIENTS DISCOVERED")
        print("="*80)
        print(f"{'UUID':<40} {'Name':<25} {'Status':<15} {'Created':<20}")
        print("-"*80)
        
        for client in clients:
            uuid = client.get('uuid', 'N/A')
            name = client.get('name', 'N/A')
            status = client.get('warranty_status', 'unknown')
            created = client.get('created_at', 'N/A')
            
            # Format created date
            if created != 'N/A':
                try:
                    dt = datetime.fromisoformat(created.replace('Z', '+00:00'))
                    created = dt.strftime('%Y-%m-%d')
                except:
                    pass
            
            print(f"{uuid:<40} {name:<25} {status:<15} {created:<20}")
        
        print("-"*80)
        print(f"Total clients found: {len(clients)}")
        print("\nTo generate a QBR report for a client, use:")
        print("python generate_enhanced_qbr.py --client 'Client Name' --client-uuid <UUID> --period q2-2025 --output report.html")
        print("\nExample:")
        print("python generate_enhanced_qbr.py --client 'Cork Inc.' --client-uuid 550e8400-e29b-41d4-a716-446655440001 --period q2-2025 --output cork-qbr.html")
    
    def save_clients_json(self, clients, output_file: str = "discovered_clients.json"):
        """Save discovered clients to JSON file"""
        try:
            with open(output_file, 'w') as f:
                json.dump(clients, f, indent=2)
            print(f"\n✅ Clients saved to {output_file}")
        except Exception as e:
            logging.error(f"Error saving clients: {e}")

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Discover Cork Clients')
    parser.add_argument('--config', default='cork_config.json', help='Configuration file path')
    parser.add_argument('--output', help='Output JSON file for clients')
    parser.add_argument('--verbose', '-v', action='store_true', help='Enable verbose logging')
    
    args = parser.parse_args()
    
    # Setup logging
    log_level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(level=log_level, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # Discover clients
    discovery = CorkClientDiscovery(args.config)
    clients = discovery.discover_clients()
    
    # Display results
    discovery.display_clients(clients)
    
    # Save to file if requested
    if args.output:
        discovery.save_clients_json(clients, args.output)

if __name__ == "__main__":
    main()
