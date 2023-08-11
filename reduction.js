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

Time.GetCurrentTime = async (getCurrentTime, session) => {
	let timeExpression = Formulae.createExpression("Time.Time");
	timeExpression.set("Value", Date.now());
	
	getCurrentTime.replaceBy(timeExpression);
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

Time.setReducers = () => {
	ReductionManager.addReducer("Time.GetCurrentTime", Time.GetCurrentTime);
	ReductionManager.addReducer("Relation.Compare",    Time.compare);
};
