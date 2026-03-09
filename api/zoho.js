export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;
    const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
        console.error('Missing Zoho CRM Credentials');
        return res.status(500).json({ message: 'Server configuration error' });
    }

    try {
        const data = req.body;

        // 1. Get Access Token using Refresh Token
        // Assuming Zoho generic datacentre (zoho.com) by default, or .in if Indian account. 
        // We will default to .in as the previous instructions showed accounts.zoho.in, 
        // and the user provided tokens that look standard for the IN region if that's what they logged into. 
        // Let's use zoho.in as the domain base. If this fails, we will need to confirm the region with the user (.com, .in, .eu, .com.au)
        // Commonly users are in zoho.com or zoho.in. Let's try accounts.zoho.in first based on the token generation URL provided previously.
        const tokenRes = await fetch('https://accounts.zoho.in/oauth/v2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken
            })
        });

        const tokenResult = await tokenRes.json();

        if (!tokenRes.ok || tokenResult.error) {
            console.error('Failed to get Zoho Access Token:', tokenResult);
            // Fallback attempt: Try generic zoho.com if .in fails with invalid_client or similar
            // This happens if the account is in a different data center
            const fallbackTokenRes = await fetch('https://accounts.zoho.com/oauth/v2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    client_id: clientId,
                    client_secret: clientSecret,
                    refresh_token: refreshToken
                })
            });
            const fallbackTokenResult = await fallbackTokenRes.json();
            if (!fallbackTokenRes.ok || fallbackTokenResult.error) {
                return res.status(500).json({ message: 'Authentication error with CRM', error: fallbackTokenResult });
            }
            tokenResult.access_token = fallbackTokenResult.access_token;
            tokenResult.api_domain = fallbackTokenResult.api_domain;
        }

        const accessToken = tokenResult.access_token;
        const apiDomain = tokenResult.api_domain || 'https://www.zohoapis.in'; // Default to IN if not provided

        // Ensure website URL has http/https prefix
        let formattedWebsite = data.websiteUrl || '';
        if (formattedWebsite && !/^https?:\/\//i.test(formattedWebsite)) {
            formattedWebsite = 'https://' + formattedWebsite;
        }

        // 2. Create the Lead in Zoho CRM
        const zohoPayload = {
            data: [
                {
                    Company: data.companyName,
                    Last_Name: data.name, // Zoho requires Last_Name on Leads.
                    Email: data.email,
                    Website: formattedWebsite,
                    Company_Domain: data.companySize,
                    Company_LinkedIn1: data.companyLinkedin,
                    Designation: data.designation,
                    Annual_Revenue: data.revenueRange ? parseInt(data.revenueRange.replace(/\D/g, '')) * 10000000 : null,
                    Revenue_Range: data.revenueRange,
                    CRM_Used: data.crmUsed,
                    Description: `Primary Bottleneck: ${data.bottleneck}\nQualified: ${data.qualified ? 'Yes' : 'No'}`,
                    Lead_Source: "Website Audit Form"
                }
            ]
        };

        const response = await fetch(`${apiDomain}/crm/v3/Leads`, {
            method: 'POST',
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(zohoPayload)
        });

        const result = await response.json();

        if (!response.ok || (result.data && result.data[0].status === "error")) {
            console.error('Zoho CRM API Error:', result);
            return res.status(response.status || 400).json({
                message: 'Error submitting to Zoho CRM',
                error: result
            });
        }

        return res.status(200).json({ message: 'Lead successfully submitted to Zoho CRM', result });
    } catch (error) {
        console.error('Server execution error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
