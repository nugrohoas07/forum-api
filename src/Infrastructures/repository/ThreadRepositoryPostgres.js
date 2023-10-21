const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AddedThread = require('../../Domains/thread/entities/AddedThread')
const ThreadRepository = require('../../Domains/thread/ThreadRepository')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThread (userId, newThread) {
    const { title, body } = newThread
    const id = `thread-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2 ,$3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, userId]
    }

    const result = await this._pool.query(query)
    return new AddedThread({ ...result.rows[0] })
  }

  async getThreadById (threadId) {
    const query = {
      text: `SELECT th.id, th.title, th.body, th.date, usr.username
      FROM threads th
      JOIN users usr ON th.owner = usr.id
      WHERE th.id = $1`,
      values: [threadId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan')
    }

    return result.rows[0]
  }

  async verifyThreadExistById (threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan')
    }
  }
}

module.exports = ThreadRepositoryPostgres
