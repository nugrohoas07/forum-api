class RepliesRepository {
  async addReply (userId, commentId, newReply) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteReply (replyId) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyReplyOwner (userId, replyId) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getRepliesByCommentId (commentId) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = RepliesRepository
