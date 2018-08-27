var NodeHelper = require('node_helper');
var request = require('request');
var cheerio = require('cheerio');

module.exports = NodeHelper.create({
  start: function () {
    console.log('menu helper started...');
  },

  getMenu: function (url) {
      var self = this;

      request({ url: url, method: 'GET' }, function (error, response, body) {
        if (!error && response.statusCode == 200) {

		var breakfeast = [];
		var lunch = [];
		var dinner = [];

		var lunchLocation = body.lastIndexOf("Lunch");
		var dinnerLocation = body.lastIndexOf("Dinner");
		var breakfeastHTML = body.slice(1, lunchLocation);
		var lunchHTML = body.slice(lunchLocation, dinnerLocation);
		var dinnerHTML = body.slice(dinnerLocation, -1);


		var $ = cheerio.load(breakfeastHTML);
		$('.item-name').each(function(i, elem) {
			breakfeast[i] = $(this).text();
		});

		$ = cheerio.load(lunchHTML);
		$('.item-name').each(function(i, elem) {
			lunch[i] = $(this).text();
		});

		$ = cheerio.load(dinnerHTML);
        $('.item-name').each(function (i, elem) {
            dinner[i] = $(this).text();
        });

            var result = [breakfeast, lunch, dinner];
            self.sendSocketNotification('MENU_RESULT', result);
          }
      });
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'GET_MENU') {
        this.getMenu(payload);
        //var date = new Date();
        //console.log(date.toDateString() + " " + date.toTimeString());
    }
  }
});