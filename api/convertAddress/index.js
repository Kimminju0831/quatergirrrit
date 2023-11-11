const axios = require('axios');

module.exports = async function (context, req) {
    try {
        // Convert address to coordinates using TMap API
        const coordinates = await convertAddressToCoordinates(req.query.address);

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
            body: { error: "Internal Server Error" },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};

async function convertAddressToCoordinates(address) {
    const apiUrl = `https://apis.openapi.sk.com/tmap/geo/convertAddress?version=1&searchTypCd=NtoO&reqAdd=${address}&reqMulti=S&resCoordType=WGS84GEO`;
    const apiKey = "e8wHh2tya84M88aReEpXCa5XTQf3xgo01aZG39k5";

    const headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "appKey": apiKey
    };

    const response = await axios.get(apiUrl, { headers });

    if (response.status !== 200) {
        throw new Error(`TMap API request failed with status code ${response.status}`);
    }

    return JSON.parse(response.data);
}

async function getTransitFare(coordinates) {
    const apiUrl = "https://apis.openapi.sk.com/transit/routes";
    const payload = {
        "startX": coordinates.longitude,
        "startY": coordinates.latitude,
        "endX": "128.6285",
        "endY": "35.8797",
        "lang": 0,
        "format": "json",
        "count": 10
    };

    const headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "appKey": "e8wHh2tya84M88aReEpXCa5XTQf3xgo01aZG39k5"
    };

    const response = await axios.post(apiUrl, payload, { headers });

    if (response.status === 200) {
        const totalFare = response.data.metaData.plan.itineraries[0].fare.regular.totalFare;
        return totalFare;
    } else {
        throw new Error(`API request failed with status code ${response.status}`);
    }
}
