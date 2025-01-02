/*
Fōrmulæ time package. Module for reduction.
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

Time.getCurrentTime = async (getCurrentTime, session) => {
	let timeExpression = Formulae.createExpression("Time.Time");
	timeExpression.set("Value", Date.now());
	
	getCurrentTime.replaceBy(timeExpression);
	return true;
};

Time.createTime = async (createTime, session) => {
	let year = CanonicalArithmetic.getNativeInteger(createTime.children[0]);
	if (year === undefined) { return false; }
	
	let month;
	{
		let tag = createTime.children[1].getTag();
		if (tag.startsWith("Time.Gregorian.Month.")) {
			month = Time.common.mapMonthTags[tag.substring(21)];
		}
		else {
			month = CanonicalArithmetic.getNativeInteger(createTime.children[1]);
		if (month === undefined) { return false; }
		}
	}
	
	let day = CanonicalArithmetic.getNativeInteger(createTime.children[2]);
	if (day === undefined) { return false; }
	
	let hour = 0;
	if (createTime.children.length >= 4) {
		hour = CanonicalArithmetic.getNativeInteger(createTime.children[3]);
		if (hour === undefined) { return false; }
	}
	
	let minute = 0;
	if (createTime.children.length >= 5) {
		minute = CanonicalArithmetic.getNativeInteger(createTime.children[4]);
		if (minute === undefined) { return false; }
	}
	
	let second = 0;
	if (createTime.children.length >= 6) {
		second = CanonicalArithmetic.getNativeInteger(createTime.children[5]);
		if (second === undefined) { return false; }
	}
	
	let milliSecond = 0;
	if (createTime.children.length >= 7) {
		milliSecond = CanonicalArithmetic.getNativeInteger(createTime.children[6]);
		if (milliSecond === undefined) { return false; }
	}
	
	let result = Formulae.createExpression("Time.Time");
	try {
		result.set("Value", Time.common.createMillis(year, month, day, hour, minute, second, milliSecond, Formulae.timeZone));
	}
	catch (error) {
		ReductionManager.setInError(createTime, error);
		throw new ReductionError();
	}
	
	createTime.replaceBy(result);
	return true;
};

Time.createTimeInTimeZone = async (createTime, session) => {
	let timeZone = createTime.children[0];
	if (timeZone.getTag() !== "String.String") return false;
	
	let year = CanonicalArithmetic.getNativeInteger(createTime.children[1]);
	if (year === undefined) { return false; }
	
	let month;
	{
		let tag = createTime.children[2].getTag();
		if (tag.startsWith("Time.Gregorian.Month.")) {
			month = Time.common.mapMonthTags[tag.substring(21)];
		}
		else {
			month = CanonicalArithmetic.getNativeInteger(createTime.children[2]);
		if (month === undefined) { return false; }
		}
	}
	
	let day = CanonicalArithmetic.getNativeInteger(createTime.children[3]);
	if (day === undefined) { return false; }
	
	let hour = 0;
	if (createTime.children.length >= 5) {
		hour = CanonicalArithmetic.getNativeInteger(createTime.children[4]);
		if (hour === undefined) { return false; }
	}
	
	let minute = 0;
	if (createTime.children.length >= 6) {
		minute = CanonicalArithmetic.getNativeInteger(createTime.children[5]);
		if (minute === undefined) { return false; }
	}
	
	let second = 0;
	if (createTime.children.length >= 7) {
		second = CanonicalArithmetic.getNativeInteger(createTime.children[6]);
		if (second === undefined) { return false; }
	}
	
	let milliSecond = 0;
	if (createTime.children.length >= 8) {
		milliSecond = CanonicalArithmetic.getNativeInteger(createTime.children[7]);
		if (milliSecond === undefined) { return false; }
	}
	
	let result = Formulae.createExpression("Time.Time");
	try {
		result.set("Value", Time.common.createMillis(year, month, day, hour, minute, second, milliSecond, timeZone.get("Value")));
	}
	catch (error) {
		ReductionManager.setInError(createTime, error);
		throw new ReductionError();
	}
	
	createTime.replaceBy(result);
	return true;
};

Time.compare = async (compare, session) => {
	let left = compare.children[0], right = compare.children[1];
	
	if (left.getTag() === "Time.Time" && right.getTag() === "Time.Time") {
		let result = left.get("Value") - right.get("Value");
		
		compare.replaceBy(
			Formulae.createExpression(
				result == 0 ?
				"Relation.Comparison.Equals" :
				(
					result < 0 ?
					"Relation.Comparison.Less" :
					"Relation.Comparison.Greater"
				)
			)
		);
		return true;
	}
};

Time.addition = async (offset, session) => {
	if (offset.children.length !== 2) return false;
	
	if (offset.children[1].getTag() !== "Time.Time") return false;
	let o = CanonicalArithmetic.getInteger(offset.children[0]);
	if (o === undefined) return false;
	
	let result = Formulae.createExpression("Time.Time");
	result.set("Value", offset.children[1].get("Value") + o);
	
	offset.replaceBy(result);
	return true;
};

Time.getComponent = async (getComponent, session) => {
	let timeExpression = getComponent.children[0];
	if (timeExpression.getTag() !== "Time.Time") return false;
	
	let timeZone = Formulae.timeZone;
	if (getComponent.children.length >= 2) {
		let str = getComponent.children[1];
		if (str.getTag() !== "String.String") return false;
		timeZone = str.get("Value");
	}
	
	let millis = timeExpression.get("Value");
	let components = Time.common.getComponents(millis, timeZone);
	let result;
	
	switch (getComponent.getTag()) {
		case "Time.Gregorian.GetYear":
			result = CanonicalArithmetic.createInternalNumber(
				CanonicalArithmetic.createInteger(components.year, session)
			);
			break;
		
		case "Time.Gregorian.GetMonth":
			result = Formulae.createExpression("Time.Gregorian.Month." + Time.common.monthTags[components.month - 1]);
			break;
		
		case "Time.Gregorian.GetMonthNumber":
			result = CanonicalArithmetic.createInternalNumber(
				CanonicalArithmetic.createInteger(components.month, session)
			) 
			break;
		
		case "Time.Gregorian.GetDay":
			result = CanonicalArithmetic.createInternalNumber(
				CanonicalArithmetic.createInteger(components.day, session)
			);
			break;
		
		case "Time.Gregorian.GetWeekDay":
			result = Formulae.createExpression("Time.Gregorian.WeekDay." + Time.common.weekDayTags[components.weekDay]);
			break;
			
		case "Time.Gregorian.GetHour":
			result = CanonicalArithmetic.createInternalNumber(
				CanonicalArithmetic.createInteger(components.hour, session)
			);
			break;
			
		case "Time.Gregorian.GetMinute":
			result = CanonicalArithmetic.createInternalNumber(
				CanonicalArithmetic.createInteger(components.minute, session)
			);
			break;
		
		case "Time.Gregorian.GetSecond":
			result = CanonicalArithmetic.createInternalNumber(
				CanonicalArithmetic.createInteger(components.second, session)
			);
			break;
		
		case "Time.Gregorian.GetMillisecond":
			result = CanonicalArithmetic.createInternalNumber(
				CanonicalArithmetic.createInteger(components.millisecond, session)
			);
			break;
			
		case "Time.Gregorian.GetTimeZoneOffset":
			result = CanonicalArithmetic.createInternalNumber(
				CanonicalArithmetic.createInteger(components.offset, session)
			);
			break;
		
		case "Time.Gregorian.InDaylightSavingTime":
			result = Formulae.createExpression(
				Time.common.inDaylightSavingTime(millis, timeZone) ?
				"Logic.True" :
				"Logic.False"
			);
			break;
	}
	
	getComponent.replaceBy(result);
	return true;
};

Time.FormatOptions = class extends CanonicalOptions {
	constructor() {
		super();
		this.locale    = Formulae.locale;
		this.timeZone  = Formulae.timeZone;
		this.dateStyle = "full";
		this.timeStyle = "full";
	}
	
	checkOption(expression, option) {
		let name = option.children[0].get("Value").toLowerCase();
		let value = option.children[1];
		
		switch (name) {
			case "locale": {
				if (value.getTag() !== "String.String") {
					ReductionManager.setInError(value, "Value must be a string");
					return false;
				}
				
				this.locale = value.get("Value");
				return true;
			}
			
			case "time zone": {
				if (value.getTag() !== "String.String") {
					ReductionManager.setInError(value, "Value must be a string");
					return false;
				}
				
				this.timeZone = value.get("Value");
				return true;
			}
			
			case "date style": {
				if (value.getTag() !== "String.String") {
					ReductionManager.setInError(value, "Value is not a string");
					return false;
				}
				
				let s = value.get("Value").toLowerCase();
				
				switch (s) {
					case "none":
					case "short":
					case "medium":
					case "long":
					case "full":
						this.dateStyle = s;
						return true;
					
					default:
						ReductionManager.setInError(value, "Invalid option");
						return false;
				}
			}
			
			case "time style": {
				if (value.getTag() !== "String.String") {
					ReductionManager.setInError(value, "Value is not a string");
					return false;
				}
				
				let s = value.get("Value").toLowerCase();
				
				switch (s) {
					case "none":
					case "short":
					case "medium":
					case "long":
					case "full":
						this.timeStyle = s;
						return true;
					
					default:
						ReductionManager.setInError(value, "Invalid option");
						return false;
				}
			}
		}
		
		ReductionManager.setInError(option.children[0], "Unknown option");
		return false;
	}
}

Time.formatTime = async (formatTime, session) => {
	let timeExpression = formatTime.children[0];
	if (timeExpression.getTag() !== "Time.Time") return false;
	
	let optionsExpr = formatTime.children[1];
	let formatOptions = new Time.FormatOptions();
	
	formatOptions.checkOptions(formatTime, optionsExpr);
	
	let options = {	timeZone: formatOptions.timeZone };
	if (formatOptions.dateStyle !== "none") options.dateStyle = formatOptions.dateStyle;
	if (formatOptions.timeStyle !== "none") options.timeStyle = formatOptions.timeStyle;
	
	let result = Formulae.createExpression("String.String");
	try {
		result.set("Value", new Date(timeExpression.get("Value")).toLocaleString(formatOptions.locale, options));
	}
	catch (error) {
		ReductionManager.setInError(formatTime, error);
		throw new ReductionError();
	}
	
	if (formatOptions.dateStyle === "none" && formatOptions.timeStyle === "none") {
		result.set("Value", "");
	}
	
	formatTime.replaceBy(result);
	return true;
};

Time.toNumber = async (toNumber, session) => {
	if (toNumber.children[0].getTag() !== "Time.Time") return false;
	if (toNumber.children.lengh > 1) return false;
	
	toNumber.replaceBy(
		CanonicalArithmetic.createInternalNumber(
			CanonicalArithmetic.createInteger(toNumber.children[0].get("Value"), session)
		)
	);
	
	return true;
};

/*
Time.toTime = async (toTime, session) => {
	CanonicalArithmetic.getInteger(createTime.children[4]);
	if (millis === undefined) return false;
	
	let result = Formulae.createExpression("Time.Time");
	result.set("Value", millis);
	
	toTime.replaceBy(result);
	return true;
};
*/

