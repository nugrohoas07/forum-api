const pool = require('../../database/postgres/pool')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const NewThread = require('../../../Domains/thread/entities/NewThread')
const AddedThread = require('../../../Domains/thread/entities/AddedThread')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-110', username: 'prabowo' })
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })
  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      const userId = 'user-110'
      const newThread = new NewThread({
        title: 'judul',
        body: 'isian'
      })

      const fakeIdGenerator = () => '123' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await threadRepositoryPostgres.addThread(userId, newThread)

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123')
      expect(thread).toHaveLength(1)
    })

    it('should return added thread correctly', async () => {
      // Arrange
      const userId = 'user-110'
      const newThread = new NewThread({
        title: 'judul',
        body: 'isian'
      })

      const fakeIdGenerator = () => '123' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(userId, newThread)

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'judul',
        owner: 'user-110'
      }))
    })
  })

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-666')).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when thread is found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123')).resolves.not.toThrowError(NotFoundError)
    })
    it('should return thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'judul', body: 'isian', date: '7-7-2023', owner: 'user-110' })
      const expectedThread = {
        id: 'thread-123',
        title: 'judul',
        body: 'isian',
        date: '7-7-2023',
        username: 'prabowo'
      }

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123')

      // Assert
      expect(thread).toEqual(expectedThread)
    })
  })

  describe('verifyThreadExistById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExistById('thread-666')).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when thread is found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExistById('thread-123')).resolves.not.toThrowError(NotFoundError)
    })
  })
})
