angular
		.module('starter.controllers', [])

		.controller(
				'DashCtrl',
				function($scope, TemperatureService, HumidityService,
						TemperatureHistoryService, $state) {
					$scope.disableTagButton = false;
					$scope.disableTagButtonGraph = false;

					var data = [ {
						value : 22,
						color : "#7CC7FF"
					}, {
						value : 8,
						color : "#E2EAE9"
					} ]

					var data2 = [ {
						value : 14,
						color : "#5AA700"
					}, {
						value : 16,
						color : "#E2EAE9"
					} ]

					var optionsT = {
						animation : true,
						percentageInnerCutout : 80
					}

					var optionsH = {
						animation : true,
						percentageInnerCutout : 80
					};

					Chart.types.Doughnut
							.extend({
								name : "DoughnutT",
								draw : function() {
									Chart.types.Doughnut.prototype.draw.apply(
											this, arguments);

									var cx = document
											.getElementById('myChartT').offsetWidth / 2;
									var cy = document
											.getElementById('myChartT').offsetHeight / 2;

									this.chart.ctx.textBaseline = "middle";
									this.chart.ctx.fillStyle = 'black'
									this.chart.ctx.font = "15px Roboto";
									this.chart.ctx.textAlign = "center";
									this.chart.ctx.fillText("22°C", cx, cy);
								}
							});

					Chart.types.Doughnut
							.extend({
								name : "DoughnutH",
								draw : function() {
									Chart.types.Doughnut.prototype.draw.apply(
											this, arguments);
									var cx = document
											.getElementById('myChartH').offsetWidth / 2;
									var cy = document
											.getElementById('myChartH').offsetHeight / 2;

									this.chart.ctx.textBaseline = "middle";
									this.chart.ctx.fillStyle = 'black'
									this.chart.ctx.font = "15px Roboto";
									this.chart.ctx.textAlign = "center";
									this.chart.ctx.fillText("123%", cx, cy);

								}
							});
					var ctx = document.getElementById("myChartTest")
							.getContext("2d");
					ctx.canvas.width = 300;
					ctx.canvas.height = 300;

					new Chart(ctx)
							.Doughnut(
									data,
									{
										animation : true,
										responsive : true,
										showTooltips : false,
										percentageInnerCutout : 70,
										segmentShowStroke : false,
										onAnimationComplete : function() {
											var fontsize = 15;
											ctx.font = fontsize + "px Verdana";
											ctx.textBaseline = "middle";
											ctx.fillStyle = 'black';
											ctx.textAlign = 'center';

											var cx = document
													.getElementById('myChartTest').offsetWidth / 2;
											var cy = document
													.getElementById('myChartTest').offsetHeight / 2;
											ctx.fillText(data[0].value + "°C",
													cx, cy);
										}
									});

					var ctx2 = document.getElementById("myChartH").getContext(
							"2d");
					ctx2.canvas.width = 300;
					ctx2.canvas.height = 300;
					myNewChartH = new Chart(ctx2).DoughnutH(data2, optionsH);

					var ctx2 = document.getElementById("myChartT1").getContext(
							"2d");
					ctx2.canvas.width = 300;
					ctx2.canvas.height = 300;
					myNewChartH = new Chart(ctx2).DoughnutH(data, optionsT);

					var ctx2 = document.getElementById("myChartH2").getContext(
							"2d");
					ctx2.canvas.width = 300;
					ctx2.canvas.height = 300;
					myNewChartH = new Chart(ctx2).DoughnutH(data2, optionsH);

					var ctx2 = document.getElementById("myChartT3").getContext(
							"2d");
					ctx2.canvas.width = 300;
					ctx2.canvas.height = 300;
					myNewChartH = new Chart(ctx2).DoughnutH(data, optionsT);

					var ctx2 = document.getElementById("myChartH4").getContext(
							"2d");
					ctx2.canvas.width = 300;
					ctx2.canvas.height = 300;
					myNewChartH = new Chart(ctx2).DoughnutH(data2, optionsH);

					$scope.temp = function() {

						var myDataPromise = TemperatureService.getTemperature();
						myDataPromise.then(function(result) {
							$scope.disableTagButtonGraph = false;
							$scope.disableTagButton = true;
							$scope.data = "Temperature: " + result;

						});
					}
				})

		.controller('HelpCtrl', function($scope) {

		})

		.controller(
				'HistoryCtrl',
				function($scope, TemperatureHistoryService) {
					$scope.labels = [ "January", "February", "March", "April",
							"May", "June", "July" ];
					$scope.legend = false;
					$scope.data = [ TemperatureHistoryService
							.getTemperatureHistory() ];

					$scope.labels2 = [ "January", "February", "March", "April",
							"May", "June", "July" ];
					$scope.legend2 = false;
					$scope.data2 = [ [ 65, 59, 80, 81, 56, 55, 40 ] ];

				})