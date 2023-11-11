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
    const call_command = `python ./convertAddress/address2grid.py ${address}`;
    // console.log(call_command);

    const execSync = require('child_process').execSync;
    const resultBuffer = execSync(call_command, { encoding: 'utf-8' });
    const result = resultBuffer.toString();

    var jsonData = ""
    try {
        jsonData = JSON.parse(result);
        // console.log(jsonData);
    } catch (error) {
        console.error('JSON 파싱 오류:', error.message);
    }

    context.res.json({
        // status: 200, /* Defaults to 200 */
        address: jsonData.address,
        lon: jsonData.lon,
        lan: jsonData.lan
    });
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
