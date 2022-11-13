import { expectError } from 'tsd'

import modernErrors, { InstanceOptions } from 'modern-errors'

const BaseError = modernErrors()

BaseError.subclass('TestError', {
  custom: class extends BaseError {
    constructor(message: string, options?: InstanceOptions) {
      super(message, options)
    }
  },
})

BaseError.subclass('TestError', {
  custom: class extends BaseError {
    constructor(message: string, options?: object) {
      super(message, options)
    }
  },
})

BaseError.subclass('TestError', {
  custom: class extends BaseError {
    constructor(
      message: string,
      options?: ConstructorParameters<typeof BaseError>[1],
    ) {
      super(message, options)
    }
  },
})

expectError(
  BaseError.subclass('TestError', {
    custom: class extends BaseError {
      constructor(message: string, options?: true) {
        super(message, {})
      }
    },
  }),
)

expectError(
  BaseError.subclass('TestError', {
    custom: class extends BaseError {
      constructor(
        message: string,
        options?: InstanceOptions & { cause?: true },
      ) {
        super(message, options)
      }
    },
  }),
)

BaseError.subclass('TestError', {
  custom: class extends BaseError {
    constructor(
      message: ConstructorParameters<typeof BaseError>[0],
      options?: InstanceOptions,
    ) {
      super(message, options)
    }
  },
})

expectError(
  BaseError.subclass('TestError', {
    custom: class extends BaseError {
      constructor(options?: object) {
        super('', options)
      }
    },
  }),
)

expectError(
  BaseError.subclass('TestError', {
    custom: class extends BaseError {
      constructor() {
        super()
      }
    },
  }),
)

const CustomError = BaseError.subclass('CustomError', {
  custom: class extends BaseError {
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
const PluginBaseError = modernErrors({ plugins })

PluginBaseError.subclass('TestError', {
  custom: class extends PluginBaseError {
    constructor(message: string, options?: InstanceOptions) {
      super(message, options)
    }
  },
})

PluginBaseError.subclass('TestError', {
  custom: class extends PluginBaseError {
    constructor(message: string, options?: InstanceOptions<typeof plugins>) {
      super(message, options)
    }
  },
})
