sap.ui.jsview("fileuploadertohanadbui.main", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fileuploadertohanadbui.main
	*/ 
	getControllerName : function() {
		return "fileuploadertohanadbui.main";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf fileuploadertohanadbui.main
	*/ 
	createContent : function(oController) {

		var layout = new sap.ui.commons.layout.HorizontalLayout();

		var fup_data = new sap.ui.commons.FileUploader("fup_data", {
			name : "fup_data",
			uploadUrl: "../../../people_file_upload.xsjs", // WebContent << Project Root << ui
			change : oController.onFileChanged,
			uploadComplete : oController.onUploadComplete,
		});

		layout.addContent(fup_data);

		layout.addContent(new sap.ui.commons.Button("but_upload", {
			text : "Upload",
			tooltip : "Upload data",
			press : function() {
				fup_data.upload();
			}
		}));
		
		layout.addContent(new sap.ui.commons.TextView("txv_response",{
			text: "Server response",
			design: sap.ui.commons.TextViewDesign.Bold
		}));

		return layout;
	}

});
