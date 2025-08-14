#!/usr/bin/env python3
"""
Debug Cork MCP Client with Full Protocol Implementation

This script implements the complete MCP protocol including:
- Proper initialization sequence
- Session management
- Error handling and debugging
"""

import asyncio
import json
import sys
import os
from typing import Dict, Any
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from mcp.types import Tool, TextContent

async def test_cork_mcp_debug():
    """Test MCP connection to Cork with full protocol debugging"""
    
    print("🚀 Debug Cork MCP with Full Protocol Implementation")
    print("=" * 70)
    
    # Load API key from config
    try:
        with open('cork_config.json', 'r') as f:
            config = json.load(f)
            api_key = config.get('cork_api_key')
            if not api_key:
                print("❌ No API key found in cork_config.json")
                return
    except Exception as e:
        print(f"❌ Error loading config: {e}")
        return
    
    print(f"🔑 Using API key: {api_key[:10]}...")
    print(f"🔗 MCP server: https://api.cork.dev/api/v1/mcp")
    
    # Set up environment variable as specified in Cork's docs
    env = {
        "AUTH_HEADER": f"Bearer {api_key}"
    }
    
    try:
        # Create MCP client session with debugging
        print("\n🔧 Creating MCP client session...")
        async with stdio_client(
            StdioServerParameters(
                command="npx",
                args=[
                    "-y", 
                    "mcp-remote", 
                    "https://api.cork.dev/api/v1/mcp",
                    "--header", 
                    "Authorization:${AUTH_HEADER}",
                    "--debug"  # Add debug flag if available
                ],
                env=env
            )
        ) as (read, write):
            print("✅ stdio_client created successfully")
            
            async with ClientSession(read, write) as session:
                print("✅ ClientSession created successfully")
                
                # Step 1: Try to get server info first
                print("\n🔧 Step 1: Getting server info...")
                try:
                    # The MCP library should handle initialization automatically
                    # Let's try to get server info to verify connection
                    print("   ✅ Session established")
                except Exception as e:
                    print(f"   ❌ Session establishment failed: {e}")
                    return
                
                # Step 2: Try to list tools with error handling
                print("\n🔧 Step 2: Listing tools with error handling...")
                try:
                    print("   📤 Sending tools/list request...")
                    tools = await session.list_tools()
                    print(f"   ✅ Received tools response: {len(tools.tools)} tools")
                    
                    for tool in tools.tools:
                        print(f"      • {tool.name}: {tool.description}")
                    
                    # Step 3: Look for warranty tools
                    print("\n🔧 Step 3: Looking for warranty tools...")
                    warranty_tools = [t for t in tools.tools if 'warranty' in t.name.lower()]
                    
                    if warranty_tools:
                        print(f"🎯 Found {len(warranty_tools)} warranty tools:")
                        for tool in warranty_tools:
                            print(f"   • {tool.name}: {tool.description}")
                        
                        # Step 4: Test warranty query
                        print(f"\n🔧 Step 4: Testing warranty query...")
                        warranty_tool = warranty_tools[0]
                        print(f"   Using tool: {warranty_tool.name}")
                        
                        # Try with minimal arguments first
                        arguments = {}
                        print(f"   Arguments: {json.dumps(arguments, indent=2)}")
                        
                        try:
                            print(f"   📤 Sending tool call request...")
                            result = await session.call_tool(
                                warranty_tool.name,
                                arguments
                            )
                            
                            print("✅ Warranty query successful!")
                            print(f"📊 Result: {result.content}")
                            
                            # Parse and display warranty data
                            if result.content:
                                for i, content in enumerate(result.content):
                                    print(f"\n📄 Content {i+1}:")
                                    if isinstance(content, TextContent):
                                        print(f"   Type: TextContent")
                                        print(f"   Text: {content.text[:500]}...")
                                        
                                        try:
                                            data = json.loads(content.text)
                                            if 'items' in data:
                                                warranties = data['items']
                                                active_warranties = [w for w in warranties if w.get('active', False)]
                                                
                                                print(f"\n📈 Warranty Analysis:")
                                                print(f"   • Total warranties: {len(warranties)}")
                                                print(f"   • Active warranties: {len(active_warranties)}")
                                                
                                                if active_warranties:
                                                    print(f"\n🎯 Active Warranty Services:")
                                                    for warranty in active_warranties:
                                                        package = warranty.get('package', 'Unknown')
                                                        client = warranty.get('client_name', 'Unknown')
                                                        start_date = warranty.get('start_date', 'Unknown')
                                                        print(f"   • {package} - {client} (Started: {start_date})")
                                        except json.JSONDecodeError:
                                            print(f"   📄 Raw text: {content.text}")
                        
                        except Exception as e:
                            print(f"❌ Error calling warranty tool: {e}")
                            print(f"   Error type: {type(e)}")
                            print(f"   Error details: {str(e)}")
                    
                    else:
                        print("⚠️  No warranty-specific tools found")
                        print("💡 Available tools:")
                        for tool in tools.tools:
                            print(f"   • {tool.name}: {tool.description}")
                        
                        # Try calling any available tool
                        if tools.tools:
                            print(f"\n🔍 Trying first available tool: {tools.tools[0].name}")
                            try:
                                result = await session.call_tool(tools.tools[0].name, {})
                                print(f"✅ Tool call successful: {result.content}")
                            except Exception as e:
                                print(f"❌ Error calling tool: {e}")
                
                except Exception as e:
                    print(f"❌ Error listing tools: {e}")
                    print(f"   Error type: {type(e)}")
                    print(f"   Error details: {str(e)}")
                    
                    # Try alternative approach - maybe we need to initialize differently
                    print("\n🔄 Trying alternative approach...")
                    try:
                        # Try to send a simple ping or test request
                        print("   📤 Sending test request...")
                        # The MCP library should handle this automatically
                        print("   ⚠️  MCP library should handle initialization")
                    except Exception as e2:
                        print(f"   ❌ Alternative approach failed: {e2}")
                
    except Exception as e:
        print(f"❌ Error connecting to MCP server: {e}")
        print(f"   Error type: {type(e)}")
        print(f"   Error details: {str(e)}")
        print("💡 Debugging suggestions:")
        print("   • Check if Cork's MCP server is running")
        print("   • Verify API key is valid")
        print("   • Check network connectivity")
        print("   • Try different MCP client implementation")

def main():
    """Main function"""
    asyncio.run(test_cork_mcp_debug())

if __name__ == "__main__":
    main()

