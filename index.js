var githubhook = require('githubhook');
var github = githubhook({
    port: 9000,
    secret: ""
});

github.listen();

github.on('push', function (repo, ref, data) {
    // console.log(repo, ref, data);
});

github.on('push', function (repo, ref, data) {
    if(ref == "refs/heads/master") {
        require('child_process').spawn('sh', ['deploy.sh'], {stdio: 'inherit'});
    }
});
