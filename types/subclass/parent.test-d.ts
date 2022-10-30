import { expectError } from 'tsd'

import modernErrors, { InstanceOptions } from '../main.js'

const AnyError = modernErrors()

const SError = AnyError.subclass('SError')
const sError = new SError('')

new AnyError('', { cause: sError })
expectError(new AnyError())
expectError(new AnyError(true))
expectError(new AnyError('', true))
expectError(new AnyError('', { cause: '', other: true }))

const SSError = SError.subclass('SSError')
new SSError('')

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
new CError('', { prop: true })
expectError(new CError())
expectError(new CError(true))
expectError(new CError('', true))
expectError(new CError('', { other: true }))
expectError(new CError('', { cause: '', other: true }))
expectError(new CError('', { prop: false }))

const SCError = CError.subclass('SCError')
new SCError('', { prop: true })
expectError(new SCError())
expectError(new SCError(true))
expectError(new SCError('', true))
expectError(new SCError('', { other: true }))
expectError(new SCError('', { cause: '', other: true }))
expectError(new SCError('', { prop: false }))

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
new CSError('', { prop: true })
expectError(new CSError())
expectError(new CSError(true))
expectError(new CSError('', true))
expectError(new CSError('', { other: true }))
expectError(new CSError('', { cause: '', other: true }))
expectError(new CSError('', { prop: false }))

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
new CCError('', { prop: true, propTwo: true })
expectError(new CCError())
expectError(new CCError(true))
expectError(new CCError('', true))
expectError(new CCError('', { other: true }))
expectError(new CCError('', { cause: '', other: true }))
expectError(new CCError('', { prop: false }))
expectError(new CCError('', { propTwo: false }))

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
