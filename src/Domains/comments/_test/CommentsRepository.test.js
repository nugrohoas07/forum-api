const CommentsRepository = require('../CommentsRepository')

describe('CommentsRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const commentsRepository = new CommentsRepository()

    // Action & Assert
    await expect(commentsRepository.addComment('')).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentsRepository.deleteComment('')).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentsRepository.verifyCommentOwner('')).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentsRepository.getCommentsByThreadId('')).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentsRepository.verifyCommentExistById('')).rejects.toThrowError('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
