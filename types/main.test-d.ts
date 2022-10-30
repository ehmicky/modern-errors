import { expectError } from 'tsd'

import modernErrors from './main.js'

import './any/aggregate.test-d.js'
import './any/main.test-d.js'
import './any/modify/intersect.test-d.js'
import './any/modify/instance.test-d.js'
import './any/modify/plugins.test-d.js'
import './any/normalize/unknown.test-d.js'
import './any/normalize/wrap.test-d.js'
import './core_plugins/props/merge.test-d.js'
import './core_plugins/props/validate.test-d.js'
import './core_plugins/process.test-d.js'
import './core_plugins/serialize.test-d.js'
import './core_plugins/stack.test-d.js'
import './options/class.test-d.js'
import './options/get.test-d.js'
import './options/instance.test-d.js'
import './options/plugins.test-d.js'
import './plugins/info.test-d.js'
import './plugins/instance.test-d.js'
import './plugins/properties.test-d.js'
import './plugins/shape.test-d.js'
import './plugins/static.test-d.js'
import './subclass/custom/attributes.test-d.js'
import './subclass/custom/override.test-d.js'
import './subclass/inherited.test-d.js'
import './subclass/main/class.test-d.js'
import './subclass/main/instanceof.test-d.js'
import './subclass/main/plugins.test-d.js'
import './subclass/name.test-d.js'
import './subclass/parent/args.test-d.js'
import './subclass/parent/constructor.test-d.js'

modernErrors([])
modernErrors([], {})
modernErrors([{ name: 'test' as const }], {})
expectError(modernErrors(true))
