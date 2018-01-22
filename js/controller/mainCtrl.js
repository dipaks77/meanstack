var app = angular.module("mainCtrl", ["mainFact"]);


/* * * * * * * * * * * * * * Menu Controller * * * * * * * * * * * * * * * * * * * * * * *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
app.controller("MenuCtrl", function($scope, MenuFactory){
	$scope.menus = [
		{
			"link" : "home",
			"text" : "Tests"
		},
		{
			"link" : "addTest",
			"text" : "Add Test"
		},
		{
			"link" : "addQuestion",
			"text" : "Add Questions"
		},
		{
			"link" : "addOptions",
			"text" : "Add Options"
		},
		{
			"link" : "removeTest",
			"text" : "Remove Test"
		},
		{
			"link" : "removeQuestion",
			"text" : "Remove Question"
		}
	];	
	// MenuFactory.menuList(function(MenuFactory){
	// 	$scope.menus = MenuFactory.data;
	// 	console.log($scope.menus);
	// })
});

/* * * * * * * * * * * * * * Home Controller * * * * * * * * * * * * * * * * * * * * * * *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
app.controller("HomeCtrl", function($scope, TestFactory){
	$scope.Tests = [];
	TestFactory.Tests(function(TestFactory){
		$scope.Tests = TestFactory.data;
		len = $scope.Tests.testData.length;
		for(i = 0; i < len; i++){
			$scope.Tests.testData[i].total_que = $scope.Tests.testData[i].questions.length;
		}		
	})
});


/********************* Test Controller ******************************************
******************************************************************************/
app.controller("TestCtrl", function($scope, $routeParams, TestFactory){
	// Variable Declarations
	var id = $routeParams.id;
	var len = 0;

	// $scope Variable Decalrations
	$scope.questions = [];
	$scope.queno = 0;
	$scope.user_ans = [];
	$scope.total = 0;

	// Fetching All Test Questions of test_id
	id = {
		"_id" : id
	};	
	TestFactory.Questions(id).then(function(data){
		$scope.questions = data;				
		len = $scope.questions.testData[0].questions.length;	
	});
	
	// Function to show next question
	var visit = 1;			// Keeps on track of no of visits
	var index = 0;
	$scope.NextQuestion = function(){		
		// Store Answer of Result in $scope.user_ans array		
		total_opt = $scope.questions.testData[0].questions[$scope.queno].options;
		total_opt = Object.keys(total_opt).length;		
		for(i = 0; i < total_opt; i++){
			if($("#" + i).prop("checked") == true){
				$scope.user_ans[index++] = i;				
			}
		}
		
		// If user has pressed on End Button...
		if(visit == len){
			$scope.GetResult();
		}


		// If user has pressed on Next button...
		if($scope.queno < len){
			$scope.queno++;					// If still questions are left...then show them
		}
		if($scope.queno == len){			// If this was last question...change next button to end
			$("#btn-next").attr("class","btn btn-danger btn-md");
			$("#btn-next").html("End");			
		}
		visit++;
	};

	// Function to Calculate Result of Test
	$scope.GetResult = function(){
		var ans = undefined;		
		for(i = 0; i < visit; i++){
			ans = $scope.questions.testData[0].questions[i].ans;
			if(ans == $scope.user_ans[i]){
				$scope.total++;
			}
		}

		// Setting up Result Message
		var html = "<h3>Total Questions : <strong> " + $scope.questions.testData[0].questions.length + "</strong></h3>";
		html += "<h3 class = 'text-success'>Correct Answers : <strong> " + $scope.total + "</strong></h3>";
		html += "<h3 class = 'text-danger'>Wrong Answers : <strong> " + (visit - $scope.total) + "</strong></h3>";
		
		// Setting up End Test Button
		var btn = "<a class = 'btn btn-danger btn-md right' href = '#!/'>End Test</a>";

		// Finally Rendering changes to UI
		$("#main-part").html(html);
		$("#btn-part").html(btn);	
	};
});

