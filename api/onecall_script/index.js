const fetch = require("node-fetch");

module.exports = async function (context, req) {
    try {
        console.log(req.body);

        const { dep, arr, date, time } = req.body;

        const call_command = `python ./onecall_script/chat.py ${dep} ${arr} ${date} ${time}`;
        
        const execSync = require('child_process').execSync;
        const resultBuffer = execSync(call_command, { encoding: 'utf-8' });
        const result = resultBuffer.toString('utf-8');
        // console.log(result)

        context.res.json({
            res: result,
        });


    } catch (error) {
        console.error("Error handling request:", error);

        context.res = {
            status: 500,
            body: { error: "Error handling request" },
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        };
    }
};
