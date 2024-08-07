const NewReplies = require('../NewReplies')

describe('a NewReplies entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      mobil: 'tes'
    }

    // Action and Assert
    expect(() => new NewReplies(payload)).toThrowError('NEW_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123
    }

    // Action and Assert
    expect(() => new NewReplies(payload)).toThrowError('NEW_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create NewReplies object correctly', () => {
    // Arrange
    const payload = {
      content: 'ini komentar'
    }

    // Action
    const { content } = new NewReplies(payload)

    // Assert
    expect(content).toEqual(payload.content)
  })
})
