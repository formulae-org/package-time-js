/*
Fōrmulæ time package. Module for edition.
Copyright (C) 2015-2023 Laurence R. Ugalde

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

'use strict';

export class Time extends Formulae.Package {}

Time.timeExpression = null;

Time.prepareTimeForm = function() {
	if (Time.timeForm === undefined) {
		let table2, tr, tr2, td, td2, control, option, ok;
		
		let table = document.createElement("table");
		table.classList.add("bordered");
		
		// header
		
		table.appendChild(tr = document.createElement("tr"));
		tr.appendChild(td = document.createElement("th")); td.colSpan = 2; td.textContent = "Create time";
		
		// timezone
		
		table.appendChild(tr = document.createElement("tr"));
		tr.appendChild(td = document.createElement("td")); td.textContent = Time.messages.labelTimeZone;
		td = document.createElement("td");
		
		tr.appendChild(td = document.createElement("td"));
		td.appendChild(control = document.createElement("select")); control.size = 1; control.id = "tz";
		for (const code in Formulae.timeZones) {
			option = document.createElement("option");
			option.appendChild(document.createTextNode(Formulae.getTimeZoneName(code)));
			option.value = code;
			control.appendChild(option);
		}
		control.value = Formulae.timeZone;
		
		// date
		
		table.appendChild(tr = document.createElement("tr"));
		tr.appendChild(td = document.createElement("td")); td.textContent = Time.messages.labelDate;
		td = document.createElement("td"); tr.appendChild(td);
		
		table2 = document.createElement("table"); table2.style.textAlign = "center";
		table2.appendChild(tr2 = document.createElement("tr"));
		tr2.appendChild(td2 = document.createElement("td")); td2.textContent = Time.messages.labelYear;
		tr2.appendChild(td2 = document.createElement("td")); td2.textContent = Time.messages.labelMonth;
		tr2.appendChild(td2 = document.createElement("td")); td2.textContent = Time.messages.labelDay;
		
		table2.appendChild(tr2 = document.createElement("tr"));
		tr2.appendChild(td2 = document.createElement("td"));
		control = document.createElement("input"); control.type="text"; control.size = 4; control.id = "yy"; td2.appendChild(control);
		
		tr2.appendChild(td2 = document.createElement("td"));
		td2.appendChild(control = document.createElement("select")); control.size = 1; control.id = "mo";
		for (let i = 0, n = FormulaeTime.monthTags.length; i < n; ++i) {
			option = document.createElement("option");
			option.appendChild(document.createTextNode(Time.messages.labelsMonth[i]));
			control.appendChild(option);
		}
		
		tr2.appendChild(td2 = document.createElement("td"));
		control = document.createElement("input"); control.type="text"; control.size = 2; control.id = "dd"; td2.appendChild(control);
		
		td.appendChild(table2);
		
		// time
		
		table.appendChild(tr = document.createElement("tr"));
		tr.appendChild(td = document.createElement("td")); td.textContent = Time.messages.labelTime;
		td = document.createElement("td"); tr.appendChild(td);
		
		table2 = document.createElement("table"); table2.style.textAlign = "center";
		table2.appendChild(tr2 = document.createElement("tr"));
		tr2.appendChild(td2 = document.createElement("td")); td2.textContent = Time.messages.labelHour;
		tr2.appendChild(td2 = document.createElement("td")); td2.textContent = Time.messages.labelMinute;
		tr2.appendChild(td2 = document.createElement("td")); td2.textContent = Time.messages.labelSecond;
		tr2.appendChild(td2 = document.createElement("td")); td2.textContent = Time.messages.labelMillisecond;
		
		table2.appendChild(tr2 = document.createElement("tr"));
		tr2.appendChild(td2 = document.createElement("td"));
		control = document.createElement("input"); control.type="text"; control.size = 2; control.id = "hh"; td2.appendChild(control);
		tr2.appendChild(td2 = document.createElement("td"));
		control = document.createElement("input"); control.type="text"; control.size = 2; control.id = "mi"; td2.appendChild(control);
		tr2.appendChild(td2 = document.createElement("td"));
		control = document.createElement("input"); control.type="text"; control.size = 2; control.id = "ss"; td2.appendChild(control);
		tr2.appendChild(td2 = document.createElement("td"));
		control = document.createElement("input"); control.type="text"; control.size = 3; control.id = "ms"; td2.appendChild(control);
		
		td.appendChild(table2);
		
		// offset
		
		table.appendChild(tr = document.createElement("tr"));
		tr.appendChild(td = document.createElement("td")); td.textContent = Time.messages.labelTime;
		td = document.createElement("td"); tr.appendChild(td);
		
		table2 = document.createElement("table"); table2.style.textAlign = "center";
		table2.appendChild(tr2 = document.createElement("tr"));
		tr2.appendChild(td2 = document.createElement("td")); td2.textContent = Time.messages.labelHour;
		tr2.appendChild(td2 = document.createElement("td")); td2.textContent = Time.messages.labelMinute;
		tr2.appendChild(td2 = document.createElement("td")); td2.textContent = Time.messages.labelSecond;
		tr2.appendChild(td2 = document.createElement("td")); td2.textContent = Time.messages.labelMillisecond;
		
		table2.appendChild(tr2 = document.createElement("tr"));
		tr2.appendChild(td2 = document.createElement("td"));
		control = document.createElement("input"); control.type="text"; control.size = 2; control.id = "os"; td2.appendChild(control);
		
		td.appendChild(table2);
		
		// footer
		
		tr = document.createElement("tr"); table.appendChild(tr);
		td = document.createElement("th"); td.colSpan = 2; tr.appendChild(td);
		ok = document.createElement("button"); ok.textContent = "Ok"; td.appendChild(ok);
		
		//////////////////////
		
		ok.addEventListener("click", () => {
			let time;
			try {
				time = FormulaeTime.createMillis(
					document.getElementById("yy").value,
					document.getElementById("mo").selectedIndex + 1,
					document.getElementById("dd").value,
					document.getElementById("hh").value,
					document.getElementById("mi").value,
					document.getElementById("ss").value,
					document.getElementById("ms").value,
					document.getElementById("tz").value,
					document.getElementById("os").value * 1000 * 60
				);
			}
			catch (error) {
				alert(error);
				return;
			}
			
			Formulae.modal.style.display = "none";
			
			let newExpression = Formulae.createExpression("Time.Time");
			newExpression.set("Value", time);
			
			Formulae.sExpression.replaceBy(newExpression);
			Formulae.sHandler.prepareDisplay();
			Formulae.sHandler.display();
			Formulae.setSelected(Formulae.sHandler, newExpression, false);
		});
		
		Time.timeForm = table;
	}
	
	Formulae.modalContent.removeChild(Formulae.modalContent.childNodes[0]);
	Formulae.modalContent.appendChild(Time.timeForm);
	
	let time = Time.timeExpression == null ?  new Date() : new Date(Time.timeExpression.get("Value"));
	let comp = FormulaeTime.getComponents(time.valueOf(), Formulae.timeZone);
	
	document.getElementById("yy").value = comp.year;
	document.getElementById("mo").selectedIndex = comp.month - 1;
	document.getElementById("dd").value = comp.day;
	document.getElementById("hh").value = comp.hour;
	document.getElementById("mi").value = comp.minute;
	document.getElementById("ss").value = comp.second;
	document.getElementById("ms").value = comp.millisecond;
	document.getElementById("os").value = new Date().getTimezoneOffset();
	
	//document.getElementById("yy").value = time.getFullYear();
	//document.getElementById("mo").selectedIndex = time.getMonth();
	//document.getElementById("dd").value = time.getDate();
	//document.getElementById("hh").value = time.getHours();
	//document.getElementById("mi").value = time.getMinutes();
	//document.getElementById("ss").value = time.getSeconds();
	//document.getElementById("ms").value = time.getMilliseconds();
	//document.getElementById("os").value = new Date().getTimezoneOffset();
	
	Formulae.modal.style.display = "block";
	Formulae.modal.focus();
}

Time.editionTime = function() {
	Time.timeExpression = null;
	Time.prepareTimeForm();
}

Time.actionTime = {
	isAvailableNow: () => Formulae.sHandler.type != Formulae.ROW_OUTPUT,
	getDescription: () => "Edit time...",
	doAction: () => {
		Time.timeExpression = Formulae.sExpression;
		Time.prepareTimeForm();
	}
}

Time.setEditions = function() {
	Formulae.addEdition(Time.messages.pathTime, null, Time.messages.leafTime, Time.editionTime);
	
	Formulae.addEdition(Time.messages.pathTime, null, Time.messages.leafGetCurrentTime,       () => Expression.replacingEdition("Time.GetCurrentTime"));
	Formulae.addEdition(Time.messages.pathTime, null, Time.messages.leafCreateTime,           () => Expression.multipleEdition ("Time.CreateTime", 3, 0));
	Formulae.addEdition(Time.messages.pathTime, null, Time.messages.leafCreateTimeInTimeZone, () => Expression.multipleEdition ("Time.CreateTimeInTimeZone", 4, 0));
	Formulae.addEdition(Time.messages.pathTime, null, Time.messages.leafTimer,                () => Expression.wrapperEdition  ("Time.Timer"));
	Formulae.addEdition(Time.messages.pathTime, null, Time.messages.leafToTime,               () => Expression.wrapperEdition  ("Time.ToTime"));
	
	for (let i = 0; i < 12; ++i) Formulae.addEdition(
		Time.messages.pathMonth, null, Time.messages.labelsMonth[i],
		() => Expression.replacingEdition("Time.Gregorian.Month." + FormulaeTime.monthTags[i])
	);
	
	{
		let offset = Time.messages.weekStartsAt;
		for (let i = 0; i < 7; ++i) Formulae.addEdition(
			Time.messages.pathWeekDay, null, Time.messages.labelsWeekDay[(i + offset) % 7],
			() => Expression.replacingEdition("Time.Gregorian.WeekDay." + FormulaeTime.weekDayTags[(i + offset) % 7])
		);
	}
	
	[
		"GetYear", "GetMonth",  "GetMonthNumber", "GetDay",         "GetWeekDay",
		"GetHour", "GetMinute", "GetSecond",      "GetMillisecond", "GetTimeZoneOffset", "InDaylightSavingTime"
	].forEach(tag => Formulae.addEdition(
		Time.messages.pathTimeGregorian, null, Time.messages["leaf" + tag],
		() => Expression.wrapperEdition("Time.Gregorian." + tag)
	));
	
	[ "MonthName", "WeekDayName", "FormatTime" ].forEach(tag => Formulae.addEdition(
		Time.messages.pathFormatTime, null, Time.messages["leaf" + tag],
		() => Expression.wrapperEdition("Localization.Format.Time.Gregorian." + tag)
	));
};

Time.setActions = function() {
	Formulae.addAction("Time.Time", Time.actionTime);
};
