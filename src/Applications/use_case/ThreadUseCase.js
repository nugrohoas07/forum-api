const NewThread = require('../../Domains/thread/entities/NewThread')

class ThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async addThread (userId, useCasePayload) {
    const newThread = new NewThread(useCasePayload)
    return this._threadRepository.addThread(userId, newThread)
  }

  async getThreadById () {}
}

module.exports = ThreadUseCase