/* * * * * * * * * * * * * * Add Test Controller * * * * * * * * * * * * * * * * * * * * * * *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
app.controller("AddTestCtrl", function($scope, NewTestFactory){

	// $scope Variable Declarations	
	$scope.new_test_name = '';
	flag = 0;

	// Scope functions
	$scope.addTest = function(){
		NewTestFactory.setName($scope.new_test_name);
		NewTestFactory.setFlag("0");
		toastr.success("Test Name has been added Successfully!","Success", { timeOut : 2000});
		setTimeout(function(){
			window.location = "#!addQuestion";
		},2000);
	}
/*
	// Function to reset form
	$scope.resetForm = function(){
		$scope.new_Test_name = '';
		$scope.new_Test_price = '';
	};

	// Function to Submit AddTest Form
	$scope.SubmitForm = function(){
		var Test = {
			name : $scope.new_Test_name,
			price : $scope.new_Test_price
		};
		TestFactory.addTest(Test).then(function(data){
			flag = data.data.status;					
			if(flag == "Success"){
				toastr.success("Test " + Test.name + " Added Successfully!", "Added", {timeOut : 3000});
				$scope.resetForm();
				$("#Test_name").focus();
			}else{
				toastr.error("Problem Removing Selected Tests!", "Error", {timeOut : 3000});
			}
		});
	};*/
});

