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

        // HubSpot expects specific formatting for Revenue Range: "1-5 Cr", "5-25 Cr", "25 Cr+"
        // Frontend provides: "₹1-5Cr", "₹5-25Cr", "₹25Cr+"
        let formattedRevenue = data.revenueRange;
        if (formattedRevenue === "₹1-5Cr") formattedRevenue = "1-5 Cr";
        if (formattedRevenue === "₹5-25Cr") formattedRevenue = "5-25 Cr";
        if (formattedRevenue === "₹25Cr+") formattedRevenue = "25 Cr+";

        // Ensure website URL has http/https prefix
        let formattedWebsite = data.websiteUrl || '';
        if (formattedWebsite && !/^https?:\/\//i.test(formattedWebsite)) {
            formattedWebsite = 'https://' + formattedWebsite;
        }

        // 1. Create or Find the Company
        let companyId = null;

        const companyPayload = {
            properties: {
                name: data.companyName,
                domain: formattedWebsite
            }
        };

        const companyRes = await fetch('https://api.hubapi.com/crm/v3/objects/companies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(companyPayload)
        });

        const companyResult = await companyRes.json();

        if (companyRes.ok) {
            companyId = companyResult.id;
        } else if (companyRes.status === 409 && companyResult.message.includes("Existing ID:")) {
            const match = companyResult.message.match(/Existing ID: (\d+)/);
            if (match) companyId = match[1];
        }

        if (!companyId && formattedWebsite) {
            const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/companies/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    filterGroups: [{ filters: [{ propertyName: 'domain', operator: 'EQ', value: formattedWebsite }] }]
                })
            });
            const searchJson = await searchRes.json();
            if (searchJson.results && searchJson.results.length > 0) {
                companyId = searchJson.results[0].id;
            }
        }

        if (!companyId) {
            console.error("Failed to create/find company:", companyResult);
            return res.status(500).json({ message: "Failed to create or find company", error: companyResult });
        }

        // 2. Fetch Association Type Label for Companies to Leads
        let assocTypeId = null;
        let assocDebugLog = null;
        try {
            const assocRes = await fetch('https://api.hubapi.com/crm/v4/associations/leads/companies/labels', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const assocJson = await assocRes.json();
            assocDebugLog = assocJson;

            if (assocJson.results && assocJson.results.length > 0) {
                const primary = assocJson.results.find(r =>
                    (r.label === 'LEAD_TO_PRIMARY_COMPANY' || r.label === 'Primary') ||
                    (r.name === 'LEAD_TO_PRIMARY_COMPANY')
                );

                if (primary) {
                    assocTypeId = parseInt(primary.typeId, 10);
                } else {
                    assocTypeId = parseInt(assocJson.results[0].typeId, 10);
                }
            }
            console.log("== AVAILABLE ASSOCIATION LABELS ==", JSON.stringify(assocJson.results, null, 2));
        } catch (e) {
            console.error("Could not fetch association labels", e);
        }

        // Fallback to standard HS ID if dynamic fetch fails or returns empty
        if (!assocTypeId || isNaN(assocTypeId)) {
            // There's a good chance 282 is lead to company
            assocTypeId = 282; // Fallback value, might need adjustment if log shows empty
        }
        console.log("== SELECTED ASSOC TYPE ID ==", assocTypeId);

        // 3. Create the Lead with the required Company Association
        const hubspotPayload = {
            properties: {
                hs_lead_name: data.name,
                company_name: data.companyName,
                company_domain: formattedWebsite,
                revenue_range: formattedRevenue,
                crm_used: data.crmUsed,
                primary_revenue_bottleneck: data.bottleneck,
                qualified: data.qualified ? "Yes" : "No",
                work_email: data.email
            },
            associations: [
                {
                    to: {
                        id: companyId
                    },
                    types: [
                        {
                            associationCategory: "HUBSPOT_DEFINED",
                            associationTypeId: assocTypeId
                        }
                    ]
                }
            ]
        };

        console.log("== FINAL LEAD PAYLOAD ==", JSON.stringify(hubspotPayload, null, 2));

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
            return res.status(response.status).json({
                message: 'Error submitting to HubSpot',
                error: result,
                failedAssociationIdTested: assocTypeId,
                availableAssociationLabels: assocDebugLog
            });
        }

        return res.status(200).json({ message: 'Lead successfully submitted', result });
    } catch (error) {
        console.error('Server execution error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
