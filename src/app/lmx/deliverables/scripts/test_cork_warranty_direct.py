#!/usr/bin/env python3
"""
Direct Cork API Warranty Query

This script uses Cork's REST API directly to query warranty services,
bypassing the MCP complexity for now.
"""

import json
import requests
import sys
from typing import Dict, Any, Optional
from datetime import datetime

class CorkDirectAPI:
    """Direct REST API client for Cork"""
    
    def __init__(self, api_key: str, base_url: str = "https://api.cork.dev/api/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    def get_warranties(self, active_only: bool = True, page_size: int = 100) -> Optional[Dict[str, Any]]:
        """Get warranties directly via REST API"""
        print("🔍 Querying warranties via REST API...")
        
        url = f"{self.base_url}/warranties"
        params = {
            "page_size": page_size
        }
        
        if active_only:
            # Note: The API might not support active filtering directly
            # We'll filter after getting the data
            pass
        
        try:
            response = requests.get(url, headers=self.headers, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Warranty query successful!")
                return data
            else:
                print(f"❌ Warranty query failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Error querying warranties: {e}")
            return None
    
    def get_clients(self, page_size: int = 100) -> Optional[Dict[str, Any]]:
        """Get clients directly via REST API"""
        print("🔍 Querying clients via REST API...")
        
        url = f"{self.base_url}/clients"
        params = {
            "page_size": page_size
        }
        
        try:
            response = requests.get(url, headers=self.headers, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Client query successful!")
                return data
            else:
                print(f"❌ Client query failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Error querying clients: {e}")
            return None
    
    def get_client_warranties(self, client_uuid: str) -> Optional[Dict[str, Any]]:
        """Get warranties for a specific client"""
        print(f"🔍 Querying warranties for client {client_uuid}...")
        
        # Try different possible endpoints
        endpoints = [
            f"{self.base_url}/clients/{client_uuid}/warranties",
            f"{self.base_url}/warranties?client_uuid={client_uuid}",
            f"{self.base_url}/warranties?client={client_uuid}"
        ]
        
        for endpoint in endpoints:
            try:
                response = requests.get(endpoint, headers=self.headers, timeout=30)
                if response.status_code == 200:
                    data = response.json()
                    print(f"✅ Client warranty query successful via {endpoint}")
                    return data
                else:
                    print(f"   ⚠️  {endpoint}: {response.status_code}")
            except Exception as e:
                print(f"   ❌ {endpoint}: {e}")
        
        print(f"❌ No working endpoint found for client {client_uuid}")
        return None

def load_config() -> Optional[str]:
    """Load API key from config file"""
    try:
        with open('cork_config.json', 'r') as f:
            config = json.load(f)
            return config.get('cork_api_key')
    except Exception as e:
        print(f"❌ Error loading config: {e}")
        return None

def analyze_warranty_data(warranty_data: Dict[str, Any]) -> None:
    """Analyze and display warranty data"""
    if not warranty_data or 'items' not in warranty_data:
        print("❌ No warranty data found")
        return
    
    warranties = warranty_data['items']
    total_warranties = len(warranties)
    active_warranties = [w for w in warranties if w.get('active', False)]
    
    print(f"\n📈 Warranty Analysis:")
    print(f"   • Total warranties: {total_warranties}")
    print(f"   • Active warranties: {len(active_warranties)}")
    print(f"   • Inactive warranties: {total_warranties - len(active_warranties)}")
    
    if active_warranties:
        print(f"\n🎯 Active Warranty Services:")
        for warranty in active_warranties:
            package = warranty.get('package', 'Unknown Package')
            client_name = warranty.get('client_name', 'Unknown Client')
            start_date = warranty.get('start_date', 'Unknown Date')
            uuid = warranty.get('uuid', 'Unknown UUID')
            
            print(f"   • {package}")
            print(f"     - Client: {client_name}")
            print(f"     - Started: {start_date}")
            print(f"     - UUID: {uuid}")
            print()
    
    # Analyze warranty types
    packages = [w.get('package', 'Unknown') for w in warranties]
    package_counts = {}
    for package in packages:
        package_counts[package] = package_counts.get(package, 0) + 1
    
    if package_counts:
        print(f"📊 Warranty Package Distribution:")
        for package, count in sorted(package_counts.items(), key=lambda x: x[1], reverse=True):
            print(f"   • {package}: {count} warranties")
    
    # Analyze client distribution
    clients = [w.get('client_name', 'Unknown') for w in warranties]
    client_counts = {}
    for client in clients:
        client_counts[client] = client_counts.get(client, 0) + 1
    
    if client_counts:
        print(f"\n🏢 Client Warranty Distribution:")
        for client, count in sorted(client_counts.items(), key=lambda x: x[1], reverse=True):
            print(f"   • {client}: {count} warranties")

def main():
    """Main function to test direct warranty queries"""
    print("🚀 Cork Direct API Warranty Query Test")
    print("=" * 50)
    
    # Load API key
    api_key = load_config()
    if not api_key:
        print("❌ No API key found in cork_config.json")
        sys.exit(1)
    
    # Create API client
    api = CorkDirectAPI(api_key)
    
    # Test 1: Get all warranties
    print("\n1. Testing direct warranty query...")
    warranty_data = api.get_warranties()
    
    if warranty_data:
        print("✅ Direct warranty query successful!")
        analyze_warranty_data(warranty_data)
    else:
        print("❌ Direct warranty query failed")
    
    # Test 2: Get clients first, then their warranties
    print("\n2. Testing client-based warranty query...")
    client_data = api.get_clients()
    
    if client_data and 'items' in client_data:
        clients = client_data['items']
        print(f"✅ Found {len(clients)} clients")
        
        # Get warranties for each client
        all_client_warranties = []
        for client in clients[:3]:  # Limit to first 3 clients for testing
            client_uuid = client.get('uuid')
            client_name = client.get('name', 'Unknown')
            
            if client_uuid:
                print(f"\n🔍 Checking warranties for client: {client_name}")
                client_warranties = api.get_client_warranties(client_uuid)
                
                if client_warranties and 'items' in client_warranties:
                    warranties = client_warranties['items']
                    active_count = len([w for w in warranties if w.get('active', False)])
                    print(f"   📊 Found {len(warranties)} warranties ({active_count} active)")
                    
                    for warranty in warranties:
                        if warranty.get('active', False):
                            package = warranty.get('package', 'Unknown')
                            start_date = warranty.get('start_date', 'Unknown')
                            print(f"      ✅ {package} (Started: {start_date})")
                    
                    all_client_warranties.extend(warranties)
                else:
                    print(f"   ⚠️  No warranty data found for {client_name}")
        
        if all_client_warranties:
            print(f"\n📈 Combined Client Warranty Summary:")
            print(f"   • Total client warranties: {len(all_client_warranties)}")
            active_client_warranties = [w for w in all_client_warranties if w.get('active', False)]
            print(f"   • Active client warranties: {len(active_client_warranties)}")
    else:
        print("❌ Failed to get clients")
    
    print("\n✅ Direct API warranty query test completed!")

if __name__ == "__main__":
    main()

