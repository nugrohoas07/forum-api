class CommentsRepository {
  async addComment (userId, threadId, comment) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteComment (userId, threadId, commentId) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyCommentOwner (userId, commentId) {
    throw new Error('COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = CommentsRepository
