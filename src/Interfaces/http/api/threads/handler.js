const AutoBind = require('auto-bind')
const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase')
const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase')

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

  async deleteCommentHandler (request, h) {
    const { id: userId } = request.auth.credentials
    const { threadId, commentId } = request.params

    const commentUseCase = this._container.getInstance(CommentUseCase.name)
    await commentUseCase.deleteComment(userId, threadId, commentId)

    return {
      status: 'success'
    }
  }
}

module.exports = ThreadHandler
