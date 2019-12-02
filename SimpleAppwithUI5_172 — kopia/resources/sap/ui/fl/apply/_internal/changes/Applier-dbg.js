/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/base/Log",
	"sap/ui/core/Element",
	"sap/ui/core/util/reflection/JsControlTreeModifier",
	"sap/ui/fl/apply/_internal/changes/Utils",
	"sap/ui/fl/FlexCustomData",
	"sap/ui/fl/Utils"
], function(
	Log,
	Element,
	JsControlTreeModifier,
	Utils,
	FlexCustomData,
	FlUtils
) {
	"use strict";


	function _checkForDependentSelectorControls(oChange, mPropertyBag) {
		var aDependentControlSelectorList = oChange.getDependentControlSelectorList();

		aDependentControlSelectorList.forEach(function(sDependentControlSelector) {
			var oDependentControl = mPropertyBag.modifier.bySelector(sDependentControlSelector, mPropertyBag.appComponent, mPropertyBag.view);
			if (!oDependentControl) {
				throw new Error("A dependent selector control of the flexibility change is not available.");
			}
		});
	}

	function _checkAndAdjustChangeStatus(oControl, oChange, mChangesMap, oFlexController, mPropertyBag) {
		var bXmlModifier = _isXmlModifier(mPropertyBag);
		var sControlType = mPropertyBag.modifier.getControlType(oControl);
		var mControl = Utils.getControlIfTemplateAffected(oChange, oControl, sControlType, mPropertyBag);
		var bIsCurrentlyAppliedOnControl = FlexCustomData.hasChangeApplyFinishedCustomData(mControl.control, oChange, mPropertyBag.modifier);
		var bChangeStatusAppliedFinished = oChange.isApplyProcessFinished();
		if (bChangeStatusAppliedFinished && !bIsCurrentlyAppliedOnControl) {
			// if a change was already processed and is not applied anymore, then the control was destroyed and recreated.
			// In this case we need to recreate/copy the dependencies if we are applying in JS
			if (!bXmlModifier) {
				var fnCheckFunction = Utils.checkIfDependencyIsStillValid.bind(null, mPropertyBag.appComponent, mPropertyBag.modifier, mChangesMap);
				mChangesMap = oFlexController._oChangePersistence.copyDependenciesFromInitialChangesMap(oChange, fnCheckFunction, mPropertyBag.appComponent);
			}
			oChange.setInitialApplyState();
		} else if (!bChangeStatusAppliedFinished && bIsCurrentlyAppliedOnControl) {
			// if a change is already applied on the control, but the status does not reflect that, the status has to be updated
			// the change still needs to go through the process so that the dependencies are correctly updated and the whole process is not harmed
			// scenario: viewCache
			oChange.markFinished();
		}
		return mChangesMap;
	}

	function _checkPreconditions(oChange, oChangeHandler, mPropertyBag) {
		var sErrorMessage;
		if (!oChangeHandler) {
			sErrorMessage = "Change handler implementation for change not found or change type not enabled for current layer - Change ignored";
			Log.warning(sErrorMessage);
		}

		if (_isXmlModifier(mPropertyBag) && oChange.getDefinition().jsOnly) {
			// change is not capable of xml modifier
			// the change status has to be reset to initial
			sErrorMessage = "Change cannot be applied in XML. Retrying in JS.";
		}

		if (sErrorMessage) {
			oChange.setInitialApplyState();
			throw Error(sErrorMessage);
		}
	}

	function _handleAfterApply(oChange, mControl, oInitializedControl, mPropertyBag) {
		// changeHandler can return a different control, e.g. case where a visible UI control replaces the stashed control
		if (oInitializedControl instanceof Element) {
			// the newly rendered control could have custom data set from the XML modifier
			mControl.control = oInitializedControl;
		}
		if (mControl.control) {
			mPropertyBag.modifier.updateAggregation(mControl.originalControl, oChange.getContent().boundAggregation);
		}
		// only save the revert data in the custom data when the change is being processed in XML,
		// as it's only relevant for viewCache at the moment
		FlexCustomData.addAppliedCustomData(mControl.control, oChange, mPropertyBag, _isXmlModifier(mPropertyBag));
		// if a change was reverted previously remove the flag as it is not reverted anymore
		var oResult = {success: true};
		oChange.markFinished(oResult);
		return oResult;
	}

	function _handleAfterApplyError(oError, oChange, mControl, mPropertyBag) {
		var bXmlModifier = _isXmlModifier(mPropertyBag);
		var oResult = {success: false, error: oError};

		var sChangeId = oChange.getId();
		var sLogMessage = "Change ''{0}'' could not be applied.";
		var bErrorOccured = oError instanceof Error;
		var sCustomDataIdentifier = FlexCustomData.getCustomDataIdentifier(false, bErrorOccured, bXmlModifier);
		switch (sCustomDataIdentifier) {
			case FlexCustomData.notApplicableChangesCustomDataKey:
				FlUtils.formatAndLogMessage("info", [sLogMessage, oError.message], [sChangeId]);
				break;
			case FlexCustomData.failedChangesCustomDataKeyXml:
				FlUtils.formatAndLogMessage("warning", [sLogMessage, "Merge error detected while processing the XML tree."], [sChangeId], oError.stack);
				break;
			case FlexCustomData.failedChangesCustomDataKeyJs:
				FlUtils.formatAndLogMessage("error", [sLogMessage, "Merge error detected while processing the JS control tree."], [sChangeId], oError.stack);
				break;
			/*no default*/
		}
		FlexCustomData.addFailedCustomData(mControl.control, oChange, mPropertyBag, sCustomDataIdentifier);

		// if the change failed during XML processing, the status has to be reset
		// the change will be applied again in JS
		if (bXmlModifier) {
			oChange.setInitialApplyState();
		} else {
			oChange.markFinished(oResult);
		}
		return oResult;
	}

	function _isXmlModifier(mPropertyBag) {
		return mPropertyBag.modifier.targets === "xmlTree";
	}

	function _logApplyChangeError(oError, oChange) {
		var oDefinition = oChange.getDefinition();
		var sChangeType = oDefinition.changeType;
		var sTargetControlId = oDefinition.selector.id;
		var fullQualifiedName = oDefinition.namespace + oDefinition.fileName + "." + oDefinition.fileType;

		var sWarningMessage = "A flexibility change could not be applied.";
		sWarningMessage += "\nThe displayed UI might not be displayed as intedend.";
		if (oError.message) {
			sWarningMessage += "\n   occurred error message: '" + oError.message + "'";
		}
		sWarningMessage += "\n   type of change: '" + sChangeType + "'";
		sWarningMessage += "\n   LRep location of the change: " + fullQualifiedName;
		sWarningMessage += "\n   id of targeted control: '" + sTargetControlId + "'.";

		Log.warning(sWarningMessage, undefined, "sap.ui.fl.FlexController");
	}

	var Applier = {

		PENDING: "sap.ui.fl:PendingChange",

		/**
		 * Applying a specific change on the passed control, if it is not already applied.
		 *
		 * @param {sap.ui.fl.Change} oChange - Change object which should be applied on the passed control
		 * @param {sap.ui.core.Control} oControl - Control which is the target of the passed change
		 * @param {object} mPropertyBag propertyBag - Passed by the view processing
		 * @param {object} mPropertyBag.view - The view to process
		 * @param {object} mPropertyBag.modifier - Polymorph reuse operations handling the changes on the given view type
		 * @param {object} mPropertyBag.appDescriptor - App descriptor containing the metadata of the current application
		 * @param {object} mPropertyBag.appComponent - Component instance that is currently loading
		 * @returns {Promise|sap.ui.fl.Utils.FakePromise} Returns promise that is resolved after all changes were reverted in asynchronous case or FakePromise for the synchronous processing scenario
		 */
		applyChangeOnControl: function(oChange, oControl, mPropertyBag) {
			var sControlType = mPropertyBag.modifier.getControlType(oControl);
			var mControl = Utils.getControlIfTemplateAffected(oChange, oControl, sControlType, mPropertyBag);

			return Utils.getChangeHandler(oChange, mControl, mPropertyBag).then(function(oChangeHandler) {
				_checkPreconditions(oChange, oChangeHandler, mPropertyBag);
				return oChangeHandler;
			})

			.then(function(oChangeHandler) {
				if (oChange.hasApplyProcessStarted()) {
					// wait for the change to be finished and then clean up the status and queue
					return oChange.addPromiseForApplyProcessing().then(function(oResult) {
						oChange.markFinished();
						return oResult;
					});
				} else if (!oChange.isApplyProcessFinished()) {
					return new FlUtils.FakePromise().then(function() {
						oChange.startApplying();
						return oChangeHandler.applyChange(oChange, mControl.control, mPropertyBag);
					})
					.then(function(oInitializedControl) {
						return _handleAfterApply(oChange, mControl, oInitializedControl, mPropertyBag);
					})
					.catch(function(oError) {
						return _handleAfterApplyError(oError, oChange, mControl, mPropertyBag);
					});
				}

				// make sure that everything that goes with finishing the apply process is done, even though the change was already applied
				var oResult = {success: true};
				oChange.markFinished(oResult);
				return oResult;
			})

			.catch(function(oError) {
				return {
					success: false,
					error: oError
				};
			});
		},

		/**
		 * Gets the changes map and gets all changes for that control from the map, then, depending on
		 * dependencies, directly applies the change or saves the callback to apply in the dependency.
		 *
		 * @param {function} fnGetChangesMap function which resolves with the changes map
		 * @param {object} oAppComponent Component instance that is currently loading
		 * @param {sap.ui.fl.oFlexControlle} oFlexController instance of FlexController
		 * @param {sap.ui.core.Control} oControl instance of the Control on which changes should be applied
		 */
		applyAllChangesForControl: function(fnGetChangesMap, oAppComponent, oFlexController, oControl) {
			var aPromiseStack = [];
			var sControlId = oControl.getId();
			var mChangesMap = fnGetChangesMap();
			var mChanges = mChangesMap.mChanges;
			var aChangesForControl = mChanges[sControlId] || [];
			var mPropertyBag = {
				modifier: JsControlTreeModifier,
				appComponent: oAppComponent,
				view: FlUtils.getViewForControl(oControl)
			};

			aChangesForControl.forEach(function (oChange) {
				mChangesMap = _checkAndAdjustChangeStatus(oControl, oChange, mChangesMap, oFlexController, mPropertyBag);
				oChange.setQueuedForApply();
				if (!mChangesMap.mDependencies[oChange.getId()]) {
					aPromiseStack.push(function() {
						return Applier.applyChangeOnControl(oChange, oControl, mPropertyBag)
						.then(function() {
							oFlexController._updateDependencies(mChangesMap, oChange.getId());
						});
					});
				} else {
					//saves the information whether a change was already processed but not applied.
					mChangesMap.mDependencies[oChange.getId()][Applier.PENDING] = Applier.applyChangeOnControl.bind(Applier, oChange, oControl, mPropertyBag);
				}
			});

			// TODO improve handling of mControlsWithDependencies when change applying gets refactored
			// 		- save the IDs of the waiting changes in the map
			// 		- only try to apply those changes first
			if (aChangesForControl.length || mChangesMap.mControlsWithDependencies[sControlId]) {
				delete mChangesMap.mControlsWithDependencies[sControlId];
				return FlUtils.execPromiseQueueSequentially(aPromiseStack).then(function () {
					return oFlexController._processDependentQueue(mChangesMap, oAppComponent);
				});
			}
			return new FlUtils.FakePromise();
		},

		/**
		 * Looping over all retrieved flexibility changes and applying them onto the targeted control within the view.
		 *
		 * @param {object} mPropertyBag - collection of cross-functional attributes
		 * @param {object} mPropertyBag.view - the view to process
		 * @param {string} mPropertyBag.viewId - id of the processed view
		 * @param {string} mPropertyBag.appComponent - Application component instance responsible for the view
		 * @param {object} mPropertyBag.modifier - polymorph reuse operations handling the changes on the given view type
		 * @param {object} mPropertyBag.appDescriptor - app descriptor containing the metadata of the current application
		 * @param {string} mPropertyBag.siteId - id of the flp site containing this application
		 * @param {sap.ui.fl.Change[]} aChanges - list of flexibility changes on controls for the current processed view
		 * @returns {Promise|sap.ui.fl.Utils.FakePromise} Returns promise that is resolved after all changes were reverted in asynchronous case or FakePromise for the synchronous processing scenario including view object in both cases
		 */
		applyAllChangesForXMLView: function(mPropertyBag, aChanges) {
			var aPromiseStack = [];

			if (!Array.isArray(aChanges)) {
				var sErrorMessage = "No list of changes was passed for processing the flexibility on view: " + mPropertyBag.view + ".";
				Log.error(sErrorMessage, undefined, "sap.ui.fl.FlexController");
				aChanges = [];
			}

			aChanges.forEach(function (oChange) {
				try {
					var oSelector = oChange.getSelector && oChange.getSelector();
					if (!oSelector || !oSelector.id) {
						throw new Error("No selector in change found or no selector ID.");
					}

					var oControl = mPropertyBag.modifier.bySelector(oSelector, mPropertyBag.appComponent, mPropertyBag.view);
					if (!oControl) {
						throw new Error("A flexibility change tries to change a nonexistent control.");
					}

					_checkForDependentSelectorControls(oChange, mPropertyBag);

					oChange.setQueuedForApply();
					aPromiseStack.push(function() {
						_checkAndAdjustChangeStatus(oControl, oChange, undefined, undefined, mPropertyBag);

						if (oChange.isApplyProcessFinished()) {
							return new FlUtils.FakePromise();
						}

						return Applier.applyChangeOnControl(oChange, oControl, mPropertyBag).then(function(oReturn) {
							if (!oReturn.success) {
								_logApplyChangeError(oReturn.error || {}, oChange);
							}
						});
					});
				} catch (oException) {
					_logApplyChangeError(oException, oChange);
				}
			});

			return FlUtils.execPromiseQueueSequentially(aPromiseStack)

			.then(function() {
				return mPropertyBag.view;
			});
		}
	};
	return Applier;
}, true);