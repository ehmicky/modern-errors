import { createAnyError } from './any/main.js'

// Creates error classes.
export default function modernErrors(globalOpts) {
  return createAnyError(globalOpts)
}
