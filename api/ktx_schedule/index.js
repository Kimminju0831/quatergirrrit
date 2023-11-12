module.exports = async function (context, req) {

    const dep = "동대구";
    const arr = "서울";
    const date = "20231112";
    const time = "120000";

    const call_command = `python ./ktx_schedule/ktx_api.py ${dep} ${arr} ${date} ${time}`;
    console.log(call_command);

    const execSync = require('child_process').execSync;
    const resultBuffer = execSync(call_command, { encoding: 'utf-8' });
    const result = resultBuffer.toString();

    console.log(result.toString("utf8"))

    var jsonData = ""
    try {
        jsonData = JSON.parse(result);
        // console.log(jsonData);
    } catch (error) {
        console.error('JSON 파싱 오류:', error.message);
    }

    context.res.json({
        // status: 200, /* Defaults to 200 */
        res: jsonData
    });
}