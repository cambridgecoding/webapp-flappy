var exec = require('child_process').exec;
function printer(error, stdout, stderr) {
  if(error){
    console.error('exec error: ' + error);
  }
  console.log(stdout);
  console.warn(stderr);
}

if (!Date.now) {
  Date.now = function now() {
    return new Date().getTime();
  };
}

//var name = "Your Github Name";
//var email = "Your Github email";

//console.log("Configuring git");

//exec("git config --global user.name " + name, printer);
//exec("git config --global user.email " + email, printer);

console.log("Commiting code locally");
exec("git add .", printer);
exec("git commit -a -m \"latest update \"" + Date.now(), printer);
console.log("Pusing code to github");
exec("git push origin master:gh-pages --force", printer);
