const axios = require('axios');

module.exports = async function (context, req) {
    try {
        const address = req.query.address;
        if (!address) {
            throw new Error("Address is required.");
        }

        // Convert address to coordinates using TMap API
        const coordinates = await convertAddressToCoordinates(address);

        // Call Transit API with coordinates
        const totalFare = await getTransitFare(coordinates);

        context.res = {
            status: 200,
            body: { text: `Total Fare: ${totalFare} 원` },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (error) {
        console.error("Error:", error);

        context.res = {
            status: 500,
            body: { error: error.message },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};

async function getTransitFare(coordinates) {
    const apiUrl = "https://apis.openapi.sk.com/transit/routes";
    const payload = {
        "startX": coordinates.newLon,
        "startY": coordinates.newLat,
        "endX": "128.6285",
        "endY": "35.8797",
        "lang": 0,
        "format": "json",
        "count": 10
    };

    const apiKey = "e8wHh2tya84M88aReEpXCa5XTQf3xgo01aZG39k5";

    const headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "appKey": apiKey,
    };

    try {
        const response = await axios.post(apiUrl, payload, { headers });

        if (response.status === 200) {
            const totalFare = response.data.metaData.plan.itineraries[0].fare.regular.totalFare;
            return totalFare;
        } else {
            throw new Error(`API request failed with status code ${response.status}`);
        }
    } catch (error) {
        throw new Error(`Error getting transit fare: ${error.message}`);
    }
}
