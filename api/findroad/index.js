const fetch = require("node-fetch");

module.exports = async function (context, req) {
    try {
        const { startX, startY, endX, endY } = req.body; // 매개변수로부터 위도, 경도 정보를 받음

        const url = "https://apis.openapi.sk.com/transit/routes";

        const payload = {
            "startX": startX,
            "startY": startY,
            "endX": endX,
            "endY": endY,
            "lang": 0,
            "format": "json",
            "count": 10
        };
        const headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "appKey": "e8wHh2tya84M88aReEpXCa5XTQf3xgo01aZG39k5"
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const json_response = await response.json();
            console.log(JSON.stringify(json_response, null, 2));

            let itineraryText = '';

            for (const itinerary of json_response['metaData']["plan"]["itineraries"]) {
                const legs = itinerary.legs || [];
            
                for (const leg of legs) {
                    if ("Lane" in leg) {
                        const lanes = leg["Lane"];
            
                        console.log("Lanes:", lanes);
                        
                        for (let i = 0; i < lanes.length; i++) {
                            const route = lanes[i].route || `No route information for Lane ${i}`;
                            if (route.startsWith('SRT') || route.startsWith('KTX') || route.startsWith('ITX') || route.startsWith('무궁화')) {
                                const departure_station = leg["start"]["name"];
                                const arrival_station = leg["end"]["name"];
            
                                console.log(`야삐 Departure Station: ${departure_station}`);
                                console.log(`야삐 Arrival Station: ${arrival_station}`);
                                console.log(`야삐 Route: ${route}`);
            
                                itineraryText += `Departure Station: ${departure_station}\n`;
                                itineraryText += `Arrival Station: ${arrival_station}\n`;
                                itineraryText += `Route: ${route}\n\n`;

                            }
                        }
                    }
                }
            }

            context.res.body = { itineraryText };
            
            context.res = {
                status: 200,
                body: { itineraryText },  // 직접 context.res.body에 itineraryText를 넣어줌
                headers: {
                  'Content-Type': 'application/json'
                }
              };
        } else {
            console.error(`API request failed with status code ${response.status}`);
            console.error(await response.text());

            context.res = {
                status: response.status,
                body: { error: `API request failed with status code ${response.status}` },
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }
    } catch (error) {
        console.error("Error fetching data:", error);

        context.res = {
            status: 500,
            body: { error: "Error fetching data" },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};
