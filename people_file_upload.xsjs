var contentType;
var fileContent;

var connection;
var procedureCall;

function insertRow(row){	
	
	if (row === undefined) {
		return;
	}
	
	var params = row.split(',');

	var person_first_name = params[0].toString();
	var person_last_name = params[1].toString();
	var person_bio = params[2].toString();
	var person_born_date = params[3];
	var person_dependents = Number(params[4]);
	
	procedureCall.setNString(1,person_first_name);
	procedureCall.setNString(2,person_last_name);
	procedureCall.setNClob(3,person_bio);
	procedureCall.setDate(4,person_born_date,"DD.MM.YYYY");
	procedureCall.setInteger(5,person_dependents);
	
	procedureCall.execute();
}

function loadDataFromFile(file_content){
	var row_index;
	var file_rows = file_content.split('\n');
	
	connection = $.db.getConnection();
	procedureCall = connection.prepareCall('call "PAGOTI"."br.com.hanabrasil.FileUploaderToHanaDB::insertPerson"(?,?,?,?,?)');
	
	
	for (row_index = 1; row_index < file_rows.length; row_index++) { // jump header
		insertRow(file_rows[row_index]);
	}
	
	connection.commit();
	connection.close();
	
	$.response.setBody("File imported!!"); // assuming it's in the correct format! 
}



// Check Content type headers and parameters
function validateInput() {
	
	if ($.request.method !== $.net.http.POST) {
		$.response.status = $.net.http.NOT_ACCEPTABLE;
		$.response.setBody("Only POST is supported!!");
		return false;
	}
	
	var file_entity_index;
	
	// Get entity header which contains the file content
	for (file_entity_index = 0; file_entity_index < $.request.entities.length; file_entity_index++) {
		if ($.request.entities[file_entity_index].headers.get("~content_name") === "fup_data") {
			contentType = $.request.entities[file_entity_index].headers.get("content-type");
			if (contentType === 'text/csv') {
				$.response.status = $.net.http.ACCEPTED;
				fileContent = $.request.entities[0].body.asString();
				return true;
			}
		}
	}

	$.response.status = $.net.http.NOT_ACCEPTABLE;
	$.response.setBody("File is NOT a CSV!");
	return false;

}

// Request process 
function processRequest() {
	if (validateInput()) {
		loadDataFromFile(fileContent);
	}
}
// Call request processing  
processRequest();
