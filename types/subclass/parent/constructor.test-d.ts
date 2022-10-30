import { expectError } from 'tsd'

import modernErrors, { InstanceOptions } from '../../main.js'

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

const CustomError = AnyError.subclass('CustomError', {
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
CustomError.subclass('TestError', {
  custom: class extends CustomError {
    constructor(message: string, options?: InstanceOptions, extra?: true) {
      super(message, options, true)
    }
  },
})

expectError(
  CustomError.subclass('TestError', {
    custom: class extends CustomError {
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
  CustomError.subclass('TestError', {
    custom: class extends CustomError {
      constructor(message: string, options?: InstanceOptions, extra?: false) {
        super(message, options, true)
      }
    },
  }),
)

expectError(
  class extends CustomError {
    constructor() {
      super('', {}, false)
    }
  },
)

const plugins = [{ name: 'test' as const }]
const PluginAnyError = modernErrors(plugins)

PluginAnyError.subclass('TestError', {
  custom: class extends PluginAnyError {
    constructor(message: string, options?: InstanceOptions) {
      super(message, options)
    }
  },
})

PluginAnyError.subclass('TestError', {
  custom: class extends PluginAnyError {
    constructor(message: string, options?: InstanceOptions<typeof plugins>) {
      super(message, options)
    }
  },
})
