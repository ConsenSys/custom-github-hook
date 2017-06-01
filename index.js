const githubSecret = process.env.GIT_WEBHOOK_SECRET || '';
const githubBranch = process.env.GIT_DEPLOY_BRANCH || 'master';
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
const slackChannel = process.env.SLACK_WEBHOOK_CHANNEL || 'default-channel';
const slackSender = process.env.SLACK_WEBHOOK_SENDER || 'Deploy Bot';
const slackIcon = process.env.SLACK_WEBHOOK_EMOJI || '';
const appHost = process.env.APP_HOST || 'default-machine';

var githubhook = require('githubhook');
var slack = require('slack-notify')(slackWebhookUrl)

var github = githubhook({
    port: 9000,
    secret: githubSecret
});

github.listen();

github.on('push', function (repo, ref, data) {
    if(ref == `refs/heads/${githubBranch}`) {
        var command = require('child_process').spawn('sh', ['deploy.sh']);
        var result = '';

        command.stdout.on('data', function(data) {
            result += data;
        });

        command.stderr.on('data', function(data) {
            result += data;
        });

        command.on('close', function(code) {
            var success = result.indexOf('remote: Deployment succcessful') !== -1;

            var textHeader = '*Deployment Failed*\n';

            if (success)
                textHeader = '*Deployment Succeeded*\n';

            slack.send({
                text: textHeader + '```' + result + '```',
                fields: {
                    'Machine': appHost,
                    'Branch': githubBranch
                },
                icon_emoji: slackIcon,
                channel: slackChannel,
                username: slackSender
            }, function(err) {
                if (err) console.warn(`slack-notify send error: ${err}`);
            })
        });
    }
});