Time.timer = async (timer, session) => {
	let start = Date.now();
	await session.reduce(timer.children[0]);
	let end = Date.now();
	
	let result = Formulae.createExpression("List.List");
	result.addChild(
		CanonicalArithmetic.createInternalNumber(
			CanonicalArithmetic.createInteger(end - start, session)
		)
	);
	result.addChild(timer.children[0]);
	
	timer.replaceBy(result);
	return true;
};

Time.setReducers = () => {
	ReductionManager.addReducer("Time.GetCurrentTime", Time.getCurrentTime, "Time.getCurrentTime");
	
	ReductionManager.addReducer("Time.CreateTime",           Time.createTime,           "Time.createTime");
	ReductionManager.addReducer("Time.CreateTimeInTimeZone", Time.createTimeInTimeZone, "Time.createTimeInTimeZone");
	
	ReductionManager.addReducer("Relation.Compare", Time.compare, "Time.compare");
	
	ReductionManager.addReducer("Math.Arithmetic.Addition", Time.addition, "Time.addition");
	
	ReductionManager.addReducer("Time.Gregorian.GetYear",              Time.getComponent, "Time.getComponent");
	ReductionManager.addReducer("Time.Gregorian.GetMonth",             Time.getComponent, "Time.getComponent");
	ReductionManager.addReducer("Time.Gregorian.GetMonthNumber",       Time.getComponent, "Time.getComponent");
	ReductionManager.addReducer("Time.Gregorian.GetDay",               Time.getComponent, "Time.getComponent");
	ReductionManager.addReducer("Time.Gregorian.GetWeekDay",           Time.getComponent, "Time.getComponent");
	ReductionManager.addReducer("Time.Gregorian.GetHour",              Time.getComponent, "Time.getComponent");
	ReductionManager.addReducer("Time.Gregorian.GetMinute",            Time.getComponent, "Time.getComponent");
	ReductionManager.addReducer("Time.Gregorian.GetSecond",            Time.getComponent, "Time.getComponent");
	ReductionManager.addReducer("Time.Gregorian.GetMillisecond",       Time.getComponent, "Time.getComponent");
	ReductionManager.addReducer("Time.Gregorian.GetTimeZoneOffset",    Time.getComponent, "Time.getComponent");
	ReductionManager.addReducer("Time.Gregorian.InDaylightSavingTime", Time.getComponent, "Time.getComponent");
	
	ReductionManager.addReducer("Localization.Format.Time.Gregorian.FormatTime", Time.formatTime, "Time.formatTime");
	
	ReductionManager.addReducer("Math.Arithmetic.ToNumber", Time.toNumber, "Time.toNumber");
	//ReductionManager.addReducer("Time.ToTime",              Time.toTime, "Time.toTime");
	
	ReductionManager.addReducer("Time.Timer", Time.timer, "Time.timer", { special: true });
};
