const NewThread = require('../../Domains/thread/entities/NewThread')

class ThreadUseCase {
  constructor ({ threadRepository, commentsRepository, repliesRepository }) {
    this._threadRepository = threadRepository
    this._commentsRepository = commentsRepository
    this._repliesRepository = repliesRepository
  }

  async addThread (userId, useCasePayload) {
    const newThread = new NewThread(useCasePayload)
    return this._threadRepository.addThread(userId, newThread)
  }

  async getThread (threadId) {
    const thread = await this._threadRepository.getThreadById(threadId)
    const commentsRaw = await this._commentsRepository.getCommentsByThreadId(threadId)
    const comments = await Promise.all(commentsRaw.map(async (comment) => {
      const commentObject = {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: (comment.is_deleted) ? '**komentar telah dihapus**' : comment.content
      }

      const replies = await this._repliesRepository.getRepliesByCommentId(comment.id)
      commentObject.replies = replies.map(reply => ({
        id: reply.id,
        username: reply.username,
        date: reply.date,
        content: (reply.is_deleted) ? '**balasan telah dihapus**' : reply.content
      }))

      return commentObject
    }))

    return {
      ...thread,
      comments
    }
  }
}

module.exports = ThreadUseCase
