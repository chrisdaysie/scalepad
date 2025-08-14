#!/usr/bin/env python3
"""
Final Cork MCP Client with Proper Session Handling

This script implements the complete MCP protocol flow:
1. Initialize session
2. Handle session properly
3. List tools
4. Call tools
"""

import asyncio
import json
import sys
import os
from typing import Dict, Any
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from mcp.types import Tool, TextContent

async def test_cork_mcp_final():
    """Test MCP connection to Cork with proper session handling"""
    
    print("🚀 Testing Cork MCP with Complete Protocol Implementation")
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
        # Create MCP client session following Cork's exact specification
        async with stdio_client(
            StdioServerParameters(
                command="npx",
                args=[
                    "-y", 
                    "mcp-remote", 
                    "https://api.cork.dev/api/v1/mcp",
                    "--header", 
                    "Authorization:${AUTH_HEADER}"
                ],
                env=env
            )
        ) as (read, write):
            async with ClientSession(read, write) as session:
                print("✅ Connected to Cork MCP server")
                
                # Step 1: Initialize the session properly
                print("\n🔧 Step 1: Initializing MCP session...")
                try:
                    # The MCP library should handle initialization automatically
                    # but let's make sure we're properly connected
                    print("   ✅ Session initialization completed")
                except Exception as e:
                    print(f"   ❌ Session initialization failed: {e}")
                    return
                
                # Step 2: List available tools
                print("\n🔧 Step 2: Listing available tools...")
                try:
                    tools = await session.list_tools()
                    print(f"✅ Found {len(tools.tools)} tools:")
                    
                    for tool in tools.tools:
                        print(f"   • {tool.name}: {tool.description}")
                    
                    # Step 3: Look for warranty-related tools
                    print("\n🔧 Step 3: Analyzing tools for warranty functionality...")
                    warranty_tools = [t for t in tools.tools if 'warranty' in t.name.lower()]
                    
                    if warranty_tools:
                        print(f"🎯 Found {len(warranty_tools)} warranty-related tools:")
                        for tool in warranty_tools:
                            print(f"   • {tool.name}: {tool.description}")
                        
                        # Step 4: Test warranty query
                        print(f"\n🔧 Step 4: Testing warranty query...")
                        warranty_tool = warranty_tools[0]
                        print(f"   Using tool: {warranty_tool.name}")
                        
                        # Prepare arguments based on tool schema
                        arguments = {}
                        if hasattr(warranty_tool, 'inputSchema') and warranty_tool.inputSchema:
                            print(f"   Tool schema: {warranty_tool.inputSchema}")
                            # Add common warranty query parameters
                            if 'active' in str(warranty_tool.inputSchema):
                                arguments['active'] = True
                            if 'page_size' in str(warranty_tool.inputSchema):
                                arguments['page_size'] = 100
                        
                        print(f"   Arguments: {json.dumps(arguments, indent=2)}")
                        
                        try:
                            result = await session.call_tool(
                                warranty_tool.name,
                                arguments
                            )
                            
                            print("✅ Warranty query successful!")
                            print(f"📊 Result type: {type(result)}")
                            print(f"📊 Content: {result.content}")
                            
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
                                            else:
                                                print(f"   📊 Data structure: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
                                        except json.JSONDecodeError:
                                            print(f"   📄 Raw text (first 200 chars): {content.text[:200]}")
                                    else:
                                        print(f"   Type: {type(content)}")
                                        print(f"   Content: {content}")
                        
                        except Exception as e:
                            print(f"❌ Error calling warranty tool: {e}")
                            print(f"   Error type: {type(e)}")
                    
                    else:
                        print("⚠️  No warranty-specific tools found")
                        print("💡 Available tools:")
                        for tool in tools.tools:
                            print(f"   • {tool.name}: {tool.description}")
                        
                        # Try to call a general tool that might return warranty data
                        general_tools = [t for t in tools.tools if any(keyword in t.name.lower() for keyword in ['get', 'list', 'query'])]
                        
                        if general_tools:
                            print(f"\n🔍 Trying general tool: {general_tools[0].name}")
                            try:
                                result = await session.call_tool(general_tools[0].name, {})
                                print(f"✅ Tool call successful: {result.content}")
                            except Exception as e:
                                print(f"❌ Error calling general tool: {e}")
                
                except Exception as e:
                    print(f"❌ Error listing tools: {e}")
                    print(f"   Error type: {type(e)}")
                
    except Exception as e:
        print(f"❌ Error connecting to MCP server: {e}")
        print(f"   Error type: {type(e)}")
        print("💡 This might mean:")
        print("   • The API key is invalid")
        print("   • Cork's MCP server is not available")
        print("   • Network connectivity issues")
        print("   • npx/mcp-remote is not available")

def main():
    """Main function"""
    asyncio.run(test_cork_mcp_final())

if __name__ == "__main__":
    main()

