const RepliesRepository = require('../RepliesRepository')

describe('RepliesRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const commentsRepository = new RepliesRepository()

    // Action & Assert
    await expect(commentsRepository.addReply('')).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentsRepository.deleteReply('')).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentsRepository.verifyReplyOwner('')).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(commentsRepository.getRepliesByCommentId('')).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