/* * * * * * * * * * * * * * Add Test Controller * * * * * * * * * * * * * * * * * * * * * * *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
app.controller("QuestionCtrl", function($scope, $rootScope, TestFactory, NewTestFactory){
	// Scope Variable Initialization	
	$scope.new_test_name = NewTestFactory.getName();
	$scope.new_test_total_que = '';
	$scope.new_questions = [];
	$scope.testData = [];
	$scope.upd_test_id = '';
	var index = 0;

	TestFactory.Tests(function(TestFactory){
		$scope.data = TestFactory.data;		
		$scope.data.testData.filter(function(test){
			$scope.data.testData[index++].total_que = test.questions.length;
		})		
		console.log($scope.data.testData);
		$scope.Tests = $scope.data.testData;
	});

	// Functions	
	
	// Function to add Questions list to Factory and 
	// Redirect to Add Options page
	$scope.addQuestions = function(){
		if($scope.new_test_name.length == 0){
			NewTestFactory.setFlag('1');
			NewTestFactory.setTestID($scope.upd_test_id);
		}
		console.log($scope.new_questions);
		NewTestFactory.setQuestions($scope.new_questions,$scope.new_test_total_que);
		toastr.success("Questions has been addedd Successfully!", "Success", {timeOut : 2000});

		setTimeout(function(){
			window.location = "#!addOption";
		},2000);
	}


	// Function to save id's of selected
	// Questions to delete
	var index = 0;
	var len = 0;
	$scope.SaveThisBox = function( test_id,question_id ){		
		NewTestFactory.removeQuestion(test_id,question_id);
		len = $scope.Tests.length;
		for(i = 0; i < len; i++){
			if($scope.Tests[i]._id == test_id){
				$scope.Tests[i].questions.splice($scope.Tests[i].questions[question_id],1);
			}
		}
	}

	// Function to Find Range
	$rootScope.Range = function(start,end){
		var result = [];
		for(i = start; i <= end; i++){
			result.push(i);
		}
		return result;
	};
});

/* * * * * * * * * * * * * * Add Test Controller * * * * * * * * * * * * * * * * * * * * * * *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
app.controller("AddOptionCtrl", function($scope, $rootScope, NewTestFactory){	
	$scope.totalopt = '';
	$scope.new_test_name = '';
	$scope.new_test_ans = [];
	$scope.new_test_options = [];
	$scope.new_questions = NewTestFactory.getQuestions();
	var status = NewTestFactory.getFlag();

	if(status == -1){

	}else{
		if(status == "1"){
			$scope.upd_test_id = NewTestFactory.getTestID();
		}else{
			$scope.new_test_name = NewTestFactory.getName();
		}
	}

	// $scope.new_questions = NewTestFactory.getQuestions();	
	$rootScope.Range = function(start,end){
		var result = [];
		for(i = start; i <= end; i++){
			result.push(i);
		}
		return result;
	};

	$scope.SubmitForm = function(){
		if($scope.new_test_name.length > 0){
			$scope.insert = {
				"test_name" : $scope.new_test_name,			
			};
		}else{
			$scope.insert = {};
		}
		$scope.insert.questions = [];		
		for(i = 0; i < $scope.new_questions.total_que; i++){			
			$scope.insert.questions.push({
				"question" : $scope.new_questions.questions[i],
				"options" : $scope.new_test_options[i+1],
				"ans" : $scope.new_test_ans[i]
			});
		}
		console.log($scope.insert);
		// NewTestFactory.addTest($scope.insert,i);
		NewTestFactory.addTest($scope.insert,i).then(function(data){
			console.log(data);
			var result = data.data;
			var status = result.status;
			if(status == "Success"){
				toastr.success("Inserted Successfully! You will be redirected Autometically...", "Added", {timeOut : 2000});
				setTimeout(function() {window.location = '#!/'; }, 2000);
			}else{
				toastr.error("Something went wrong!", "Error", {timeOut : 2000});
			}
		});
	}
});

/* * * * * * * * * * * * * * Update Test Controller * * * * * * * * * * * * * * * * * * * * * * *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
app.controller("UpdateTestCtrl", function($scope, TestFactory){
	// Declaration of $scope Variables
	$scope.Tests = [];
	$scope.Test_id = undefined;
	$scope.search = -1;

	// Fetching Tests
	TestFactory.Tests(function(TestFactory){
		$scope.Tests = TestFactory.data;		
	});

	// Function to fetch Test by id
	$scope.GetTestDetails = function(){
		if($scope.Test_id != undefined){
			var id = $scope.Test_id;
			$scope.search = $scope.Tests.Tests.filter(function(Test){
				if(id == Test._id){
					return Test;
				}
			})[0];
		}
	};


	// Function to Update Test Details
	$scope.UpdateTest = function(){
		var flag = 0;
		var id = {
			"_id" : $scope.Test_id
		};

		var param = {
			id : id,
			name : $scope.search.name,
			price : $scope.search.price
		}
		TestFactory.UpdateTest(param).then(function(data){
			flag = data.data.status;					
			if(flag == "Success"){
				toastr.success("Test " + id._id + " is updated with new name " + param.name + " Successfully!", "Success", {timeOut : 3000});
			}else{
				toastr.error("Problem Removing Selected Tests!", "Error", {timeOut : 3000});
			}
		});
	};
});

/* * * * * * * * * * * * * * Remove Test Controller * * * * * * * * * * * * * * * * * * * * * * *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
app.controller("RemoveTestCtrl", function($scope,TestFactory){
	// $scope Variable Delcaration
	$scope.Tests = [];
	$scope.Test_id = [];
	var index = 0;

	// Fetching all Tests
	TestFactory.Tests(function(TestFactory){
		$scope.Tests = TestFactory.data;
		$scope.Tests.testData.filter(function(test){
			$scope.Tests.testData[index].total_que = test.questions.length;			
			index++;
		})
		console.log($scope.Tests);
	});

	// Functions
	$scope.SaveThisBox = function( id ){		
		var elem = $("#" + id);		
		if(elem.prop("checked") == true){
			$scope.Test_id.push(id);
		}else{
			$scope.Test_id.splice($scope.Test_id.indexOf(elem),1);
		}
		console.log($scope.Test_id);
	};

	$scope.RemoveTest = function(){		
		var len = $scope.Test_id.length;
		var flag = 0;		
		if(len > 0){
			var id = undefined;
			for(i = 0; i < len; i++){
				id = {
					"_id" : $scope.Test_id[i]
				};		
				TestFactory.removeTest(id).then(function(data){							
					flag = data.data.status;
					if(flag == "Success"){										
						$scope.Tests.testData.filter(function(Test){
							if(Test._id == id._id){
								$scope.Tests.testData.splice((i+1),1);
							}							
						});
						toastr.success("Test No " + id._id + " Deleted!", "Success", {timeOut : 3000});
						$scope.Test_id.splice($scope.Test_id.indexOf(id._id),1);						
					}else{
						toastr.error("Problem Removing Selected Tests!", "Error", {timeOut : 3000});
					}
				});
			}			
		}
	}
});