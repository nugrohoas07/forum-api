const NewComment = require('../../../Domains/comments/entities/NewComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const CommentsRepository = require('../../../Domains/comments/CommentsRepository')
const ThreadRepository = require('../../../Domains/thread/ThreadRepository')
const CommentUseCase = require('../CommentUseCase')

describe('CommentUseCase', () => {
  describe('A addComment function', () => {
    it('should orchestrating the add comment action correctly', async () => {
      // Arrange
      const useCasePayload = {
        content: 'sebuah komen'
      }
      const userId = 'user-123'
      const threadId = 'thread-123'

      const mockedAddedComment = new AddedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: userId
      })

      const expectedAddedComment = new AddedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: userId
      })

      const mockCommentsRepository = new CommentsRepository()
      const mockThreadRepository = new ThreadRepository()

      // mocking
      mockThreadRepository.verifyThreadExistById = jest.fn()
        .mockImplementation(() => Promise.resolve())
      mockCommentsRepository.addComment = jest.fn()
        .mockImplementation(() => Promise.resolve(mockedAddedComment))

      // creating use case instance
      const commentUseCase = new CommentUseCase({
        commentsRepository: mockCommentsRepository,
        threadRepository: mockThreadRepository
      })

      // Action
      const addedComment = await commentUseCase.addComment(userId, threadId, useCasePayload)

      // Assert
      expect(addedComment).toStrictEqual(expectedAddedComment)

      expect(mockThreadRepository.verifyThreadExistById).toBeCalledWith(threadId)
      expect(mockCommentsRepository.addComment).toBeCalledWith(userId, threadId, new NewComment({
        content: useCasePayload.content
      }))
    })
  })

  describe('A deleteComment function', () => {
    it('should orchestrating the delete comment action correctly', async () => {
      // Arrange
      const userId = 'user-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'

      const mockCommentsRepository = new CommentsRepository()
      const mockThreadRepository = new ThreadRepository()

      // Mocking
      mockThreadRepository.verifyThreadExistById = jest.fn()
        .mockImplementation(() => Promise.resolve())
      mockCommentsRepository.verifyCommentOwner = jest.fn()
        .mockImplementation(() => Promise.resolve())
      mockCommentsRepository.deleteComment = jest.fn()
        .mockImplementation(() => Promise.resolve())

      // creating use case instance
      const commentUseCase = new CommentUseCase({
        commentsRepository: mockCommentsRepository,
        threadRepository: mockThreadRepository
      })

      // Action
      await commentUseCase.deleteComment(userId, threadId, commentId)

      // Assert
      expect(mockThreadRepository.verifyThreadExistById).toHaveBeenCalledWith(threadId)
      expect(mockCommentsRepository.verifyCommentOwner).toHaveBeenCalledWith(userId, commentId)
      expect(mockCommentsRepository.deleteComment).toHaveBeenCalledWith(commentId)
    })
  })
})
