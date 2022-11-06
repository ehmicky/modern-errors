import errorCustomClass from 'error-custom-class'

import { ERROR_CLASSES } from './map.js'

// Parent error of `ModernError`
export const CoreError = errorCustomClass('CoreError')
ERROR_CLASSES.set(CoreError, { classOpts: {}, plugins: [] })
