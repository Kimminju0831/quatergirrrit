module.exports = async function (context, req) {

    const {dep, arr, date, time} = req.body;

    const call_command = `python ./ktx_schedule/ktx_api.py ${dep} ${arr} ${date} ${time}`;
    // console.log(call_command);

    const execSync = require('child_process').execSync;
    const resultBuffer = execSync(call_command, { encoding: 'utf-8' });
    const result = resultBuffer.toString();

    // console.log(result.toString("utf8"))

    var jsonData = ""
    try {
        jsonData = JSON.parse(result);
        console.log(jsonData);
    } catch (error) {
        console.error('JSON 파싱 오류:', error.message);
    }

    context.res = {
        status: 200,
        body: jsonData,
        headers: {
            'Content-Type': 'application/json'
        }
    };
}