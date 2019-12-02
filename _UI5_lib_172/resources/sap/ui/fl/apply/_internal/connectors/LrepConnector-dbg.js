/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/base/util/merge",
	"sap/ui/fl/apply/_internal/connectors/BackendConnector"
], function(
	merge,
	BackendConnector
) {
	"use strict";

	/**
	 * Connector for requesting data from an LRep based back end.
	 *
	 * @namespace sap.ui.fl.apply._internal.connectors.LrepConnector
	 * @experimental Since 1.67
	 * @since 1.67
	 * @private
	 * @ui5-restricted sap.ui.fl.apply._internal.Storage, sap.ui.fl.write._internal.Storage
	 */
	var LrepConnector = merge({}, BackendConnector,  /** @lends sap.ui.fl.apply._internal.connectors.LrepConnector */ {

		xsrfToken: undefined,
		ROUTES: {
			DATA: "/flex/data/",
			MODULES: "/flex/modules/"
		}
	});

	return LrepConnector;
}, true);
