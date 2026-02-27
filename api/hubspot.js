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

        // Map your frontend form data to HubSpot Lead properties based on user's schema
        const hubspotPayload = {
            properties: {
                hs_lead_name: data.name,
                company_name: data.companyName,
                company_domain: data.websiteUrl,
                revenue_range: data.revenueRange,
                crm_used: data.crmUsed,
                primary_revenue_bottleneck: data.bottleneck,
                qualified: data.qualified ? "Yes" : "No",
                work_email: data.email
            }
        };

        const response = await fetch('https://api.hubapi.com/crm/v3/objects/leads', {
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
            return res.status(response.status).json({ message: 'Error submitting to HubSpot', error: result });
        }

        return res.status(200).json({ message: 'Lead successfully submitted', result });
    } catch (error) {
        console.error('Server execution error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
