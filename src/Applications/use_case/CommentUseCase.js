const NewComment = require('../../Domains/comments/entities/NewComment')

class CommentUseCase {
  constructor ({ commentsRepository, threadRepository }) {
    this._commentsRepository = commentsRepository
    this._threadRepository = threadRepository
  }

  async addComment (userId, threadId, useCasePayload) {
    const newComment = new NewComment(useCasePayload)
    await this._threadRepository.verifyThreadExistById(threadId)
    return this._commentsRepository.addComment(userId, threadId, newComment)
  }

  async deleteComment (userId, threadId, commentId) {
    await this._threadRepository.verifyThreadExistById(threadId)
    await this._commentsRepository.verifyCommentOwner(userId, commentId)
    await this._commentsRepository.deleteComment(commentId)
  }
}

module.exports = CommentUseCase
