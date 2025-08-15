// Using built-in fetch (available in Node.js 18+)

async function testFlexibleAssetsMultiStep() {
  // Use the real API key from .env.local
  const apiKey = 'ITG.9354a71c74af5bd6e944390081e34fe4.guAfOB9JpC9nsH9xd_1f7i0pa4UKA3Vu_ZkSQc9--D-DRpssiVM9bH1H2ePdnzzB';
  const baseUrl = 'https://api.itglue.com';
  const clientUuid = '4842637'; // Birdbrain Worldwide
  
  const headers = {
    'x-api-key': apiKey,
    'Content-Type': 'application/vnd.api+json',
  };

  console.log('🔍 Testing Flexible Assets API - Multi-Step Approach...');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log(`Client UUID: ${clientUuid}`);
  console.log('---');

  try {
    // Step 1: Get organization details
    console.log('📋 Step 1: Getting organization details...');
    const orgResponse = await fetch(
      `${baseUrl}/organizations/${clientUuid}`,
      { headers }
    );

    console.log(`Organization response status: ${orgResponse.status}`);
    
    if (!orgResponse.ok) {
      const errorText = await orgResponse.text();
      console.error('❌ Organization error:', errorText);
      return;
    }

    const orgData = await orgResponse.json();
    const organization = orgData.data;
    console.log(`✅ Organization: "${organization.attributes.name}" (ID: ${organization.id})`);
    console.log(`   Type: ${organization.type}`);
    console.log(`   Attributes:`, Object.keys(organization.attributes));
    console.log('---');

    // Step 2: Get flexible asset types (global)
    console.log('📋 Step 2: Getting flexible asset types...');
    const typesResponse = await fetch(
      `${baseUrl}/flexible_asset_types?page[size]=100`,
      { headers }
    );

    console.log(`Types response status: ${typesResponse.status}`);
    
    if (!typesResponse.ok) {
      const errorText = await typesResponse.text();
      console.error('❌ Types error:', errorText);
      return;
    }

    const typesData = await typesResponse.json();
    console.log(`✅ Found ${typesData.data?.length || 0} flexible asset types`);
    
    if (typesData.data && typesData.data.length > 0) {
      console.log('\n📊 Flexible asset types:');
      typesData.data.forEach((type, index) => {
        console.log(`  ${index + 1}. ID: ${type.id}, Name: "${type.attributes.name}"`);
      });
    }
    console.log('---');

    // Step 3: Try different approaches to get flexible assets for this organization
    
    // Approach 3a: Try organization relationships endpoint
    console.log('📋 Step 3a: Trying organization relationships endpoint...');
    const orgRelResponse = await fetch(
      `${baseUrl}/organizations/${clientUuid}/relationships/flexible_assets?page[size]=100`,
      { headers }
    );

    console.log(`Org relationships response status: ${orgRelResponse.status}`);
    
    if (orgRelResponse.ok) {
      const orgRelData = await orgRelResponse.json();
      console.log(`✅ Found ${orgRelData.data?.length || 0} flexible assets via organization relationships`);
      
      if (orgRelData.data && orgRelData.data.length > 0) {
        console.log('\n📊 Flexible assets via relationships:');
        orgRelData.data.forEach((asset, index) => {
          console.log(`  ${index + 1}. ID: ${asset.id}, Type: ${asset.type}`);
        });
      }
    } else {
      const errorText = await orgRelResponse.text();
      console.error('❌ Org relationships error:', errorText);
    }
    console.log('---');

    // Approach 3b: Try flexible assets with organization filter
    console.log('📋 Step 3b: Trying flexible assets with organization filter...');
    const flexOrgResponse = await fetch(
      `${baseUrl}/flexible_assets?filter[organization_id]=${clientUuid}&page[size]=100`,
      { headers }
    );

    console.log(`Flex org filter response status: ${flexOrgResponse.status}`);
    
    if (flexOrgResponse.ok) {
      const flexOrgData = await flexOrgResponse.json();
      console.log(`✅ Found ${flexOrgData.data?.length || 0} flexible assets via organization filter`);
      
      if (flexOrgData.data && flexOrgData.data.length > 0) {
        console.log('\n📊 Flexible assets via org filter:');
        flexOrgData.data.forEach((asset, index) => {
          const attrs = asset.attributes;
          console.log(`  ${index + 1}. "${attrs.name}" (${attrs['flexible-asset-type-name']})`);
        });
      }
    } else {
      const errorText = await flexOrgResponse.text();
      console.error('❌ Flex org filter error:', errorText);
    }
    console.log('---');

    // Approach 3c: Try flexible assets with organization name filter
    console.log('📋 Step 3c: Trying flexible assets with organization name filter...');
    const orgName = organization.attributes.name;
    const flexNameResponse = await fetch(
      `${baseUrl}/flexible_assets?filter[organization_name]=${encodeURIComponent(orgName)}&page[size]=100`,
      { headers }
    );

    console.log(`Flex name filter response status: ${flexNameResponse.status}`);
    
    if (flexNameResponse.ok) {
      const flexNameData = await flexNameResponse.json();
      console.log(`✅ Found ${flexNameData.data?.length || 0} flexible assets via organization name filter`);
      
      if (flexNameData.data && flexNameData.data.length > 0) {
        console.log('\n📊 Flexible assets via name filter:');
        flexNameData.data.forEach((asset, index) => {
          const attrs = asset.attributes;
          console.log(`  ${index + 1}. "${attrs.name}" (${attrs['flexible-asset-type-name']})`);
        });
      }
    } else {
      const errorText = await flexNameResponse.text();
      console.error('❌ Flex name filter error:', errorText);
    }
    console.log('---');

    // Approach 3d: Try getting all flexible assets and filter by organization
    console.log('📋 Step 3d: Getting all flexible assets and filtering by organization...');
    const allFlexResponse = await fetch(
      `${baseUrl}/flexible_assets?page[size]=1000`,
      { headers }
    );

    console.log(`All flex response status: ${allFlexResponse.status}`);
    
    if (allFlexResponse.ok) {
      const allFlexData = await allFlexResponse.json();
      console.log(`✅ Found ${allFlexData.data?.length || 0} total flexible assets`);
      
      if (allFlexData.data && allFlexData.data.length > 0) {
        // Filter by organization
        const orgAssets = allFlexData.data.filter(asset => 
          asset.attributes['organization-id']?.toString() === clientUuid
        );
        
        console.log(`🎯 Found ${orgAssets.length} flexible assets for organization ${clientUuid}`);
        
        if (orgAssets.length > 0) {
          console.log('\n📊 Organization flexible assets:');
          orgAssets.forEach((asset, index) => {
            const attrs = asset.attributes;
            console.log(`  ${index + 1}. "${attrs.name}" (${attrs['flexible-asset-type-name']})`);
            console.log(`     Organization: ${attrs['organization-name']} (${attrs['organization-id']})`);
          });
        }
      }
    } else {
      const errorText = await allFlexResponse.text();
      console.error('❌ All flex error:', errorText);
    }
    console.log('---');

    // Step 4: Try specific flexible asset type for this organization
    console.log('📋 Step 4: Trying specific flexible asset types for this organization...');
    const typeIds = [198141, 198142, 198143, 198144, 198145]; // Common types
    
    for (const typeId of typeIds) {
      console.log(`  Testing type ID: ${typeId}`);
      const typeResponse = await fetch(
        `${baseUrl}/flexible_assets?filter[flexible_asset_type_id]=${typeId}&filter[organization_id]=${clientUuid}&page[size]=10`,
        { headers }
      );
      
      if (typeResponse.ok) {
        const typeData = await typeResponse.json();
        console.log(`    ✅ Found ${typeData.data?.length || 0} assets for type ${typeId}`);
        
        if (typeData.data && typeData.data.length > 0) {
          typeData.data.forEach((asset, index) => {
            const attrs = asset.attributes;
            console.log(`      ${index + 1}. "${attrs.name}" (${attrs['flexible-asset-type-name']})`);
          });
        }
      } else {
        console.log(`    ❌ Type ${typeId}: ${typeResponse.status}`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testFlexibleAssetsMultiStep().then(() => {
  console.log('\n🏁 Multi-step test completed');
}).catch(error => {
  console.error('❌ Multi-step test script failed:', error);
});
