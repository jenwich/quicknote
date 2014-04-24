
var category_list;
var myStr = {
	month_short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	month_full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	day_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	day_full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

$(function() {
	readCategory();
	input.start();
	select.start();
});

function readCategory() {
	$.ajax({
		type: "POST",
		url: "get_category",
		success: function(data) {
			category_list = eval(data);
			select.setCategoryDropdown();
			$("#input-category").autocomplete({
				source: category_list,
			});
		}
	});
}

//INPUT
(function() {
	
	//INPUT OBJECT
	var input = {
		start: function() {
			setObjProp();
			setObjEvent();
		},
		resetForm: function() {
			resetForm();
		},
	};

	//INPUT: DATA OBJECT
	var data = {
		type: "create",
		id: 0,
		note: "",
		date: "",
		time: "",
		category: "",
		isHighlight: false,
	};
	
	//INPUT: SET OBJECT PROPERTIES
	var setObjProp = function() {
		$("#input-type-set").buttonset();
		$("#input-edit-id,#input-delete").hide();
		$("#input-date").datepicker({
			changeMonth: true,
			changeYear: true,
			dateFormat: "dd-mm-yy",
		});
		//$("#input-ishighlight").button();
		$("#input-send").button();
		$("#input-delete").button();
	};
	
	//INPUT: SET OBJECT EVENT
	var setObjEvent = function() {
		$(".input-type-radio").change(function() {
			if($("#input-type-create").prop("checked")) {
				data.type = "create";
				resetForm();
				$("#input-edit-id,#input-delete").hide();
			} else if($("#input-type-edit").prop("checked")) {
				data.type = "edit";
				$("#input-edit-id,#input-delete").show();
			}
		});
		$("#input-type-create").click(function() {
			resetForm();
		});
		$("#input-send").click(function() {
			send();
		});
		$("#input-delete").click(function() {
			var id = eval($("#input-edit-id").val());
			$.ajax({
				type: "POST",
				url: "delete_note.php",
				data: {
					"id": id
				},
				success: function(data_c) {
					if(data_c == "success") $("#input-status").html("Delete ["+ id +"] Success");
					else $("#input-status").html("Error");
					setTimeout(function() {
						$("#input-status").empty();
					}, 2000);
				}
			});
		});
	};
	
	//INPUT: SEND DATA
	var send = function() {
		data.id = eval($("#input-edit-id").val());
		data.note = $("#input-note").val();
		
		var str = $("#input-date").val();
		var arr = str.split("-");
		if(str != "") data.date = arr[2] +"-"+ arr[1] +"-"+ arr[0];
		else data.date = "";
		
		data.time = $("#input-time").val().replace(/[.]/g, ":");
		var colon = data.time.match(/[:]/g);
		if(!data.time || colon == null) data.time = "";
		else if(colon.length == 1) data.time += ":00";
		
		data.category = $("#input-category").val();
		data.isHighlight = $("#input-ishighlight").prop("checked");
		
		$.ajax({
			type: "POST",
			url: "send_note.php",
			data: data,
			success: function(data_c) {
				if(data_c == "success") {
					if(data.type == "create") $("#input-status").html("Create Note Success");
					else if(data.type == "edit") $("#input-status").html("Edit ["+ data.id +"] Success");				
				} else {
					$("#input-status").html("Error");
				}
				setTimeout(function() {
					$("#input-status").empty();
				}, 2000);
			}
		});
	};
	
	//INPUT: RESET INPUT FORM
	var resetForm = function() {
		$("#input-edit-id").val("");
		$("#input-note").val("");
		$("#input-date").val("");
		$("#input-time").val("");
		$("#input-category").val("");
		$("#input-ishighlight").prop("checked", "");
	};
	
	window.input = input;
})();

//SELECT
(function() {
	
	//SELECT OBJECT
	var select = {
		//ON START
		start: function() {
			createHighlightDropdown();
			setObjProp();
			setObjEvent();
			changeType("recent");
			setDate();
			send();
		},
		
		//SET CATEGORY DROPDOWN-MENU
		setCategoryDropdown: function() {
			createCategoryDropdown();
		},
	};
	
	window.select = select;
	
	//SELECT: DATA OBJECT
	var data = {
		type: "recent",
		day: 0,
		month: 0,
		year: 0,
		hl_month: new Date().getMonth()+1,
		hl_year: new Date().getFullYear(),
		amount: 0,
		category: "",
	};
	
	//SELECT: DATE OBJECT
	var date = new Date();

	//SELECT: SET OBJECT PROPERTIES
	var setObjProp = function() {
		$("#select-type-set").buttonset();
		$("#select-recent-catechk").button();
		$("#select-recent-catedropdown").prop("disabled", "disabled");
		$("#select-date-datepicker").datepicker({
			changeMonth: true,
			changeYear: true,
			dateFormat: "dd-mm-yy",
		});
		$("#select-date-nav-set").buttonset();
		$("#select-date-prev").button({
			icons: {
				primary: "ui-icon-triangle-1-w"
			}
		});
		$("#select-date-next").button({
			icons: {
				primary: "",
				secondary: "ui-icon-triangle-1-e",
			}
		});
		$("#select-date-today").button();
		$("#select-hl-nav-set").buttonset();
		$("#select-hl-prev").button({
			icons: {
				primary: "ui-icon-triangle-1-w"
			}
		});
		$("#select-hl-next").button({
			icons: {
				primary: "",
				secondary: "ui-icon-triangle-1-e",
			}
		});
		$("#select-hl-thismonth").button();
	};
	
	//SELECT: SET OBJECT EVENT
	var setObjEvent = function() {
		$(".select-type-radio").click(function() {
			if($("#select-type-recent").prop("checked")) changeType("recent");
			else if($("#select-type-date").prop("checked")) changeType("date");
			else if($("#select-type-highlight").prop("checked")) changeType("highlight");
			send();
		});
		$("#select-recent-amount").change(function() {
			var value = eval($(this).val());
			if(value == null) value = 0;
			data.amount = value;
			send();
		});
		$("#select-recent-catechk").change(function() {
			if($("#select-recent-catechk").prop("checked")) {
				$("#select-recent-catedropdown").prop("disabled", "");
				setCategory(true);
			} else {
				$("#select-recent-catedropdown").prop("disabled", "disabled");
				setCategory(false);
			}
		});
		$("#select-recent-catedropdown").change(function() {
			setCategory(true);
		});
		$("#select-date-datepicker").change(function() {
			var arr = $(this).val().split("-");
			date = new Date(eval(arr[2]), eval(arr[1])-1, eval(arr[0]));
			setDate();
			send();
		});
		$("#select-date-prev").click(function() {
			date.setTime(date.getTime() - 86400000);
			setDate();
			send();
		});
		$("#select-date-next").click(function() {
			date.setTime(date.getTime() + 86400000);
			setDate();
			send();
		});
		$("#select-date-today").click(function() {
			date = new Date();
			setDate();
			send();
		});
		$("#select-hl-prev").click(function() {
			data.hl_month--;
			setHighlightMonth();
			send();
		});
		$("#select-hl-next").click(function() {
			data.hl_month++;
			setHighlightMonth();
			send();
		});
		$("#select-hl-thismonth").click(function() {
			data.hl_month = new Date().getMonth()+1;
			data.hl_year = new Date().getFullYear();
			setHighlightMonth();
			send();
		});
	};
	
	//SELECT: CREATE CATEGORY DROPDOWN-MENU
	var createCategoryDropdown = function() {
		var obj = $("#select-recent-catedropdown");
		for(var i in category_list) 
			obj.append("<option value='"+ category_list[i] +"'>"+ category_list[i] +"</option>");
	};
	
	//SELECT: CREATE MONTH DROPDOWN-MENU
	var createHighlightDropdown = function() {
		var month_obj = $("#select-hl-month");
		var year_obj = $("#select-hl-year");
		var thismonth = data.hl_month;
		var thisyear = data.hl_year;
		for(var i = 1; i <= 12; ++i) {
			var opt_obj = $("<option value='"+ i +"'>"+ myStr.month_full[i-1] +"</option>");
			if(i == thismonth) opt_obj.prop("selected", "selected");
			month_obj.append(opt_obj);
		}
		for(var i = thisyear-10; i <= thisyear+10; ++i) {
			var opt_obj = $("<option value='"+ i +"'>"+ i +"</option>");
			if(i == thisyear) opt_obj.prop("selected", "selected");
			year_obj.append(opt_obj);
		}
	};
	
	//SELECT: CHANGE SELECT TYPE
	var changeType = function(type) {
		data.type = type;
		$(".select-option").hide();
		$("#select-option-"+ type).show();
	};
	
	//SELECT: SET CATEGORY DATA ON data
	var setCategory = function(isEnabled) {
		if(isEnabled) data.category = $("#select-recent-catedropdown").val();
		else data.category = "";
		send();
	};
	
	//SELECT: SET DATE DATA ON data & SET DATEPICKER VALUE
	var setDate = function() {
		var day = date.getDate(), month = date.getMonth()+1, year = date.getFullYear();
		$("#select-date-datepicker").val(((day<10)?"0"+day:day)+"-"+((month<10)?"0"+month:month)+"-"+year);
		data.day = day;
		data.month = month;
		data.year = year;
	};
	
	
	//SELECT: SET HIGHLIGHT DATA ON data & SET DROPDOWN VALUE
	var setHighlightMonth = function() {
		if(data.hl_month < 1) {
			data.hl_month = 12;
			data.hl_year--;
		}
		if(data.hl_month > 12) {
			data.hl_month = 1;
			data.hl_year++;
		}
		$("#select-hl-month option[value='"+ data.hl_month +"']").prop("selected", "selected");
		$("#select-hl-year option[value='"+ data.hl_year +"']").prop("selected", "selected");
	};
	
	//SELECT: SEND DATA
	var send = function() {
		$.ajax({
			type: "POST",
			url: "get_note.php",
			data: data,
			success: function(data_c) {
				showNotes(data, eval(data_c));
			},
		});
	};
})();

function splitDate(date) {
	var arr = date.split(" ");
	var date = arr[0].split("-");
	var time = arr[1].split(":");
	return {
		date: arr[0],
		time: arr[1],
		day: date[2],
		month: date[1],
		year: date[0],
		hour: time[0],
		min: time[1],
		sec: time[2]
	};
}

function showNotes(info, data) {
	var title = "";
	info.dayinweek = new Date(info.year, info.month-1, info.day).getDay();
	if(info.type == "recent") {
		if(info.amount == 0) title = "Recent all notes";
		else title = "Recent "+ info.amount +" notes";
		if(info.category != "") title += " Category: "+ info.category;
	} else if(info.type == "date") {
		title = "Notes from "+ myStr.day_short[info.dayinweek] +", "+ info.day +" "+ myStr.month_short[info.month-1] +" "+ info.year;
	} else if(info.type == "highlight") {
		title = "Highlight notes from "+ myStr.month_short[info.hl_month-1] +" "+ info.hl_year;
	}
	$("#show-title").html(title);
	var show_obj = $("#show-note");
	show_obj.empty();
	if(info.type == "recent") {
		for(var i in data) {
			var note_obj = $("<div class='show-note' title='"+ data[i].datetime +"' index='"+ i +"'></div>");
			note_obj.append("<p class='note-para'>"+ data[i].note +"</p>");
			if(data[i].category != "" && info.category == "") note_obj.find(".note-para").prepend("<span class='note-category'>["+ data[i].category +"]</span> ");
			var d = splitDate(data[i].datetime);
			note_obj.append("<p class='date-para'>"+ d.day +" "+ myStr.month_short[eval(d.month)-1] +" "+ d.year +" "+ d.time +"</p>");
			show_obj.append(note_obj);
		}
	} else if(info.type == "date") {
		for(var i in data) {
			if(data[i].isHighlight) {
				var note_obj = $("<div class='show-note show-note-date' title='"+ data[i].datetime +"' index='"+ i +"'></div>");
				note_obj.append("<p class='note-para'><span class='note-highlight'>"+ data[i].note +"</span></p>");
				show_obj.append(note_obj);
			}
		}
		for(var i in data) {
			if(!data[i].isHighlight) {
				var note_obj = $("<div class='show-note show-note-date' title='"+ data[i].datetime +"' index='"+ i +"'></div>");
				var d = splitDate(data[i].datetime);
				var cate_str = "";
				if(data[i].category != "") cate_str = "<span class='note-category'>["+ data[i].category +"]</span>";
				note_obj.append("<p class='note-para'><span class='note-time'>"+ d.hour +":"+ d.min +"</span> "+ cate_str +" "+ data[i].note +"</p>");
				show_obj.append(note_obj);			
			}
		}
	} else if(info.type == "highlight") {
		for(var i in data) {
			var note_obj = $("<div class='show-note show-note-date' title='"+ data[i].datetime +"' index='"+ i +"'></div>");
			var d = splitDate(data[i].datetime);
			note_obj.append("<span class='note-date'>"+ d.day +" "+ myStr.month_short[eval(d.month)-1] +" "+ d.year +"</span> <span class='note-highlight'>"+ data[i].note +"</span>");
			show_obj.append(note_obj);
		}
	}
	/*
	show_obj.find(".show-note").tooltip({
		track: true,
		content: function() {
			var d = splitDate($(this).attr("title"));
			return d.day +" "+ myStr.month_short[eval(d.month)-1] +" "+ d.year +" "+ d.time;
		}
	});	
	*/
	show_obj.find(".show-note").click(function() {
		var index = eval($(this).attr("index"));
		$("#input-type-edit").click();
		$("#input-edit-id").val(data[index].id);
		$("#input-note").val(data[index].note);
		var d = splitDate(data[index].datetime);
		$("#input-date").val(d.day +"-"+ d.month +"-"+ d.year);
		$("#input-time").val(d.time.replace(/[:]/g,"."));
		$("#input-category").val(data[index].category);
		//alert(data[index].isHighlight);
		if(data[index].isHighlight) $("#input-ishighlight").prop("checked", "checked");
		else $("#input-ishighlight").prop("checked", "");
	});
}


