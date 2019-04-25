interface alertOptions{
    title: string;
    message: string;
    nativeView: object | any;
    cancelButtonText: string;
    neutralButtonText: string;
    okButtonText: string;
    CancelAllowed: boolean;
}

/**
 * Show the dialog
 * @param options {object|any|alertOptions}
 */
export function show(options: alertOptions);

/**
 * Close the dialog
 */
export function close();

/**
 * Returns the current android context
 */
export function getContext();