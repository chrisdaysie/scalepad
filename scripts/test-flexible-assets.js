// Using built-in fetch (available in Node.js 18+)

async function testFlexibleAssets() {
  // Use the real API key from .env.local
  const apiKey = 'ITG.9354a71c74af5bd6e944390081e34fe4.guAfOB9JpC9nsH9xd_1f7i0pa4UKA3Vu_ZkSQc9--D-DRpssiVM9bH1H2ePdnzzB';
  const baseUrl = 'https://api.itglue.com';
  const clientUuid = '4842637'; // Birdbrain Worldwide
  
  const headers = {
    'x-api-key': apiKey,
    'Content-Type': 'application/vnd.api+json',
  };

  console.log('🔍 Testing Flexible Assets API...');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log(`Client UUID: ${clientUuid}`);
  console.log('---');

  // Test 0: First test configurations to make sure the API key works
  console.log('🔧 Test 0: Testing configurations endpoint (should work)...');
  const configResponse = await fetch(
    `${baseUrl}/configurations?filter[organization_id]=${clientUuid}&filter[archived]=false&page[size]=1`,
    { headers }
  );
  console.log(`Config response status: ${configResponse.status}`);
  if (configResponse.ok) {
    const configData = await configResponse.json();
    console.log(`✅ Configurations work! Found ${configData.data?.length || 0} configurations`);
  } else {
    const errorText = await configResponse.text();
    console.error('❌ Configurations error:', errorText);
  }
  console.log('---');

  try {
    // Test 1: Fetch flexible assets with type ID filter
    console.log('📋 Test 1: Fetching flexible assets with type ID filter...');
    const flexibleAssetsResponse = await fetch(
      `${baseUrl}/flexible_assets?filter[flexible_asset_type_id]=1&filter[archived]=false&page[size]=10`,
      { headers }
    );

    console.log(`Response status: ${flexibleAssetsResponse.status}`);
    console.log(`Response headers:`, Object.fromEntries(flexibleAssetsResponse.headers.entries()));

    if (!flexibleAssetsResponse.ok) {
      const errorText = await flexibleAssetsResponse.text();
      console.error('❌ Error response:', errorText);
      return;
    }

    const flexibleAssetsData = await flexibleAssetsResponse.json();
    console.log(`✅ Success! Found ${flexibleAssetsData.data?.length || 0} flexible assets`);
    
    if (flexibleAssetsData.data && flexibleAssetsData.data.length > 0) {
      console.log('\n📊 Sample flexible assets:');
      flexibleAssetsData.data.slice(0, 3).forEach((asset, index) => {
        const attrs = asset.attributes;
        console.log(`  ${index + 1}. "${attrs.name}"`);
        console.log(`     Organization ID: ${attrs['organization-id']}`);
        console.log(`     Organization Name: ${attrs['organization-name']}`);
        console.log(`     Type ID: ${attrs['flexible-asset-type-id']}`);
        console.log(`     Type Name: ${attrs['flexible-asset-type-name']}`);
        console.log(`     Archived: ${attrs.archived}`);
        console.log('');
      });

      // Check if any assets belong to Birdbrain Worldwide
      const birdbrainAssets = flexibleAssetsData.data.filter(asset => 
        asset.attributes['organization-id']?.toString() === clientUuid
      );
      console.log(`🎯 Assets for Birdbrain Worldwide (${clientUuid}): ${birdbrainAssets.length}`);
      
      if (birdbrainAssets.length > 0) {
        console.log('\n📋 Birdbrain Worldwide flexible assets:');
        birdbrainAssets.forEach((asset, index) => {
          const attrs = asset.attributes;
          console.log(`  ${index + 1}. "${attrs.name}" (${attrs['flexible-asset-type-name']})`);
        });
      }
    }

    // Test 2: Fetch flexible asset types
    console.log('\n🔍 Test 2: Fetching flexible asset types...');
    const flexibleAssetTypesResponse = await fetch(
      `${baseUrl}/flexible_asset_types?page[size]=100`,
      { headers }
    );

    console.log(`Types response status: ${flexibleAssetTypesResponse.status}`);

    if (flexibleAssetTypesResponse.ok) {
      console.log(`✅ Found ${typesData.data?.length || 0} flexible asset types`);
      
      if (typesData.data && typesData.data.length > 0) {
        console.log('\n📊 All flexible asset types:');
        typesData.data.forEach((type, index) => {
          console.log(`  ${index + 1}. ID: ${type.id}, Name: "${type.attributes.name}"`);
        });
        
        // Store all type IDs for testing
        const allTypeIds = typesData.data.map(type => parseInt(type.id));
        console.log(`\n🔢 All type IDs: [${allTypeIds.join(', ')}]`);
      }
    } else {
      const errorText = await flexibleAssetTypesResponse.text();
      console.error('❌ Types error response:', errorText);
    }

    // Test 3: Try all flexible asset type IDs we found
    console.log('\n🔍 Test 3: Trying all flexible asset type IDs...');
    let allTypeIds = [];
    let typesData = null;
    
    // Get all type IDs from the types response
    if (flexibleAssetTypesResponse.ok) {
      typesData = await flexibleAssetTypesResponse.json();
      allTypeIds = typesData.data.map(type => parseInt(type.id));
    }
    
    const typeIds = allTypeIds.length > 0 ? allTypeIds : [198141, 198142, 198143, 198144, 198145]; // Fallback to known IDs
    
    for (const typeId of typeIds) {
      console.log(`  Testing type ID: ${typeId}`);
      const typeResponse = await fetch(
        `${baseUrl}/flexible_assets?filter[flexible_asset_type_id]=${typeId}&filter[archived]=false&page[size]=5`,
        { headers }
      );
      
      if (typeResponse.ok) {
        const typeData = await typeResponse.json();
        console.log(`    ✅ Found ${typeData.data?.length || 0} assets for type ${typeId}`);
        
        if (typeData.data && typeData.data.length > 0) {
          // Check if any belong to Birdbrain Worldwide
          const birdbrainAssets = typeData.data.filter(asset => 
            asset.attributes['organization-id']?.toString() === clientUuid
          );
          if (birdbrainAssets.length > 0) {
            console.log(`    🎯 Found ${birdbrainAssets.length} assets for Birdbrain Worldwide!`);
            birdbrainAssets.forEach((asset, index) => {
              const attrs = asset.attributes;
              console.log(`      ${index + 1}. "${attrs.name}" (${attrs['flexible-asset-type-name']})`);
            });
          }
        }
      } else {
        console.log(`    ❌ Type ${typeId}: ${typeResponse.status}`);
      }
    }

    // Test 4: Try organization relationship endpoint
    console.log('\n🔍 Test 4: Trying organization relationship endpoint...');
    const orgRelationshipResponse = await fetch(
      `${baseUrl}/organizations/${clientUuid}/relationships/flexible_assets?filter[archived]=false&page[size]=10`,
      { headers }
    );

    console.log(`Org relationship response status: ${orgRelationshipResponse.status}`);
    
    if (orgRelationshipResponse.ok) {
      const orgData = await orgRelationshipResponse.json();
      console.log(`✅ Found ${orgData.data?.length || 0} flexible assets via organization relationship`);
    } else {
      const errorText = await orgRelationshipResponse.text();
      console.error('❌ Org relationship error response:', errorText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testFlexibleAssets().then(() => {
  console.log('\n🏁 Test completed');
}).catch(error => {
  console.error('❌ Test script failed:', error);
});
