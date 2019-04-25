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
 * Version 1.0.0 - Android
 *************************************************************************************/


/* global require */

const appModule = require("tns-core-modules/application");

let result;

exports.show = function (options) {
    return new Promise(function (resolve, reject) {
        try {
            if (options) {
                const context = exports.getContext();
                const alert = new android.app.AlertDialog.Builder(context);

                if (options.message) {
                  alert.setMessage(options.message);
                }

                if (options.title) {
                  alert.setTitle(options.title);
                }

                if (options.nativeView instanceof android.view.View) {
                    alert.setView(options.nativeView);
                }

                if (options.cancelButtonText) {
                    alert.setNegativeButton(options.cancelButtonText, new android.content.DialogInterface.OnClickListener({
                      onClick: function (dialog, id) {
                          dialog.cancel();
                          resolve(false);
                      }
                    }));
                }

                if (options.neutralButtonText) {
                    alert.setNeutralButton(options.neutralButtonText, new android.content.DialogInterface.OnClickListener({
          						onClick: function (dialog, id) {
          							dialog.cancel();
          							resolve(undefined);
          						}
          					}));
                }

                if (options.okButtonText) {
                    alert.setPositiveButton(options.okButtonText, new android.content.DialogInterface.OnClickListener({
          						onClick: function (dialog, id) {
          							dialog.cancel();
          							resolve(true);
          						}
          					}));
                }

                result = {resolve: resolve, dialog: alert.show()};
            }
        } catch (ex) {
            reject(ex);
        }
    });
};

exports.close = function () {
  if(result){

    if(result.dialog instanceof android.app.AlertDialog){
      result.dialog.cancel();
    }

    if(result.resolve instanceof Function){
      result.resolve(true);
    }
    result = null;
  }
};

/**
 * getContext
 * The activity must be the Foreground or start activity; not the application context...
 */
exports.getContext = function() {

    if (appModule.android.foregroundActivity) {
        return appModule.android.foregroundActivity;
    }
    if (appModule.android.startActivity) {
        return appModule.android.startActivity;
    }
    /** for older versions of TNS **/
    if (appModule.android.currentContext) {
        return appModule.android.currentContext;
    }
};

