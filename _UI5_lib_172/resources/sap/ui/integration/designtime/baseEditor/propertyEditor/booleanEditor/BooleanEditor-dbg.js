/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor",
	"sap/m/CheckBox"
], function (
	BasePropertyEditor,
	CheckBox
) {
	"use strict";

	/**
	 * @class
	 * Constructor for a new <code>BooleanEditor</code>.
	 * This allows to set boolean values for a specified property of a JSON object.
	 * The editor is rendered as a {@link sap.m.CheckBox}.
	 * To get notified about changes made with the editor, you can use the <code>attachPropertyChanged</code> method,
	 * which passes the current property state as a boolean to the provided callback function when the state changes.
	 *
	 * @extends sap.ui.integration.designtime.baseEditor.propertyEditor.BasePropertyEditor
	 * @alias sap.ui.integration.designtime.baseEditor.propertyEditor.booleanEditor.BooleanEditor
	 * @author SAP SE
	 * @since 1.72
	 * @version 1.72.0
	 *
	 * @private
	 * @experimental
	 * @ui5-restricted
	 */
	var BooleanEditor = BasePropertyEditor.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.booleanEditor.BooleanEditor", {
		constructor: function() {
			BasePropertyEditor.prototype.constructor.apply(this, arguments);
			this._oInput = new CheckBox({selected: "{value}"});
			this._oInput.attachSelect(function(oEvent) {
				this.firePropertyChanged(oEvent.getParameter('selected'));
			}, this);
			this.addContent(this._oInput);
		},
		renderer: BasePropertyEditor.getMetadata().getRenderer().render
	});

	return BooleanEditor;
});
