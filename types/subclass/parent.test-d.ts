import { expectError } from 'tsd'

import modernErrors, { InstanceOptions } from '../main.js'

const AnyError = modernErrors()

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
