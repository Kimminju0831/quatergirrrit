const fetch = require("node-fetch");

module.exports = async function (context, req) {
    try {
        const { dep, arr, date, time } = req.body; // 매개변수로부터 위도, 경도 정보를 받음
        
        const call_command = `python3 ./onecall_script/chat.py ${dep} ${arr} ${date} ${time}`;

        const execSync = require('child_process').execSync;
        const resultBuffer = execSync(call_command, { encoding: 'utf-8' });
        const result = resultBuffer.toString();
        
        var jsonData = ""
        try {
            jsonData = JSON.parse(result);
        } catch (error) {
            console.error('JSON 파싱 오류:', error.message);
        }
        
        context.res.json({
            // status: 200, /* Defaults to 200 */
            res: jsonData
        });

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