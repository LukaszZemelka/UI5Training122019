/*!
* OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/

/* global Reflect, HTMLElement, CustomEvent */

sap.ui.define([
	"sap/base/Log",
	"sap/ui/integration/util/Utils",
	"sap/base/strings/hyphenate",
	"sap/base/strings/camelize",
	// polyfills
	"sap/ui/integration/thirdparty/customElements",
	"sap/ui/integration/thirdparty/customEvent"
], function (
	Log,
	Utils,
	hyphenate,
	camelize,
	// polyfills
	customElements,
	customEvent
) {
	"use strict";

	/**
	 * Constructor for a new html element.
	 * @class
	 * @alias sap.ui.integration.customElements.CustomElementBase
	 * @abstract
	 * @private
	 */
	function CustomElementBase () {

		if (this.constructor === CustomElementBase) {
			throw new TypeError('Abstract class "CustomElementBase" cannot be instantiated directly.');
		}

		return Reflect.construct(HTMLElement, [], this.constructor);
	}

	CustomElementBase.prototype = Object.create(HTMLElement.prototype);
	CustomElementBase.prototype.constructor = CustomElementBase;

	/**
	 * Called when the element is placed in DOM.
	 */
	CustomElementBase.prototype.connectedCallback = function () {
		this._init();
		this._upgradeAllProperties(); // Ensure all the properties pass through the defined setter.
		this._oControlInstance.placeAt(this.firstElementChild);
		this._attachEventListeners();
	};

	/**
	 * Called when the element is removed from DOM.
	 */
	CustomElementBase.prototype.disconnectedCallback = function () {

		if (this._oControlInstance) {
			this._oControlInstance.destroy();
			delete this._oControlInstance;
		}

		if (this.firstElementChild) {
			this.removeChild(this.firstElementChild);
		}
	};

	/**
	 * Called when attributed changes. Reflect such changes to the underlying control.
	 *
	 * @param {string} sAttributeName The attribute name in "dashed-case".
	 * @param {any} vOldValue The old value of the attribute.
	 * @param {any} vNewValue The new value of the attribute.
	 */
	CustomElementBase.prototype.attributeChangedCallback = function (sAttributeName, vOldValue, vNewValue) {
		this._init();
		var sCamelizedAttributeName = camelize(sAttributeName);

		if (Utils.isJson(vNewValue)) {
			vNewValue = JSON.parse(vNewValue);
		}

		// reflect attributes to the UI5 Control
		if (this._mAllProperties[sCamelizedAttributeName]) {
			this._mAllProperties[sCamelizedAttributeName].set(this._oControlInstance, vNewValue);
		} else if (this._mAllAssociations[sCamelizedAttributeName]) {
			var vValue = document.getElementById(vNewValue)._getControl();
			this._mAllAssociations[sCamelizedAttributeName].set(this._oControlInstance, vValue);
		} else {
			Log.error("Unknown attribute " + sAttributeName + " set to " + this.id);
		}
	};

	/**
	 * Instantiates control and prepares HTML element that will server for UIArea.
	 * @private
	 */
	CustomElementBase.prototype._init = function () {

		if (!this._oControlInstance) {
			this._oControlInstance = new this._ControlClass();
		}

		// holder for UIArea
		if (!this.firstElementChild) {
			var oUiArea = document.createElement("div");
			oUiArea.style.display = "block"; // display: contents looks like the best choice, but it is not supported on all browsers
			this.appendChild(oUiArea);
		}
	};

	/**
	 * Gives access to the underlying control for internal use.
	 * @private
	 * @returns {sap.ui.core.Control} The underlying control instance.
	 */
	CustomElementBase.prototype._getControl = function () {
		this._init();
		return this._oControlInstance;
	};

	/**
	 * Attaches listeners to all the control events and dispatches them as custom events.
	 * @private
	 */
	CustomElementBase.prototype._attachEventListeners = function () {
		Object.keys(this._oMetadata.getEvents()).map(function (sEventId) {
			this._oControlInstance.attachEvent(sEventId, function (oEvent) {
				this.dispatchEvent(new CustomEvent(sEventId, {
					detail: oEvent,
					bubbles: true
				}));
			}, this);
		}.bind(this));
	};

	/**
	 * Re-sets all the properties, to ensure that they all pass through the defined setter.
	 * @private
	 */
	CustomElementBase.prototype._upgradeAllProperties = function () {
		this._aAllProperties.forEach(this._upgradeProperty.bind(this));
	};

	/**
	 * Re-sets a single property.
	 * @param {string} sPropertyName The name of the property to re-set.
	 * @private
	 */
	CustomElementBase.prototype._upgradeProperty = function (sPropertyName) {
		if (this[sPropertyName]) {
			var vValue = this[sPropertyName];
			delete this[sPropertyName];
			this[sPropertyName] = vValue;
		}
	};

	/**
	 * Generates accessors for the given class.
	 *
	 * @static
	 * @param {Object} oPrototype The prototype on which setters and getters will be added.
	 * @param {string[]} aProperties Array of properties for will setters and getter will be defined.
	 */
	CustomElementBase.generateAccessors = function (oPrototype, aProperties) {

		// define accessors to sync properties with attributes
		// properties are defined in "camelCase"
		aProperties.forEach(function (sPropertyName) {
			Object.defineProperty(oPrototype, sPropertyName, {
				get: function () {
					return this.getAttribute(hyphenate(sPropertyName));
				},
				set: function (vValue) {

					// TO DO: clarify if stringifying is our job
					if (typeof vValue === "object") {
						vValue = JSON.stringify(vValue);
					}

					return this.setAttribute(hyphenate(sPropertyName), vValue);
				}
			});
		});
	};

	/**
	 * Defines custom html element, which will wrap a UI5 class.
	 *
	 * @static
	 * @param {string} sCustomElementName The name of the custom html element (e.g: "ui-integration-card").
	 * @param {sap.ui.integration.customElements.CustomElementBase} CustomElementClass Class representing the custom element.
	 * @param {string[]} aDependencies Array of all dependencies for the current class.
	 */
	CustomElementBase.define = function (sCustomElementName, CustomElementClass, aDependencies) {
		CustomElementBase.awaitDependencies(aDependencies)
			.then(function () {
				window.customElements.define(sCustomElementName, CustomElementClass);
			});
	};

	/**
	 * Awaits definition for other custom elements.
	 *
	 * @static
	 * @param {string[]} aDependencies Array of custom elements names that the current custom element needs to be loaded.
	 * @returns {Promise} Promise
	 */
	CustomElementBase.awaitDependencies = function(aDependencies) {
		var aPromises = aDependencies.map(function (sCustomElementName) {
			return window.customElements.whenDefined(sCustomElementName);
		});

		return Promise.all(aPromises);
	};

	/**
	 * Creates new class which will inherit CustomElementBase.
	 *
	 * @static
	 * @param {sap.ui.core.Control} ControlClass A UI5 class that will be wrapped in the custom html element.
	 * @returns {sap.ui.integration.customElements.CustomElementBase} New class which inherits CustomElementBase.
	 */
	CustomElementBase.extend = function (ControlClass) {

		function CustomElementSubClass() {
			return CustomElementBase.apply(this, arguments);
		}

		CustomElementSubClass.prototype = Object.create(CustomElementBase.prototype);
		CustomElementSubClass.prototype.constructor = CustomElementSubClass;

		var oPrototype = CustomElementSubClass.prototype,
			sKey = "";

		oPrototype._ControlClass = ControlClass;
		oPrototype._oMetadata = ControlClass.getMetadata();
		oPrototype._mAllAssociations = oPrototype._oMetadata.getAllAssociations();
		oPrototype._mAllProperties = oPrototype._oMetadata.getAllProperties();
		oPrototype._aAllProperties = []; // holds all properties and associations in "camelCase"

		for (sKey in oPrototype._mAllProperties) {
			oPrototype._aAllProperties.push(sKey);
		}

		for (sKey in oPrototype._mAllAssociations) {
			oPrototype._aAllProperties.push(sKey);
		}

		Object.defineProperty(CustomElementSubClass, "observedAttributes", {
			get: function() {
				var aAllAttributes = oPrototype._aAllProperties.map(hyphenate); // all properties and associations in "dashed-case"
				return aAllAttributes;
			}
		});

		CustomElementBase.generateAccessors(oPrototype, oPrototype._aAllProperties);

		return CustomElementSubClass;
	};

	return CustomElementBase;
});