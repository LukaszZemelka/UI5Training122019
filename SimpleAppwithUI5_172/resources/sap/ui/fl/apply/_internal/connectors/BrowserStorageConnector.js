/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/merge","sap/ui/fl/apply/connectors/BaseConnector","sap/ui/fl/apply/_internal/connectors/BrowserStorageUtils","sap/ui/fl/apply/_internal/connectors/Utils"],function(m,B,a,A){"use strict";function l(p){var f=[];return a.forEachObjectInStorage(p,function(F){f.push(F.changeDefinition);}).then(function(){return f;});}var b=m({},B,{oStorage:undefined,loadFlexData:function(p){return l({storage:this.oStorage,reference:p.reference}).then(function(f){var g=A.getGroupedFlexObjects(f);return A.filterAndSortResponses(g);});}});return b;},true);
