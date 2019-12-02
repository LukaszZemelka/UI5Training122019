/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/base/util/merge",
	"sap/ui/fl/apply/connectors/BaseConnector",
	"sap/ui/fl/apply/_internal/connectors/BrowserStorageUtils",
	"sap/ui/fl/apply/_internal/connectors/Utils"
], function(
	merge,
	BaseConnector,
	BrowserStorageUtils,
	ApplyUtils
) {
	"use strict";

	function loadDataFromStorage (mPropertyBag) {
		var aFlexObjects = [];

		return BrowserStorageUtils.forEachObjectInStorage(mPropertyBag, function(mFlexObject) {
			aFlexObjects.push(mFlexObject.changeDefinition);
		}).then(function () {
			return aFlexObjects;
		});
	}

	/**
	 * Base Connector for requesting data from session or local storage
	 *
	 * @namespace sap.ui.fl.apply._internal.connectors.BrowserStorageConnector
	 * @since 1.70
	 * @private
	 * @ui5-restricted sap.ui.fl.write._internal.Connector, sap.ui.fl.apply._internal.Storage
	 */
	var BrowserStorageConnector = merge({}, BaseConnector, /** @lends sap.ui.fl.apply._internal.connectors.BrowserStorageConnector */ {
		/**
		 * can be either window.sessionStorage or window.localStorage
		 */
		oStorage: undefined,

		/**
		 * Provides the flex data stored in the session or local storage;
		 * Changes can be filtered by reference and layer.
		 *
		 * @param {object} mPropertyBag properties needed by the connectors
		 * @param {string} mPropertyBag.reference reference of the application
		 * @returns {Promise<Object>} resolving with an object containing a data contained in the changes-bundle
		 */
		loadFlexData: function (mPropertyBag) {
			return loadDataFromStorage({
				storage: this.oStorage,
				reference: mPropertyBag.reference
			}).then(function (aFlexObjects) {
				var mGroupedFlexObjects = ApplyUtils.getGroupedFlexObjects(aFlexObjects);
				return ApplyUtils.filterAndSortResponses(mGroupedFlexObjects);
			});
		}
	});

	return BrowserStorageConnector;
}, true);
