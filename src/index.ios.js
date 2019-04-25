/**************************************************************************************
 * Original code:
 *  (c) 2016, Vladimir Enchev
 *
 * Maintained code:
 *   (c) 2019, nStudio, llc
 *
 * Licensed under the Apache license
 *
 * Any questions please feel free to put a issue up on github
 * nanderson@nstudio.io
 * Version 1.0.0 - iOS
 *************************************************************************************/


const dialogsCommon = require("tns-core-modules/ui/dialogs/dialogs-common");

let result;
exports.show = function (options) {
    return new Promise(function (resolve, reject) {
        try {
            if (options) {
                const alert = SDCAlertController.alloc().initWithTitleMessagePreferredStyle(options.title || "", options.message || "", SDCAlertControllerStyle.Alert);

                if (options.nativeView instanceof UIView) {
                    alert.contentView.addSubview(options.nativeView);

                    if(options.nativeView.centerXAnchor) {
                      options.nativeView.translatesAutoresizingMaskIntoConstraints = false;
                      options.nativeView.centerXAnchor.constraintEqualToAnchor(alert.contentView.centerXAnchor).active = true;
                      options.nativeView.topAnchor.constraintEqualToAnchor(alert.contentView.topAnchor).active = true;
                      options.nativeView.bottomAnchor.constraintEqualToAnchor(alert.contentView.bottomAnchor).active = true;
                    } else {
                      const xCenterConstraint = NSLayoutConstraint.constraintWithItemAttributeRelatedByToItemAttributeMultiplierConstant(options.nativeView, NSLayoutAttributeCenterX, NSLayoutRelationEqual, alert.contentView, NSLayoutAttributeCenterX, 1.0, 0);
                      alert.contentView.addConstraint(xCenterConstraint);

                      const yCenterConstraint = NSLayoutConstraint.constraintWithItemAttributeRelatedByToItemAttributeMultiplierConstant(options.nativeView, NSLayoutAttributeCenterY, NSLayoutRelationEqual, alert.contentView, NSLayoutAttributeCenterY, 1.0, 0);
                      alert.contentView.addConstraint(yCenterConstraint);

                      const views = {"newView": options.nativeView};

                      const widthConstraints = NSLayoutConstraint.constraintsWithVisualFormatOptionsMetricsViews("H:[newView(100)]", 0, null, views);
                      alert.contentView.addConstraints(widthConstraints);

                      const heightConstraints = NSLayoutConstraint.constraintsWithVisualFormatOptionsMetricsViews("V:[newView(100)]", 0, null, views);
                      alert.contentView.addConstraints(heightConstraints);
                    }
                }

                if (options.cancelButtonText) {
                    alert.add(SDCAlertAction.alloc().initWithTitleStyleHandler(options.cancelButtonText,
                        SDCAlertActionStyle.Default, function (args) {
                            resolve(false);
                        }));
                }

                if (options.neutralButtonText) {
                    alert.add(SDCAlertAction.alloc().initWithTitleStyleHandler(options.neutralButtonText,
                        SDCAlertActionStyle.Default, function (args) {
                            resolve(undefined);
                        }));
                }

                if (options.okButtonText) {
                    alert.add(SDCAlertAction.alloc().initWithTitleStyleHandler(options.okButtonText,
                        SDCAlertActionStyle.Default, function (args) {
                            resolve(true);
                        }));
                }


                result = {resolve: resolve, dialog: alert};
                if (alert) {
                  const currentPage = dialogsCommon.getCurrentPage();
                  if (currentPage) {
                    const viewController = currentPage.ios;
                    if (viewController) {
                      viewController.presentViewControllerAnimatedCompletion(alert, true, null);
                    }
                  }
                }
            }
        } catch (ex) {
            reject(ex);
        }
    });
};

exports.close = function () {
    if (result) {
        if (result.dialog instanceof SDCAlertController) {
            result.dialog.dismissViewControllerAnimatedCompletion(true, function () {
                if (result.resolve instanceof Function) {
                    result.resolve(true);
                    result = null;
                }
            });
        } else {
            result = null;
        }
    }
};

// Shim for Android compatibility...
exports.getContext = function() { return null; };