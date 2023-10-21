const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const RepliesRepository = require('../../Domains/replies/RepliesRepository')
const AddedReplies = require('../../Domains/replies/entities/AddedReplies')

class RepliesRepositoryPostgres extends RepliesRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addReply (userId, commentId, newReply) {
    const { content: reply } = newReply
    const id = `reply-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2 ,$3, $4, $5) RETURNING id, content, owner',
      values: [id, commentId, reply, date, userId]
    }

    const result = await this._pool.query(query)
    return new AddedReplies({ ...result.rows[0] })
  }

  async deleteReply (replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = $1 WHERE id = $2 RETURNING id',
      values: [true, replyId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus, balasan tidak ditemukan')
    }
  }

  async verifyReplyOwner (userId, replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus, balasan tidak ditemukan')
    }

    const reply = result.rows[0]

    if (reply.owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses balasan ini')
    }
  }

  async getRepliesByCommentId (commentId) {
    const query = {
      text: `SELECT rp.id, rp.content, rp.date, usr.username, rp.is_deleted
      FROM replies rp
      JOIN users usr ON rp.owner = usr.id
      WHERE rp.comment_id = $1
      ORDER BY rp.date ASC`,
      values: [commentId]
    }

    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = RepliesRepositoryPostgres
