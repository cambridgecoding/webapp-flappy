var exec = require('child_process').exec;
function printer(error, stdout, stderr) {
  if(error){
    console.error('exec error: ' + error);
  }
  console.log(stdout);
  console.warn(stderr);
}
exec("git push origin master:gh-pages --force", printer);
