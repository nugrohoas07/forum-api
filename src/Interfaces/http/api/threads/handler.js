const AutoBind = require('auto-bind')
const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase')
const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase')
const RepliesUseCase = require('../../../../Applications/use_case/RepliesUseCase')

class ThreadHandler {
  constructor (container) {
    this._container = container

    AutoBind(this)
  }

  async postThreadHandler (request, h) {
    const { id: userId } = request.auth.credentials
    const threadUseCase = this._container.getInstance(ThreadUseCase.name)
    const addedThread = await threadUseCase.addThread(userId, request.payload)

    const response = h.response({
      status: 'success',
      data: {
        addedThread
      }
    })
    response.code(201)
    return response
  }

  async getThreadHandler (request) {
    const { threadId } = request.params
    const threadUseCase = this._container.getInstance(ThreadUseCase.name)
    const thread = await threadUseCase.getThread(threadId)

    return {
      status: 'success',
      data: {
        thread
      }
    }
  }

  async postCommentHandler (request, h) {
    const { id: userId } = request.auth.credentials
    const { threadId } = request.params
    const commentUseCase = this._container.getInstance(CommentUseCase.name)
    const addedComment = await commentUseCase.addComment(userId, threadId, request.payload)

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })
    response.code(201)
    return response
  }

  async deleteCommentHandler (request) {
    const { id: userId } = request.auth.credentials
    const { threadId, commentId } = request.params

    const commentUseCase = this._container.getInstance(CommentUseCase.name)
    await commentUseCase.deleteComment(userId, threadId, commentId)

    return {
      status: 'success'
    }
  }

  async postReplyHandler (request, h) {
    const { id: userId } = request.auth.credentials
    const { threadId, commentId } = request.params
    const repliesUseCase = this._container.getInstance(RepliesUseCase.name)
    const addedReply = await repliesUseCase.addReply(userId, threadId, commentId, request.payload)

    const response = h.response({
      status: 'success',
      data: {
        addedReply
      }
    })
    response.code(201)
    return response
  }

  async deleteReplyHandler (request) {
    const { id: userId } = request.auth.credentials
    const { threadId, commentId, replyId } = request.params

    const repliesUseCase = this._container.getInstance(RepliesUseCase.name)
    await repliesUseCase.deleteReply(userId, threadId, commentId, replyId)

    return {
      status: 'success'
    }
  }
}

module.exports = ThreadHandler
