var app = angular.module("myApp", ["ngRoute","mainCtrl"]);

app.config(function( $routeProvider ){
	$routeProvider
		.when("/",{
			redirectTo : "/home"
		})
		.when("/home",{
			templateUrl : "home.html",
			controller : "HomeCtrl"
		})
		.when("/startTest/:id",{
			templateUrl : "test.html",
			controller : "TestCtrl"
		})
		.when("/addTest",{
			templateUrl : "addTest.html",
			controller : "AddTestCtrl"
		})
		.when("/addQuestion",{
			templateUrl : "addQuestion.html",
			controller : "QuestionCtrl"
		})
		.when("/addOption",{
			templateUrl : "addOptions.html",
			controller : "AddOptionCtrl"
		})
		.when("/updateTest",{
			templateUrl : "updateTest.html",
			controller : "UpdateTestCtrl"
		})
		.when("/removeTest",{
			templateUrl : "removeTest.html",
			controller : "RemoveTestCtrl"
		})
		.when("/removeQuestion",{
			templateUrl : "removeQuestion.html",
			controller : "QuestionCtrl"
		})
		.otherwise({
			redirectTo : "/home"
		})
});