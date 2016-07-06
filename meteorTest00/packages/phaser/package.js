Package.describe({
  name: 'dijdev:phaser',
  version: '2.4.4',
  // Brief, one-line summary of the package.
  summary: 'Phaser.io 2.4.4 packaged for Meteor (version 1.2.1)',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/mrjones91/dijdev:phaser.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.addFiles('phaser.js', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('dijdev:phaser');
  api.addFiles('phaser-tests.js');
});
