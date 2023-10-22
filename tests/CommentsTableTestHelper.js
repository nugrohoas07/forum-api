/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentsTableTestHelper = {
  async addComment ({
    id = 'comment-123', threadId = 'thread-123', content = 'komen coba', date = '8-7-2023', owner = 'user-120'
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2 ,$3, $4, $5)',
      values: [id, threadId, content, date, owner]
    }

    await pool.query(query)
  },

  async findCommentsById (id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM comments WHERE 1=1')
  }
}

module.exports = CommentsTableTestHelper
