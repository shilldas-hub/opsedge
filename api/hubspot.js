export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = process.env.HUBSPOT_ACCESS_TOKEN;

    if (!token) {
        console.error('Missing HubSpot Access Token');
        return res.status(500).json({ message: 'Server configuration error' });
    }

    try {
        const data = req.body;

        // Map your frontend form data to standard HubSpot contact properties
        const hubspotPayload = {
            properties: {
                email: data.email,
                firstname: data.name?.split(' ')[0] || '',
                lastname: data.name?.split(' ').slice(1).join(' ') || '',
                company: data.companyName,
                website: data.websiteUrl,
                // We put custom fields into a structured note in the "message" / "hs_lead_status" or custom fields
                // Since custom properties require setup on HubSpot side, we'll append to 'message' to ensure data isn't lost.
                message: `Revenue Range: ${data.revenueRange}\nCRM Used: ${data.crmUsed}\nPrimary Bottleneck: ${data.bottleneck}\nQualified: ${data.qualified}`,
            }
        };

        const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(hubspotPayload)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('HubSpot API Error:', result);

            // If contact already exists (error 409), we could optionally update it, 
            // but for now we'll just return success since we captured the lead intent.
            if (response.status === 409) {
                return res.status(200).json({ message: 'Contact already exists, considered success.', result });
            }

            return res.status(response.status).json({ message: 'Error submitting to HubSpot', error: result });
        }

        return res.status(200).json({ message: 'Lead successfully submitted', result });
    } catch (error) {
        console.error('Server execution error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
