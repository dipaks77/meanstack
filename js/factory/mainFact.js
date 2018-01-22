var app = angular.module("mainFact", []);


/********************* Menu Factory ******************************************
******************************************************************************/
app.factory("MenuFactory", function($http){
	function getMenus( callback ){
		$http.get("http://localhost:8080/getMenu").then( callback );
	}

	return{
		menuList : getMenus
	}
});

/********************* Test Factory ******************************************
******************************************************************************/
app.factory("TestFactory", function($http){
	function getTests( callback ){
		$http.get("http://localhost:8080/all").then( callback );
	}

	function getQuestions( id ){
		
	}
	return{
		addTest: function( Test ){
			return $http.post("http://localhost:8080/addTest",Test);
		},		// End addTest
		Tests : getTests,	// End Tests
		UpdateTest : function ( param ){
			return $http.post("http://localhost:8080/update",param);
		},		// End UpdateTest
		removeTest: function( id ){
			return $http.post("http://localhost:8080/delete",id).then(function(data){
				return data;
			});
		},		// End removeTest
		Questions: function(id){
			return $http.post("http://localhost:8080/one",id).then(function(data){			
				return data.data;
			});
		}
	}
});

/********************* New Test Factory ******************************************
******************************************************************************/
// Variable Declaration
var new_test_name = '';
var new_test_total_que = '';
var new_questions = [];
var flag = -1;
var upd_test_id = '';

app.factory("NewTestFactory", function($http){	
	// Function to set values
	function setTestName( testName ){
		new_test_name = testName;
	}

	function setTestQuestions( quesionList,total ){		
		new_questions = quesionList;
		new_test_total_que = total;
	}

	function setFlagStatus( status ){		
		flag = status;
	}

	function setUpdTestID( test_id ){
		upd_test_id = test_id;
	}

	// functions to get values 
	function getTestName(){
		return new_test_name;
	}

	function getTestQuestions(){
		var result = {
			"questions" : new_questions,
			"total_que" : new_test_total_que
		}
		return result;
	}

	function getFlagStatus(){
		return flag;
	}

	function getUpdTestID(){
		return upd_test_id;
	}

	function addNewTest( testData ){		
		var url = '';
		if(flag == 0){
			url = "http://localhost:8080/add";
		}else if(flag == 1){
			url = "http://localhost:8080/update";
			testData._id = upd_test_id;
		}		
		return $http.post(url,testData).then(function(data){
			return data;
		});
	}

	function deleteQuestion( test_id,que_id ){
		var param = {
			"_id" : test_id,
			"index" : que_id-1
		}
		$http.post("http://localhost:8080/delete_question",param).then(function(data){
			console.log(data);
		})
	}
	return{
		setName : setTestName,
		getName : getTestName,
		setQuestions : setTestQuestions,
		getQuestions : getTestQuestions,
		setFlag : setFlagStatus,
		getFlag : getFlagStatus,
		setTestID : setUpdTestID,
		getTestID : getUpdTestID,
		addTest : addNewTest,
		removeQuestion : deleteQuestion
	};
});