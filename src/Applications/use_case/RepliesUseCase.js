const NewReply = require('../../Domains/replies/entities/NewReplies')

class RepliesUseCase {
  constructor ({ repliesRepository, threadRepository, commentsRepository }) {
    this._repliesRepository = repliesRepository
    this._threadRepository = threadRepository
    this._commentsRepository = commentsRepository
  }

  async addReply (userId, threadId, commentId, useCasePayload) {
    await this._threadRepository.verifyThreadExistById(threadId)
    await this._commentsRepository.verifyCommentExistById(commentId)
    const newReply = new NewReply(useCasePayload)
    return this._repliesRepository.addReply(userId, commentId, newReply)
  }

  async deleteReply (userId, threadId, commentId, replyId) {
    await this._threadRepository.verifyThreadExistById(threadId)
    await this._commentsRepository.verifyCommentExistById(commentId)
    await this._repliesRepository.verifyReplyOwner(userId, replyId)
    await this._repliesRepository.deleteReply(replyId)
  }
}

module.exports = RepliesUseCase
