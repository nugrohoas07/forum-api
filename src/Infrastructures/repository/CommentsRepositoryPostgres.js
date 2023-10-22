const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const CommentsRepository = require('../../Domains/comments/CommentsRepository')
const AddedComment = require('../../Domains/comments/entities/AddedComment')

class CommentsRepositoryPostgres extends CommentsRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addComment (userId, threadId, newComment) {
    const { content: comment } = newComment
    const id = `comment-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2 ,$3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, comment, date, userId]
    }

    const result = await this._pool.query(query)
    return new AddedComment({ ...result.rows[0] })
  }

  async deleteComment (commentId) {
    const query = {
      text: 'UPDATE comments SET is_deleted = $1 WHERE id = $2 RETURNING id',
      values: [true, commentId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus, komentar tidak ditemukan')
    }
  }

  async verifyCommentOwner (userId, commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan')
    }

    const comment = result.rows[0]

    if (comment.owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses komentar ini')
    }
  }

  async getCommentsByThreadId (threadId) {
    const query = {
      text: `SELECT cm.id, usr.username, cm.date, cm.content,cm.is_deleted
      FROM comments cm
      JOIN users usr ON cm.owner = usr.id
      WHERE cm.thread_id = $1
      ORDER BY cm.date ASC`,
      values: [threadId]
    }

    const result = await this._pool.query(query)
    return result.rows
  }

  async verifyCommentExistById (commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan')
    }
  }
}

module.exports = CommentsRepositoryPostgres
