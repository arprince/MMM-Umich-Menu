'use strict';

Module.register("menu", {

  result: {},
  defaults: {
      updateInterval: 10000,
  },

  getStyles: function() {
    return ["menu.css"];
  },

  start: function () {

      this.mealCount = 0;
      this.firstTime = 1;
      this.loaded = 0;
      this.getMenu();
      this.scheduleUpdate();
  },


  getDom: function() {
      this.mealCount++;

      var table = document.createElement("table");
      table.className = "align-right";

      if (this.mealCount === 3) {
          var dinner = document.createTextNode("DINNER");
          table.appendChild(dinner);
          var line3 = document.createElement("div");
          line3.className = "divider";
          table.appendChild(line3);
          
          if (this.result[2].length === 0) {
              var noFood = document.createTextNode("Dinner will not be served today");
              noFood.className = "bright small regular";
              table.appendChild(noFood);
          }
          else {
              for (var i = 0; i < this.result[2].length - 1; i++) {
                  var row = document.createElement("tr");
                  table.appendChild(row);

                  var col = document.createElement("td");
                  col.innerHTML = this.result[2][i];
                  col.className = "bright small regular";
                  row.appendChild(col);
              }
          }
          this.mealCount = 0;
      }

      else if (this.mealCount === 2) {
          var lunch = document.createTextNode("LUNCH");
          table.appendChild(lunch);
          var line2 = document.createElement("div");
          line2.className = "divider";
          table.appendChild(line2);

          if (this.result[1].length === 0) {
              var noFood = document.createTextNode("Lunch will not be served today");
              noFood.className = "bright small regular";
              table.appendChild(noFood);
          }

          else {
              for (var i = 0; i < this.result[1].length - 1; i++) {
                  var row = document.createElement("tr");
                  table.appendChild(row);

                  var col = document.createElement("td");
                  col.innerHTML = this.result[1][i];
                  col.className = "bright small regular";
                  row.appendChild(col);
              }
          }
      }

      else if (this.mealCount === 1) {
          var breakfeast = document.createTextNode("BREAKFEAST");
          table.appendChild(breakfeast);
          var line = document.createElement("div");
          line.className = "divider";
          table.appendChild(line);

          if (this.result[0].length === 0) {
              var noFood = document.createTextNode("Breakfeast will not be served today");
              noFood.className = "bright small regular";
              table.appendChild(noFood);
          }

          else {
              for (var i = 0; i < this.result[0].length - 1; i++) {
                  var row = document.createElement("tr");
                  table.appendChild(row);

                  var col = document.createElement("td");
                  col.innerHTML = this.result[0][i];
                  col.className = "bright small regular";
                  row.appendChild(col);
              }
          }
      }
      return table;
  },
  
  scheduleUpdate: function (delay) {
      var nextLoad = this.config.updateInterval;
      if (typeof delay !== "undefined" && delay >= 0) {
          nextLoad = delay;
      }

      var self = this;
      setInterval(function () {
          self.getMenu();
      }, nextLoad);
  },

  //updates five minutes after midnight each night and on first boot
  getMenu: function () {
  	  var date = new Date();
      if ((date.getHours() === 0 && date.getMinutes() === 5 && this.loaded === 0) || this.firstTime === 1) {  
          var url = 'https://dining.umich.edu/menus-locations/dining-halls/east-quad/';
          this.sendSocketNotification('GET_MENU', url);

          if (date.getHours() === 0 && date.getMinutes() === 5) {
              this.loaded = 1;
          }
          else {
              this.firstTime = 0;
          }
      }
      else {
          //2.5 second fade each time dom switches from one meal to another
          this.updateDom(2500);
          if (date.getHours() === 0 && date.getMinutes === 6) {
          	this.loaded = 0;
      	  }
      }
  },


  socketNotificationReceived: function(notification, payload) {
      if (notification === "MENU_RESULT") {
          this.result = payload;
          this.updateDom(2500);
    }
  },
});