#!/usr/bin/env python3
"""
Cork MCP Client

A custom MCP client to connect to Cork's MCP server and query warranty services.
This implements the MCP protocol to communicate with Cork's remote MCP server.
"""

import json
import requests
import sys
from typing import Dict, Any, List, Optional
from datetime import datetime

class CorkMCPClient:
    """Custom MCP client for Cork API"""
    
    def __init__(self, api_key: str, base_url: str = "https://api.cork.dev/api/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.mcp_url = f"{base_url}/mcp"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
    def _make_mcp_request(self, method: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Make an MCP request to Cork's server"""
        try:
            # MCP protocol uses JSON-RPC 2.0
            payload = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": method,
                "params": params or {}
            }
            
            response = requests.post(
                self.mcp_url,
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ MCP request failed: {response.status_code} - {response.text}")
                return {"error": f"HTTP {response.status_code}"}
                
        except Exception as e:
            print(f"❌ Error making MCP request: {e}")
            return {"error": str(e)}
    
    def list_tools(self) -> List[Dict[str, Any]]:
        """List available MCP tools"""
        print("🔧 Listing available MCP tools...")
        result = self._make_mcp_request("tools/list")
        
        if "result" in result and "tools" in result["result"]:
            tools = result["result"]["tools"]
            print(f"✅ Found {len(tools)} tools:")
            for tool in tools:
                print(f"   • {tool.get('name', 'Unknown')}: {tool.get('description', 'No description')}")
            return tools
        else:
            print(f"❌ Failed to list tools: {result}")
            return []
    
    def call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Call a specific MCP tool"""
        print(f"🔧 Calling MCP tool: {tool_name}")
        print(f"📝 Arguments: {json.dumps(arguments, indent=2)}")
        
        result = self._make_mcp_request("tools/call", {
            "name": tool_name,
            "arguments": arguments
        })
        
        if "result" in result and "content" in result["result"]:
            content = result["result"]["content"]
            print(f"✅ Tool call successful")
            return content
        else:
            print(f"❌ Tool call failed: {result}")
            return {"error": "Tool call failed"}
    
    def query_warranties(self) -> Dict[str, Any]:
        """Query active warranty services using MCP"""
        print("🔍 Querying active warranty services via MCP...")
        
        # Try to call the warranties tool
        result = self.call_tool("get_warranties", {
            "active": True,
            "page_size": 100
        })
        
        return result
    
    def query_clients(self) -> Dict[str, Any]:
        """Query clients using MCP"""
        print("🔍 Querying clients via MCP...")
        
        result = self.call_tool("get_clients", {
            "page_size": 100
        })
        
        return result

def load_config() -> Optional[str]:
    """Load API key from config file"""
    try:
        with open('cork_config.json', 'r') as f:
            config = json.load(f)
            return config.get('api_key')
    except Exception as e:
        print(f"❌ Error loading config: {e}")
        return None

def main():
    """Main function to test MCP queries"""
    print("🚀 Cork MCP Client Test")
    print("=" * 50)
    
    # Load API key
    api_key = load_config()
    if not api_key:
        print("❌ No API key found in cork_config.json")
        sys.exit(1)
    
    # Initialize MCP client
    client = CorkMCPClient(api_key)
    
    # Test MCP connection by listing tools
    print("\n1. Testing MCP connection...")
    tools = client.list_tools()
    
    if not tools:
        print("❌ No tools found or MCP connection failed")
        print("💡 This might mean:")
        print("   • The API key is invalid")
        print("   • Cork's MCP server is not available")
        print("   • Network connectivity issues")
        sys.exit(1)
    
    # Test warranty query
    print("\n2. Testing warranty query...")
    warranty_result = client.query_warranties()
    
    if "error" not in warranty_result:
        print("✅ Warranty query successful!")
        print(f"📊 Result: {json.dumps(warranty_result, indent=2)}")
    else:
        print(f"❌ Warranty query failed: {warranty_result['error']}")
    
    # Test client query
    print("\n3. Testing client query...")
    client_result = client.query_clients()
    
    if "error" not in client_result:
        print("✅ Client query successful!")
        print(f"📊 Result: {json.dumps(client_result, indent=2)}")
    else:
        print(f"❌ Client query failed: {client_result['error']}")
    
    print("\n✅ MCP client test completed!")

if __name__ == "__main__":
    main()

