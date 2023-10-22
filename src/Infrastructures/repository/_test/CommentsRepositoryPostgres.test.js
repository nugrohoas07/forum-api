const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const pool = require('../../database/postgres/pool')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const CommentsRepositoryPostgres = require('../CommentsRepositoryPostgres')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

describe('CommentsRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-110', username: 'threadmaker' })
    await UsersTableTestHelper.addUser({ id: 'user-120', username: 'commentmaker' })
    await ThreadsTableTestHelper.addThread({ title: 'sebuah judul', body: 'isi thread' })
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })
  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const userId = 'user-120'
      const threadId = 'thread-123'
      const newComment = new NewComment({
        content: 'sebuah komen'
      })

      const fakeIdGenerator = () => '123' // stub!
      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await commentsRepositoryPostgres.addComment(userId, threadId, newComment)

      // Assert
      const comment = await CommentsTableTestHelper.findCommentsById('comment-123')
      expect(comment).toHaveLength(1)
    })

    it('should return added comment correctly', async () => {
      // Arrange
      const userId = 'user-120'
      const threadId = 'thread-123'
      const newComment = new NewComment({
        content: 'komen'
      })

      const fakeIdGenerator = () => '123' // stub!
      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedComment = await commentsRepositoryPostgres.addComment(userId, threadId, newComment)

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'komen',
        owner: 'user-120'
      }))
    })
  })

  describe('deleteComment function', () => {
    it('should throw NotFoundError when comment is not found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'komentar' })
      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentsRepositoryPostgres.deleteComment('comment-999')).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when comment is found and deleted', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'komentar' })
      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentsRepositoryPostgres.deleteComment('comment-123')).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment is not found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-120' })
      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentsRepositoryPostgres.verifyCommentOwner('user-120', 'comment-999')).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when comment is found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'komentar' })
      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentsRepositoryPostgres.verifyCommentOwner('user-120', 'comment-123')).resolves.not.toThrowError(NotFoundError)
    })

    it('should throw AuthorizationError when user is not comment owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-120' })
      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentsRepositoryPostgres.verifyCommentOwner('user-123', 'comment-123')).rejects.toThrowError(AuthorizationError)
    })

    it('should not throw AuthorizationError user is comment owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-120' })
      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentsRepositoryPostgres.verifyCommentOwner('user-120', 'comment-123')).resolves.not.toThrowError(AuthorizationError)
    })
  })

  describe('getCommentsByThreadId function', () => {
    it('should return comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', content: 'komen', date: '8-7-2023', owner: 'user-120' })
      const expectedComment = [{
        id: 'comment-123',
        username: 'commentmaker',
        date: '8-7-2023',
        content: 'komen',
        is_deleted: false
      }]

      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {})

      // Action
      const comment = await commentsRepositoryPostgres.getCommentsByThreadId('thread-123')

      // Assert
      expect(comment).toEqual(expectedComment)
    })
  })

  describe('verifyCommentExistById function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123' })
      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentsRepositoryPostgres.verifyCommentExistById('comment-999')).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when comment is found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123' })
      const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentsRepositoryPostgres.verifyCommentExistById('comment-123')).resolves.not.toThrowError(NotFoundError)
    })
  })
})
