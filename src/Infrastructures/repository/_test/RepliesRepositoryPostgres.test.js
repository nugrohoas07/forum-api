const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const pool = require('../../database/postgres/pool')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const NewReplies = require('../../../Domains/replies/entities/NewReplies')
const AddedReplies = require('../../../Domains/replies/entities/AddedReplies')
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

describe('RepliesRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-110', username: 'prabowo' })
    await UsersTableTestHelper.addUser({ id: 'user-120', username: 'jokowi' })
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-110' })
    await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-120' })
  })

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })
  describe('addReply function', () => {
    it('should persist new reply and return added reply correctly', async () => {
      // Arrange
      const userId = 'user-110'
      const commentId = 'comment-123'
      const newReply = new NewReplies({
        content: 'sebuah balasan'
      })

      const fakeIdGenerator = () => '123' // stub!
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await repliesRepositoryPostgres.addReply(userId, commentId, newReply)

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123')
      expect(reply).toHaveLength(1)
    })

    it('should return added comment correctly', async () => {
      // Arrange
      const userId = 'user-110'
      const commentId = 'comment-123'
      const newReply = new NewReplies({
        content: 'sebuah balasan'
      })

      const fakeIdGenerator = () => '123' // stub!
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedReply = await repliesRepositoryPostgres.addReply(userId, commentId, newReply)

      // Assert
      expect(addedReply).toStrictEqual(new AddedReplies({
        id: 'reply-123',
        content: 'sebuah balasan',
        owner: 'user-110'
      }))
    })
  })

  describe('deleteReply function', () => {
    it('should throw NotFoundError when reply is not found', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123' })
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(repliesRepositoryPostgres.deleteReply('reply-999')).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when reply is found and deleted', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123' })
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(repliesRepositoryPostgres.deleteReply('reply-123')).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when reply is not found', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-110' })
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(repliesRepositoryPostgres.verifyReplyOwner('user-110', 'reply-999')).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when comment is found', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-110' })
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(repliesRepositoryPostgres.verifyReplyOwner('user-110', 'reply-123')).resolves.not.toThrowError(NotFoundError)
    })

    it('should throw AuthorizationError when user is not reply owner', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-110' })
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(repliesRepositoryPostgres.verifyReplyOwner('user-123', 'reply-123')).rejects.toThrowError(AuthorizationError)
    })

    it('should not throw AuthorizationError user is reply owner', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-110' })
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(repliesRepositoryPostgres.verifyReplyOwner('user-110', 'reply-123')).resolves.not.toThrowError(AuthorizationError)
    })
  })

  describe('getRepliesByCommentId function', () => {
    it('should return replies correctly', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', content: 'balasan', date: '8-7-2023', owner: 'user-110' })
      const expectedReply = [{
        id: 'reply-123',
        username: 'prabowo',
        date: '8-7-2023',
        content: 'balasan',
        is_deleted: false
      }]

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})

      // Action
      const reply = await repliesRepositoryPostgres.getRepliesByCommentId('comment-123')

      // Assert
      expect(reply).toEqual(expectedReply)
    })
  })
})
