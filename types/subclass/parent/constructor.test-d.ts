import { expectError, expectNotAssignable } from 'tsd'

import ModernError, { InstanceOptions } from 'modern-errors'

ModernError.subclass('TestError', {
  custom: class extends ModernError {
    constructor(message: string, options?: InstanceOptions) {
      super(message, options)
    }
  },
})

ModernError.subclass('TestError', {
  custom: class extends ModernError {
    constructor(message: string, options?: object) {
      super(message, options)
    }
  },
})

ModernError.subclass('TestError', {
  custom: class extends ModernError {
    constructor(
      message: string,
      options?: ConstructorParameters<typeof ModernError>[1],
    ) {
      super(message, options)
    }
  },
})

expectError(
  ModernError.subclass('TestError', {
    custom: class extends ModernError {
      constructor(message: string, options?: true) {
        super(message, {})
      }
    },
  }),
)

expectError(
  ModernError.subclass('TestError', {
    custom: class extends ModernError {
      constructor(
        message: string,
        options?: InstanceOptions & { cause?: true },
      ) {
        super(message, options)
      }
    },
  }),
)

ModernError.subclass('TestError', {
  custom: class extends ModernError {
    constructor(
      message: ConstructorParameters<typeof ModernError>[0],
      options?: InstanceOptions,
    ) {
      super(message, options)
    }
  },
})

expectError(
  ModernError.subclass('TestError', {
    custom: class extends ModernError {
      constructor(options?: object) {
        super('', options)
      }
    },
  }),
)

expectError(
  ModernError.subclass('TestError', {
    custom: class extends ModernError {
      constructor() {
        super()
      }
    },
  }),
)

const CustomError = ModernError.subclass('CustomError', {
  custom: class extends ModernError {
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

// `tsd`'s `expectError()` fails at validating the following, so we need to
// use more complex `expectNotAssignable` assertions.
expectNotAssignable<
  NonNullable<NonNullable<Parameters<typeof CustomError.subclass>[1]>['custom']>
>(
  class extends CustomError {
    constructor(
      message: string,
      options?: InstanceOptions & { prop?: false },
      extra?: true,
    ) {
      super(message, {}, true)
    }
  },
)

expectNotAssignable<
  NonNullable<NonNullable<Parameters<typeof CustomError.subclass>[1]>['custom']>
>(
  class extends CustomError {
    constructor(message: string, options?: InstanceOptions, extra?: false) {
      super(message, options, true)
    }
  },
)

expectError(
  class extends CustomError {
    constructor() {
      super('', {}, false)
    }
  },
)

const plugins = [{ name: 'test' as const }]
const PluginBaseError = ModernError.subclass('PluginBaseError', { plugins })

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
