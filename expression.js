/*
Fōrmulæ time package. Module for expression definition & visualization.
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

Time.Time = class extends Expression.NullaryExpression {
	getTag() { return "Time.Time"; }

	getName() { return Time.messages.nameTime; }
	
	set(name, value) {
		if (name == "Value") {
			this.millis = value;
			
			try {
				this.timeAsString = this.format(this.millis);
			}
			catch (error) {
				console.log(error);
				this.timeAsString = "Invalid";
			}
		}
		else {
			super.set(name, value);
		}
	}
	
	format(millis) {
		//return new Intl.DateTimeFormat(
		//	Formulae.locale,
		//	{
		//		/*dateStyle: "full",*/ era: "short", year: "numeric", month: "long", day: "numeric",
		//		/*timeStyle: "full",*/ hour: "2-digit", /*hour12: false,*/ hourCycle: "h23",  minute: "2-digit", second: "2-digit", fractionalSecondDigits: 3,
		//		timeZone: Formulae.timeZone, timeZoneName: "long"
		//	}
		//).format(new Date(this.millis));
		
		let options = {
			timeZone: Formulae.timeZone,
			year: "numeric",
			month: "long",
			day: "numeric"
			//hour: "2-digit",
			//hourCycle: "h23",
			//minute: "2-digit",
		};
		
		let time = new Date(millis);
		
		// let yy = time.getFullYear();
		// let hh = time.getHours();
		// let mm = time.getMinutes();
		// let ss = time.getSeconds();
		// let ms = time.getMilliseconds();
		
		let components = Time.common.getComponents(millis, Formulae.timeZone);
		let yy = components.year;
		let hh = components.hour;
		let mm = components.minute;
		let ss = components.second;
		let ms = components.millisecond;
		
		let showingAll = false;
		
		if (showingAll || yy <= 0) options.era = "short";
		
		if (showingAll || hh + mm + ss + ms > 0) {
			options.hour = "2-digit";
			options.hourCycle = "h23";
			options.minute = "2-digit";
			
			if (showingAll || ss + ms > 0) {
				options.second = "2-digit";
			}
			
			if (showingAll || ms > 0) {
				options.fractionalSecondDigits = 3;
			}
		}
		
		if (showingAll || ss > 0 || ms > 0) {
			options.second = "2-digit";
			if (showingAll || ms > 0) options.fractionalSecondDigits = 3;
		}
		
		/*
		let januaryComponents = Time.common.getComponents(
			Time.common.createMillis(components.year, 1, 1, 0, 0, 0, 0, Formulae.timeZone),
			Formulae.timeZone
		);
		let juneComponents = Time.common.getComponents(
			Time.common.createMillis(components.year, 7, 1, 0, 0, 0, 0, Formulae.timeZone),
			Formulae.timeZone
		);
		let inDST = Math.min(januaryComponents.offset, juneComponents.offset) !== components.offset;
		*/
		
		let str = time.toLocaleString(Formulae.locale, options);
		//if (inDST) str += "☀️";
		if (Time.common.inDaylightSavingTime(time, Formulae.timeZone)) str += "☀";
		
		return str;
	}
	
	get(name) {
		if (name == "Value") {
			return this.millis;
		}
		
		super.get(name);
	}
	
	setSerializationStrings(strings, promises) {
		this.set("Value", parseInt(strings[0]));
	}
	
	getSerializationNames() {
		return [ "Value" ];
	}
	
	getSerializationStrings() {
		return [ this.millis ];
	}
	
	restart() {
		this.timeAsString = null;
	}
	
	prepareDisplay(context) {
		if (this.timeAsString == null) {
			try {
				this.timeAsString = this.format(this.millis);
			}
			catch (error) {
				this.timeAsString = "Invalid time zone";
			}
		}
	
		this.width = Math.ceil(context.measureText(this.timeAsString).width);
		this.height = context.fontInfo.size;
		this.vertBaseline = Math.round(this.width / 2);
		this.horzBaseline = Math.round(this.height / 2);
	}
	
	display(context, x, y) {
		let bkpFillStyle = context.fillStyle;
		let bkpStrokeStyle = context.strokeStyle;
		
		context.fillStyle = "#99FFFF";
		context.strokeStyle = "lightGray";
		
		context.fillRect(x, y, this.width, this.height);
		context.strokeRect(x, y, this.width, this.height);
		
		context.fillStyle = bkpFillStyle;
		context.strokeStyle = bkpStrokeStyle;
		
		super.drawText(context, this.timeAsString, x, y + this.height);
	}
};

