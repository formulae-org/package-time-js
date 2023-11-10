/*
Fōrmulæ time package. Common definitions.
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

export class Common {};

Common.monthTags = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
Common.mapMonthTags = {
	"January"   :  1,
	"February"  :  2,
	"March"     :  3,
	"April"     :  4,
	"May"       :  5,
	"June"      :  6,
	"July"      :  7,
	"August"    :  8,
	"September" :  9,
	"October"   : 10,
	"November"  : 11,
	"December"  : 12
};

Common.weekDayTags  = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
Common.mapWeekDayTags = {
	"Sun": 0,
	"Mon": 1,
	"Tue": 2,
	"Wed": 3,
	"Thu": 4,
	"Fri": 5,
	"Sat": 6
};

Common.createMillis = (year, month, day, hour, minute, second, millisecond, timeZone) => {
	if (year == 0) {
		throw "There was no zero year";
	}
	
	if (year < 0) {
		++year;
	}
	
	let originalYear = year < 1500 ? year : null;
	if (originalYear != null) year = 1500;
	
	let date = new Date();
	date.setUTCFullYear(year);
	date.setUTCMonth(month - 1);
	date.setUTCDate(day);
	date.setUTCHours(hour);
	date.setUTCMinutes(minute);
	date.setUTCSeconds(second);
	date.setUTCMilliseconds(millisecond);
	date.setUTCFullYear(year);
	
	let utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
	let tzDate;
	try {
		tzDate  = new Date(date.toLocaleString("en-US", { timeZone: timeZone }));
	}
	catch (error) {
		throw "Invalid time zone";
	}
	
	let offset  = utcDate.getTime() - tzDate.getTime();
	
	if (originalYear !== null) {
		date = new Date(date.setUTCFullYear(originalYear));
	}
	
	return date.getTime() + offset;
};

Common.getComponents = (millis, timeZone) => {
	let str;
	
	try {
		str = new Date(millis).toLocaleString(
			"en-US",
			{
				era:                    "short",
				weekday:                "short",
				year:                   "numeric",
				month:                  "2-digit",
				day:                    "2-digit",
				hour:                   "2-digit",
				hour12:                  false,
				minute:                 "2-digit",
				second:                 "2-digit",
				fractionalSecondDigits:  3,
				timeZone:                timeZone,
				timeZoneName:           "longOffset"
			}
		);
	}
	catch (error) {
		throw "Invalid time zone";
	}
	
	// console.log(str);
	// example 'Tue, 09 26, 2023 AD, 24:35:14.517 GMT-06:00'
	
	let tokens = str.split(/[ ,:.]+/);
	
	let year = Number(tokens[3]);
	if (tokens[4] === "BC") year = -year;
	
	let offset = 0;
	if (tokens.length >= 11) {
		offset = 60 * Number(tokens[9].substring(4)) + Number(tokens[10]);
		if (tokens[9].charAt(3) === "-") offset = -offset;
	}
	
	return {
		year:        year,
		month:       Number(tokens[1]),
		day:         Number(tokens[2]),
		weekDay:     Common.mapWeekDayTags[tokens[0]],
		hour:        Number(tokens[5]) % 24,
		minute:      Number(tokens[6]),
		second:      Number(tokens[7]),
		millisecond: Number(tokens[8]),
		offset:      offset
	};
};

Common.inDaylightSavingTime = (millis, timeZone) => {
	let components = Common.getComponents(millis, timeZone);
	
	let januaryComponents = Common.getComponents(
		Common.createMillis(components.year, 1, 1, 0, 0, 0, 0, timeZone, 0),
		timeZone
	);
	let juneComponents = Common.getComponents(
		Common.createMillis(components.year, 7, 1, 0, 0, 0, 0, timeZone, 0),
		timeZone
	);
	
	return  Math.min(januaryComponents.offset, juneComponents.offset) !== components.offset;
};
