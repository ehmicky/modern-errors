import errorCustomClass from 'error-custom-class'

import { classesData } from './map.js'

// Parent error of `ModernError`
export const CoreError = errorCustomClass('CoreError')
classesData.set(CoreError, { classOpts: {}, plugins: [], subclasses: [] })
