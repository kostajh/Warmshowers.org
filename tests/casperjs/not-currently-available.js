var casper = require('casper').create({
    verbose: false,
    logLevel: "debug"
});

if (!casper.cli.get('environment')) {
  casper.echo('Usage: $ casperjs not-currently-available.js --environment=warmshowers.dev').exit(-1);
}

var environment = casper.cli.get('environment');
var link = 'http://' + environment;

casper.test.setUp(function() {
  casper.test.comment('This is where set up happens');
});

casper.test.begin('Users sets their status to not currently available', function suite(test) {
  casper.start(link + '/user', function() {
    this.test.comment('Logging in as test user');
    this.test.assertExists('#user-login');
    this.fill('form#user-login', {
        'name': 'kostajh',
        'pass': 'test'
    }, true);
  });

  casper.then(function() {
    this.test.assertExists('#authentication_block_wrapper');
    this.clickLabel('View Profile');
  });

  casper.then(function() {
    this.test.assertExists('#profile-top');
    this.clickLabel('Edit');
  });

  casper.then(function() {
    this.test.assertExists('#edit-becomeavailable-wrapper');
    this.test.comment('Set up: unset the Not Currently Available field');
    this.test.assertExists('form#user-profile-form');
    this.fill('form#user-profile-form', {
      'country': 'United States',
      'province': 'North Carolina',
      'becomeavailable[year]': '2023',
      'notcurrentlyavailable': false
    });
    this.click('#edit-submit');
  });

  casper.then(function() {
    this.reload();
    this.clickLabel('Edit');
  });

  casper.then(function() {
    this.test.comment('Set status to Not Currently Available');
    this.test.assertExists('form#user-profile-form');
    this.fill('form#user-profile-form', {
      'country': 'United States',
      'province': 'North Carolina',
      'becomeavailable[year]': '2023',
      'notcurrentlyavailable': true
    });
    this.click('#edit-submit');
  });

  casper.then(function() {
    this.test.comment('Checking that form was submitted');
    this.test.assertTextExists('The changes have been saved');
  });

  casper.then(function() {
    this.test.comment('Checking for Not Currently Available status message');
    this.test.assertTextExists('You have set your account to "Not Currently Available" and you will be reminded about this by email from time to time.');
    this.test.assertTextExists('This member has marked themselves as not currently available for hosting');
  });

  casper.run(function() {
    test.done();
    this.test.renderResults(true, 0, this.cli.get('save') || false);
    this.exit();
  }); 
});

