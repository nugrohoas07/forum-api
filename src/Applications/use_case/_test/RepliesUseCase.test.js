const NewReply = require('../../../Domains/replies/entities/NewReplies')
const AddedReply = require('../../../Domains/replies/entities/AddedReplies')
const RepliesRepository = require('../../../Domains/replies/RepliesRepository')
const ThreadRepository = require('../../../Domains/thread/ThreadRepository')
const CommentsRepository = require('../../../Domains/comments/CommentsRepository')
const RepliesUseCase = require('../RepliesUseCase')

describe('ReplyUseCase', () => {
  describe('A addReply function', () => {
    it('should orchestrating the add reply action correctly', async () => {
      // Arrange
      const useCasePayload = {
        content: 'sebuah balasan'
      }
      const userId = 'user-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'

      const mockedAddedReply = new AddedReply({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: userId
      })

      const expectedAddedReply = new AddedReply({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: userId
      })

      const mockRepliesRepository = new RepliesRepository()
      const mockThreadRepository = new ThreadRepository()
      const mockCommentsRepository = new CommentsRepository()

      // mocking
      mockThreadRepository.verifyThreadExistById = jest.fn()
        .mockImplementation(() => Promise.resolve())
      mockCommentsRepository.verifyCommentExistById = jest.fn()
        .mockImplementation(() => Promise.resolve())
      mockRepliesRepository.addReply = jest.fn()
        .mockImplementation(() => Promise.resolve(mockedAddedReply))

      // creating use case instance
      const repliesUseCase = new RepliesUseCase({
        repliesRepository: mockRepliesRepository,
        threadRepository: mockThreadRepository,
        commentsRepository: mockCommentsRepository
      })

      // Action
      const addedReply = await repliesUseCase.addReply(userId, threadId, commentId, useCasePayload)

      // Assert
      expect(addedReply).toStrictEqual(expectedAddedReply)

      expect(mockThreadRepository.verifyThreadExistById).toBeCalledWith(threadId)
      expect(mockCommentsRepository.verifyCommentExistById).toBeCalledWith(commentId)
      expect(mockRepliesRepository.addReply).toBeCalledWith(userId, commentId, new NewReply({
        content: useCasePayload.content
      }))
    })
  })

  describe('A deleteReply function', () => {
    it('should orchestrating the delete reply action correctly', async () => {
      // Arrange
      const userId = 'user-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const replyId = 'reply-123'

      const mockRepliesRepository = new RepliesRepository()
      const mockCommentsRepository = new CommentsRepository()
      const mockThreadRepository = new ThreadRepository()

      // Mocking
      mockThreadRepository.verifyThreadExistById = jest.fn()
        .mockImplementation(() => Promise.resolve())
      mockCommentsRepository.verifyCommentExistById = jest.fn()
        .mockImplementation(() => Promise.resolve())
      mockRepliesRepository.verifyReplyOwner = jest.fn()
        .mockImplementation(() => Promise.resolve())
      mockRepliesRepository.deleteReply = jest.fn()
        .mockImplementation(() => Promise.resolve())

      // creating use case instance
      const replyUseCase = new RepliesUseCase({
        repliesRepository: mockRepliesRepository,
        threadRepository: mockThreadRepository,
        commentsRepository: mockCommentsRepository
      })

      // Action
      await replyUseCase.deleteReply(userId, threadId, commentId, replyId)

      // Assert
      expect(mockThreadRepository.verifyThreadExistById).toHaveBeenCalledWith(threadId)
      expect(mockCommentsRepository.verifyCommentExistById).toHaveBeenCalledWith(commentId)
      expect(mockRepliesRepository.verifyReplyOwner).toHaveBeenCalledWith(userId, replyId)
      expect(mockRepliesRepository.deleteReply).toHaveBeenCalledWith(replyId)
    })
  })
})
