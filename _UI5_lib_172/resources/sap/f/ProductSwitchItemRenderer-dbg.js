/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([],
	function () {
		"use strict";
		var ProductSwitchItemRenderer = {
			apiVersion: 2
		};

		ProductSwitchItemRenderer.render = function (oRm, oControl) {
				oRm.openStart("div", oControl);
				oRm.class("sapFPSItemContainer");
				oRm.attr("tabindex", 0);

				oRm.openEnd();
					oRm.openStart("span");
					oRm.class("sapFPSItemIconPlaceholder");
					oRm.class("sapUiTinyMarginBottom");
					oRm.openEnd();
						if (oControl.getSrc()) {
							oRm.renderControl(oControl._getIcon());
						}
					oRm.close("span");
					oRm.openStart("div");
					oRm.class("sapFPSItemTextSection");
					oRm.openEnd();
						if (oControl.getTitle()) {
							oRm.renderControl(oControl._getTitle());
						}

						if (oControl.getSubTitle()) {
							oRm.openStart("div");
							oRm.class("sapFPSItemSubTitle");
							oRm.class("sapFPSItemTitle");
							oRm.openEnd();
								oRm.text(oControl.getSubTitle());
							oRm.close("div");
						}
					oRm.close("div");
				oRm.close("div");
		};

		return ProductSwitchItemRenderer;

	}, /* bExport= */ true);