Time.Month = class extends Expression.LabelExpression {
	getTag()   { return "Time.Gregorian.Month." + Time.common.monthTags[this.pos]; }
	getLabel() { return Time.messages.labelsMonth[this.pos]; }
	getName()  { return "The " + Time.messages.labelsMonth[this.pos] + " month"; }
};

Time.WeekDay = class extends Expression.LabelExpression {
	getTag()   { return "Time.Gregorian.WeekDay." + Time.common.weekDayTags[this.pos]; }
	getLabel() { return Time.messages.labelsWeekDay[this.pos]; }
	getName()  { return "The " + Time.messages.labelsWeekDay[this.pos] + " weekday"; }
};

Time.setExpressions = function(module) {
	Formulae.setExpression(module, "Time.Time", Time.Time);
	
	// get current time
	Formulae.setExpression(module, "Time.GetCurrentTime", {
		clazz:       Expression.Function,
		getTag:      () => "Time.GetCurrentTime",
		getMnemonic: () => Time.messages.mnemonicGetCurrentTime,
		getName:     () => Time.messages.nameGetCurrentTime,
		min: 0, max: 0
	});
	
	// create time
	Formulae.setExpression(module, "Time.CreateTime", {
		clazz:       Expression.Function,
		getTag:      () => "Time.CreateTime",
		getMnemonic: () => Time.messages.mnemonicCreateTime,
		getName:     () => Time.messages.nameCreateTime,
		getChildName: (index) => Time.messages.childrenCreateTime[index + 1],
		min: 3, max: 7
	});
	
	// create time in timezone
	Formulae.setExpression(module, "Time.CreateTimeInTimeZone", {
		clazz:       Expression.Function,
		getTag:      () => "Time.CreateTimeInTimeZone",
		getMnemonic: () => Time.messages.mnemonicCreateTimeInTimeZone,
		getName:     () => Time.messages.nameCreateTimeInTimeZone,
		getChildName: (index) => Time.messages.childrenCreateTime[index],
		min: 4, max: 8
	});
	
	// 1-parameter function
	[ "Timer", "ToTime" ].forEach(tag => Formulae.setExpression(module, "Time." + tag, {
		clazz:       Expression.Function,
		getTag:      () => "Time." + tag,
		getMnemonic: () => Time.messages["mnemonic" + tag],
		getName:     () => Time.messages["name" + tag]
	}));
	
	// gregorian functions
	for (let i = 0; i < 12; ++i) Formulae.setExpression(module, "Time.Gregorian.Month." +   Time.common.monthTags[i],    { clazz: Time.Month,    pos: i });
	for (let i = 0; i <  7; ++i) Formulae.setExpression(module, "Time.Gregorian.WeekDay." + Time.common.weekDayTags[i],  { clazz: Time.WeekDay,  pos: i });
	
	// time information function
	[
		"GetYear",   "GetMonth",  "GetMonthNumber", "GetDay",         "GetWeekDay",
		"GetHour",   "GetMinute", "GetSecond",      "GetMillisecond", "GetTimeZoneOffset", "InDaylightSavingTime"
	].forEach(tag => Formulae.setExpression(module, "Time.Gregorian." + tag, {
		clazz:       Expression.Function,
		getTag:      () => "Time.Gregorian." + tag,
		getMnemonic: () => Time.messages["mnemonic" + tag],
		getName:     () => Time.messages["name" + tag],
		min: 1, max: 2
	}));
	
	// format localized names
	[ "MonthName", "WeekDayName" ].forEach(tag => Formulae.setExpression(module, "Localization.Format.Time.Gregorian." + tag, {
		clazz:       Expression.Function,
		getTag:      () => "Localization.Format.Time.Gregorian." + tag,
		getMnemonic: () => Time.messages["mnemonic" + tag],
		getName:     () => Time.messages["name" + tag],
		min: 1, max: 2
	}));
	
	// format localized times
	[ "FormatTime" ].forEach(tag => Formulae.setExpression(module, "Localization.Format.Time.Gregorian." + tag, {
		clazz:       Expression.Function,
		getTag:      () => "Localization.Format.Time.Gregorian." + tag,
		getMnemonic: () => Time.messages["mnemonic" + tag],
		getName:     () => Time.messages["name" + tag],
		min: 1, max: 3
	}));
};
