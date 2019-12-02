/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/f/library","sap/f/cards/BaseContent","sap/viz/ui5/controls/VizFrame","sap/viz/ui5/controls/common/feeds/FeedItem","sap/viz/ui5/data/FlattenedDataset","sap/base/Log","sap/ui/core/Core","jquery.sap.global"],function(l,B,V,F,a,L,C,q){"use strict";var b={"Top":"top","Bottom":"bottom","Left":"left","Right":"right"};var c={"TopLeft":"topLeft","Center":"center"};var T={"Left":"left","Center":"center","Right":"right"};var d={"Line":"line","StackedColumn":"stacked_column","StackedBar":"stacked_bar","Donut":"donut"};var A=l.cards.AreaType;var e=B.extend("sap.f.cards.AnalyticalContent",{renderer:{}});e.prototype._getVizPropertiesObject=function(o){var t=o.title,f=o.legend,p=o.plotArea;if(!o){return this;}var v={"title":{"style":{"fontWeight":"normal"},"layout":{"respectPlotPosition":false}},"legend":{},"legendGroup":{"layout":{}},"plotArea":{"window":{"start":"firstDataPoint","end":"lastDataPoint"}},"categoryAxis":{"title":{}},"valueAxis":{"title":{}},"interaction":{"noninteractiveMode":true}};if(t){v.title.text=t.text;v.title.visible=t.visible;v.title.alignment=T[t.alignment];}if(f){v.legend.visible=f.visible;v.legendGroup.layout.position=b[f.position];v.legendGroup.layout.alignment=c[f.alignment];}if(p){if(p.dataLabel){v.plotArea.dataLabel=p.dataLabel;}if(p.categoryAxisText){v.categoryAxis.title.visible=p.categoryAxisText.visible;}if(p.valueAxisText){v.valueAxis.title.visible=p.valueAxisText.visible;}}return v;};e.prototype._updateModel=function(){this._createChart();B.prototype._updateModel.apply(this,arguments);};e.prototype._createChart=function(){var o=this.getConfiguration();if(!o.chartType){L.error("ChartType is a mandatory property");return;}var D=[];if(o.dimensions){var f=[];for(var i=0;i<o.dimensions.length;i++){var g=o.dimensions[i];var n=g.label;D.push(n);var h={name:n,value:g.value};f.push(h);}}var m=[];if(o.measures){var M=[];for(var i=0;i<o.measures.length;i++){var j=o.measures[i];var n=j.label;m.push(n);var k={name:n,value:j.value};M.push(k);}}var p=new a({measures:M,dimensions:f,data:{path:this.getBindingContext().getPath()}});var r=new V({uiConfig:{applicationSet:'fiori'},height:"100%",width:"100%",vizType:d[o.chartType],dataset:p,legendVisible:o.legend,feeds:[new F({uid:o.measureAxis,type:'Measure',values:m}),new F({uid:o.dimensionAxis,type:'Dimension',values:D})]});var v=this._getVizPropertiesObject(o);r.setVizProperties(v);this._oActions.setAreaType(A.Content);this._oActions.attach(o,this);this.setAggregation("_content",r);};e.prototype.onBeforeRendering=function(){if(this._handleHostConfiguration){this._handleHostConfiguration();}};e.prototype._handleHostConfiguration=function(){var p=this.getParent(),o=this.getAggregation("_content");if(p&&p.getHostConfigurationId&&o){var h=C.byId(p.getHostConfigurationId());if(h){var s=h.generateJSONSettings("vizProperties"),v=o.getVizProperties();v=q.extend(true,v,s);o.setVizProperties(v);}}};return e;});
