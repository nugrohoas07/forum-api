/* istanbul ignore file */

const { createContainer } = require('instances-container')

// external agency
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const Jwt = require('@hapi/jwt')
const pool = require('./database/postgres/pool')

// service (repository, helper, manager, etc)
const UserRepository = require('../Domains/users/UserRepository')
const PasswordHash = require('../Applications/security/PasswordHash')
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres')
const BcryptPasswordHash = require('./security/BcryptPasswordHash')
const ThreadRepository = require('../Domains/thread/ThreadRepository')
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres')
const CommentsRepository = require('../Domains/comments/CommentsRepository')
const CommentsRepositoryPostgres = require('./repository/CommentsRepositoryPostgres')
const RepliesRepository = require('../Domains/replies/RepliesRepository')
const RepliesRepositoryPostgres = require('./repository/RepliesRepositoryPostgres')

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase')
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager')
const JwtTokenManager = require('./security/JwtTokenManager')
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase')
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository')
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres')
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase')
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase')
const ThreadUseCase = require('../Applications/use_case/ThreadUseCase')
const CommentUseCase = require('../Applications/use_case/CommentUseCase')
const RepliesUseCase = require('../Applications/use_case/RepliesUseCase')

// creating container
const container = createContainer()

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        }
      ]
    }
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt
        }
      ]
    }
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token
        }
      ]
    }
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: CommentsRepository.name,
    Class: CommentsRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: RepliesRepository.name,
    Class: RepliesRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  }
])

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        }
      ]
    }
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        }
      ]
    }
  },
  {
    key: ThreadUseCase.name,
    Class: ThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'commentsRepository',
          internal: CommentsRepository.name
        },
        {
          name: 'repliesRepository',
          internal: RepliesRepository.name
        }
      ]
    }
  },
  {
    key: CommentUseCase.name,
    Class: CommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentsRepository',
          internal: CommentsRepository.name
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        }
      ]
    }
  },
  {
    key: RepliesUseCase.name,
    Class: RepliesUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'repliesRepository',
          internal: RepliesRepository.name
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'commentsRepository',
          internal: CommentsRepository.name
        }
      ]
    }
  }
])

module.exports = container
