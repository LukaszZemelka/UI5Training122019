/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(function () {
	"use strict";

	return function (oControl, sClassName) {
		function findUp(oControl) {
			if (oControl) {
				if (oControl.isA(sClassName)) {
					return oControl;
				} else {
					return findUp(oControl.getParent());
				}
			}
		}
		return findUp(oControl);
	};
});
