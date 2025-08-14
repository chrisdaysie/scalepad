#!/usr/bin/env python3
"""
Cork API Setup Script

This script helps you securely configure your Cork API key.
It will create a cork_config.json file from the template and prompt for your API key.
"""

import json
import os
import getpass
from pathlib import Path

def setup_api_config():
    """Setup the Cork API configuration file."""
    
    # Get the script directory
    script_dir = Path(__file__).parent
    template_file = script_dir / "cork_config.template.json"
    config_file = script_dir / "cork_config.json"
    
    print("🍾 Cork API Setup")
    print("=" * 50)
    
    # Check if config already exists
    if config_file.exists():
        print(f"⚠️  Configuration file already exists: {config_file}")
        response = input("Do you want to overwrite it? (y/N): ").lower().strip()
        if response != 'y':
            print("Setup cancelled.")
            return
    
    # Check if template exists
    if not template_file.exists():
        print(f"❌ Template file not found: {template_file}")
        print("Please ensure cork_config.template.json exists.")
        return
    
    try:
        # Read template
        with open(template_file, 'r') as f:
            config = json.load(f)
        
        print("\n🔐 API Key Configuration")
        print("-" * 30)
        print("Enter your Cork API key (input will be hidden):")
        
        # Get API key securely
        api_key = getpass.getpass("API Key: ").strip()
        
        if not api_key:
            print("❌ API key cannot be empty.")
            return
        
        if api_key == "your_cork_api_key_here":
            print("❌ Please enter your actual API key, not the placeholder.")
            return
        
        # Update config
        config["cork_api_key"] = api_key
        
        # Write config file
        with open(config_file, 'w') as f:
            json.dump(config, f, indent=4)
        
        print(f"\n✅ Configuration saved to: {config_file}")
        print("🔒 This file is in .gitignore and will not be committed to version control.")
        
        # Test the configuration
        print("\n🧪 Testing API connection...")
        test_api_connection(api_key)
        
    except Exception as e:
        print(f"❌ Error during setup: {e}")

def test_api_connection(api_key):
    """Test the API connection with the provided key."""
    try:
        import requests
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(
            'https://api.cork.dev/api/v1/clients',
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ API connection successful!")
            data = response.json()
            client_count = len(data.get('items', []))
            print(f"📊 Found {client_count} clients available")
        elif response.status_code == 401:
            print("❌ API key is invalid or expired")
        else:
            print(f"⚠️  API connection failed (Status: {response.status_code})")
            
    except ImportError:
        print("⚠️  'requests' module not found. Install with: pip install requests")
    except Exception as e:
        print(f"⚠️  Could not test API connection: {e}")

if __name__ == "__main__":
    setup_api_config()
