'use strict';
var util = require('util');
var exec = require('shelljs').exec;
var path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');

var LarGenerator = module.exports = function LarGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {

  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(LarGenerator, yeoman.generators.Base);

LarGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    type: 'confirm',
    name: 'start',
    message: 'Start Generator?',
    default: true
  },{
    type: 'prompt',
    name: 'title',
    message: 'What\'s the title of your app?',
    default: 'My App'
  },{
    type: 'confirm',
    name: 'backbone',
    message: 'Would you like backbone?',
    default: false
  },{
    type: 'confirm',
    name: 'ldap',
    message: 'Would you like to include LDAP config?',
    default: false
  },{
    type: 'confirm',
    name: 'wgenerator',
    message: 'Would you like JefferyWay Generator?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.start = props.start;
    this.title = props.title;
    this.backbone = props.backbone;
    this.ldap = props.ldap;
    cb();
  }.bind(this));
};

LarGenerator.prototype._generateApp = function () {
  this.bowerDeps = '';
  console.log("Generating Your App ...");
  if (this.backbone) {
    this.bowerDeps 
       = '"jquery" : "*",\n'
      +'"underscore" : "*",\n'
      +'"backbone" : "*"\n';
  };
  if (fs.existsSync('.DS_Store')) {
    fs.unlinkSync('.DS_Store');
    console.log('deleted .DS_Store');
  }

  exec('composer create-project laravel/laravel .');
  exec('cp app/config/database.php app/config/database-example.php');
  exec("find bootstrap -name 'start.php' -exec sed -i '' -e 's/your-machine-name/localhost/g' {} \;");
  if (this.wgenerator) {
    exec('composer require way/generators:dev-master');
  }
  if (this.ldap) {
    this.copy('ldap.php', 'app/config/ldap.php');
    this.copy('ldap.php', 'app/config/ldap-example.php');
  }
  this.copy('gitignore', '.gitignore');
  this.template('_bower.json', 'bower.json');
  //this.copy('travis.yml', '.travis.yml');
  this.copy('bowerrc', '.bowerrc');
  
}

LarGenerator.prototype.app = function app() {
  if (this.start) {
    this._generateApp();
  }
  else {
    console.log("Then why are you calling me if you don't want to start?");
  }
};

LarGenerator.prototype.projectfiles = function projectfiles() {
  //this.copy('editorconfig', '.editorconfig');
  //this.copy('jshintrc', '.jshintrc');
};


