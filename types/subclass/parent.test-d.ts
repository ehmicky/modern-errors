import { expectError } from 'tsd'

import modernErrors, { InstanceOptions } from '../main.js'

const AnyError = modernErrors()

const SError = AnyError.subclass('SError')
const SSError = SError.subclass('SSError')
const CError = AnyError.subclass('CError', {
  custom: class extends AnyError {
    constructor(
      message: string,
      options?: InstanceOptions & { prop?: true },
      extra?: true,
    ) {
      super(message, options, extra)
    }
  },
})
const SCError = CError.subclass('SCError')
const CSError = SError.subclass('CSError', {
  custom: class extends SError {
    constructor(
      message: string,
      options?: InstanceOptions & { prop?: true },
      extra?: true,
    ) {
      super(message, options, extra)
    }
  },
})
const CCError = CError.subclass('CCError', {
  custom: class extends CError {
    constructor(
      message: string,
      options?: InstanceOptions & { prop?: true; propTwo?: true },
      extra?: boolean,
    ) {
      super(message, options, true)
    }
  },
})

new AnyError('', { cause: '' })
new SError('')
new SSError('')
new CError('', { prop: true }, true)
new SCError('', { prop: true }, true)
new CSError('', { prop: true }, true)
new CCError('', { prop: true, propTwo: true }, false)

expectError(new AnyError())
expectError(new SError())
expectError(new SSError())
expectError(new CError())
expectError(new SCError())
expectError(new CSError())
expectError(new CCError())

expectError(new AnyError(true))
expectError(new SError(true))
expectError(new SSError(true))
expectError(new CError(true))
expectError(new SCError(true))
expectError(new CSError(true))
expectError(new CCError(true))

expectError(new AnyError('', true))
expectError(new SError('', true))
expectError(new SSError('', true))
expectError(new CError('', true))
expectError(new SCError('', true))
expectError(new CSError('', true))
expectError(new CCError('', true))

expectError(new SError('', { other: true }))
expectError(new SSError('', { other: true }))
expectError(new CError('', { other: true }))
expectError(new SCError('', { other: true }))
expectError(new CSError('', { other: true }))
expectError(new CCError('', { other: true }))

expectError(new AnyError('', { cause: '', other: true }))
expectError(new SError('', { cause: '', other: true }))
expectError(new SSError('', { cause: '', other: true }))
expectError(new CError('', { cause: '', other: true }))
expectError(new SCError('', { cause: '', other: true }))
expectError(new CSError('', { cause: '', other: true }))
expectError(new CCError('', { cause: '', other: true }))

expectError(new CError('', { prop: false }))
expectError(new SCError('', { prop: false }))
expectError(new CSError('', { prop: false }))
expectError(new CCError('', { prop: false }))
expectError(new CCError('', { propTwo: false }))

expectError(new CError('', {}, false))
expectError(new SCError('', {}, false))
expectError(new CSError('', {}, false))
expectError(new CCError('', {}, ''))

expectError(new CError('', {}, true, true))
expectError(new SCError('', {}, true, true))
expectError(new CSError('', {}, true, true))
expectError(new CSError('', {}, true, true))

AnyError.subclass('TestError', {
  custom: class extends AnyError {
    constructor(message: string, options?: InstanceOptions) {
      super(message, options)
    }
  },
})

AnyError.subclass('TestError', {
  custom: class extends AnyError {
    constructor(message: string, options?: object) {
      super(message, options)
    }
  },
})

AnyError.subclass('TestError', {
  custom: class extends AnyError {
    constructor(
      message: string,
      options?: ConstructorParameters<typeof AnyError>[1],
    ) {
      super(message, options)
    }
  },
})

expectError(
  AnyError.subclass('TestError', {
    custom: class extends AnyError {
      constructor(message: string, options?: true) {
        super(message, {})
      }
    },
  }),
)

expectError(
  AnyError.subclass('TestError', {
    custom: class extends AnyError {
      constructor(
        message: string,
        options?: InstanceOptions & { cause?: true },
      ) {
        super(message, options)
      }
    },
  }),
)

AnyError.subclass('TestError', {
  custom: class extends AnyError {
    constructor(
      message: ConstructorParameters<typeof AnyError>[0],
      options?: InstanceOptions,
    ) {
      super(message, options)
    }
  },
})

expectError(
  AnyError.subclass('TestError', {
    custom: class extends AnyError {
      constructor(options?: object) {
        super('', options)
      }
    },
  }),
)

expectError(
  AnyError.subclass('TestError', {
    custom: class extends AnyError {
      constructor() {
        super()
      }
    },
  }),
)

CError.subclass('TestError', {
  custom: class extends CError {
    constructor(message: string, options?: InstanceOptions, extra?: true) {
      super(message, options, true)
    }
  },
})

expectError(
  CError.subclass('TestError', {
    custom: class extends CError {
      constructor(
        message: string,
        options?: InstanceOptions & { prop?: false },
        extra?: true,
      ) {
        super(message, options, true)
      }
    },
  }),
)

expectError(
  CError.subclass('TestError', {
    custom: class extends CError {
      constructor(message: string, options?: InstanceOptions, extra?: false) {
        super(message, options, true)
      }
    },
  }),
)

expectError(
  class extends CError {
    constructor() {
      super('', {}, false)
    }
  },
)

const plugins = [{ name: 'test' as const }]
const PAnyError = modernErrors(plugins)

PAnyError.subclass('TestError', {
  custom: class extends PAnyError {
    constructor(message: string, options?: InstanceOptions) {
      super(message, options)
    }
  },
})

PAnyError.subclass('TestError', {
  custom: class extends PAnyError {
    constructor(message: string, options?: InstanceOptions<typeof plugins>) {
      super(message, options)
    }
  },
})