var exec = require('child_process').exec;
function printer(error, stdout, stderr) {
  if(error){
    console.error('exec error: ' + error);
  }
  console.log(stdout);
  console.warn(stderr);
}

exec("apm install atom-live-server", printer);
exec("apm install linter-jshint", printer);
exec("apm install git-plus", printer);
