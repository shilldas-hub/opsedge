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

        // 1. Create or Find the Contact
        // HubSpot requires that a Lead is associated to a Contact (LEAD_TO_PRIMARY_CONTACT) 
        // to be successfully created.
        let contactId = null;

        const contactPayload = {
            properties: {
                email: data.email,
                firstname: data.name?.split(' ')[0] || '',
                lastname: data.name?.split(' ').slice(1).join(' ') || '',
                company: data.companyName,
                website: data.websiteUrl
            }
        };

        const contactRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(contactPayload)
        });

        const contactResult = await contactRes.json();

        if (contactRes.ok) {
            contactId = contactResult.id;
        } else if (contactRes.status === 409 && contactResult.message.includes("Existing ID:")) {
            const match = contactResult.message.match(/Existing ID: (\d+)/);
            if (match) contactId = match[1];
        }

        if (!contactId && data.email) {
            // Fallback search if creation failed and the error message format is slightly different
            const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: data.email }] }]
                })
            });
            const searchJson = await searchRes.json();
            if (searchJson.results && searchJson.results.length > 0) {
                contactId = searchJson.results[0].id;
            }
        }

        if (!contactId) {
            console.error("Failed to create/find contact:", contactResult);
            return res.status(500).json({ message: "Failed to create or find contact", error: contactResult });
        }

        // 2. Fetch Association Type Label for Contacts to Leads
        let assocTypeId = null;
        let assocDebugLog = null;
        try {
            // Correct API endpoint for Lead-to-Contact labels
            const assocRes = await fetch('https://api.hubapi.com/crm/v4/associations/leads/contacts/labels', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const assocJson = await assocRes.json();
            assocDebugLog = assocJson;

            if (assocJson.results && assocJson.results.length > 0) {
                // Find EXACT match for LEAD_TO_PRIMARY_CONTACT
                const primary = assocJson.results.find(r =>
                    (r.label && r.label === 'LEAD_TO_PRIMARY_CONTACT') ||
                    (r.name && r.name === 'LEAD_TO_PRIMARY_CONTACT')
                );

                if (primary) {
                    assocTypeId = primary.typeId;
                } else {
                    assocTypeId = assocJson.results[0].typeId;
                }
            }
        } catch (e) {
            console.error("Could not fetch association labels", e);
        }

        // 3. Create the Lead with the required Contact Association
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
                        id: contactId
                    },
                    types: [
                        {
                            associationCategory: "HUBSPOT_DEFINED",
                            associationTypeId: assocTypeId || 284 // 284 is the standard ID for lead-to-contact according to Hubspot community
                        }
                    ]
                }
            ]
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
