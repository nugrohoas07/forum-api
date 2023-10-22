const NewThread = require('../../../Domains/thread/entities/NewThread')
const AddedThread = require('../../../Domains/thread/entities/AddedThread')
const RepliesRepository = require('../../../Domains/replies/RepliesRepository')
const ThreadRepository = require('../../../Domains/thread/ThreadRepository')
const CommentsRepository = require('../../../Domains/comments/CommentsRepository')
const ThreadUseCase = require('../ThreadUseCase')

describe('ThreadUseCase', () => {
  describe('A addReply function', () => {
    it('should orchestrating the add thread action correctly', async () => {
      // Arrange
      const useCasePayload = {
        title: 'judul',
        body: 'isi thread'
      }
      const userId = 'user-123'

      const mockedAddedThread = new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: userId
      })

      const expectedAddedThread = new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: userId
      })

      const mockThreadRepository = new ThreadRepository()

      // mocking
      mockThreadRepository.addThread = jest.fn()
        .mockImplementation(() => Promise.resolve(mockedAddedThread))

      // creating use case instance
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentsRepository: null,
        repliesRepository: null
      })

      // Action
      const addedThread = await threadUseCase.addThread(userId, useCasePayload)

      // Assert
      expect(addedThread).toStrictEqual(expectedAddedThread)

      expect(mockThreadRepository.addThread).toBeCalledWith(userId, new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body
      }))
    })
  })

  describe('A getThread function', () => { // TODO Mock this
    it('should orchestrating the get thread action correctly', async () => {
      // Arrange
      const threadId = 'thread-123'

      const mockedThreadData = [{
        id: 'thread-123',
        title: 'judul',
        body: 'random',
        date: '7-7-2023',
        username: 'prabowo'
      }]

      const mockedCommentData = [{
        id: 'comment-123',
        username: 'anies',
        date: '7-7-2023',
        content: 'halo'
      }]

      const mockedReplyData = [{
        id: 'reply-123',
        content: 'balasan',
        date: '7-7-2023',
        username: 'ganjar'
      }]

      const mockThreadRepository = new ThreadRepository()
      const mockCommentsRepository = new CommentsRepository()
      const mockRepliesRepository = new RepliesRepository()

      // Mocking
      mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve(mockedThreadData))
      mockCommentsRepository.getCommentsByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve(mockedCommentData))
      mockRepliesRepository.getRepliesByCommentId = jest.fn()
        .mockImplementation(() => Promise.resolve(mockedReplyData))

      // creating use case instance
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentsRepository: mockCommentsRepository,
        repliesRepository: mockRepliesRepository
      })

      // Action
      const thread = await threadUseCase.getThread(threadId)

      // Assert
      expect(thread).toStrictEqual({
        thread: {
          id: 'thread-123',
          title: 'judul',
          body: 'random',
          date: '7-7-2023',
          username: 'prabowo',
          comments: [{
            id: 'comment-123',
            username: 'anies',
            date: '7-7-2023',
            content: 'halo',
            replies: [{
              id: 'reply-123',
              content: 'balasan',
              date: '7-7-2023',
              username: 'ganjar'
            }]
          }]
        }
      }) // TODO expected value is wrong

      expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId)
      expect(mockCommentsRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId)
      /* commentsData.forEach((comment) => {
        expect(mockRepliesRepository.getRepliesByCommentId).toHaveBeenCalledWith(comment.id)
      }) */
    })
  })
})
