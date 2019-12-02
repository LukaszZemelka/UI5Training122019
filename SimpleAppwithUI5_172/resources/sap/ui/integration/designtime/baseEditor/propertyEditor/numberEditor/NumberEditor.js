/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/m/Input","sap/m/InputType"],function(B,I,a){"use strict";var N=B.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.numberEditor.NumberEditor",{constructor:function(){B.prototype.constructor.apply(this,arguments);this._oInput=new I({value:"{value}",type:a.Number});this._oInput.attachLiveChange(function(e){var n=parseFloat(this._oInput.getValue());this.firePropertyChanged(n);},this);this.addContent(this._oInput);},renderer:B.getMetadata().getRenderer().render});return N;});
