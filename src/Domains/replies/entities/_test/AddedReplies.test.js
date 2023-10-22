const AddedReplies = require('../AddedReplies')

describe('a AddedReplies entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: '123',
      content: 'komen'
    }

    // Action and Assert
    expect(() => new AddedReplies(payload)).toThrowError('ADDED_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      content: 123,
      owner: {}
    }

    // Action and Assert
    expect(() => new AddedReplies(payload)).toThrowError('ADDED_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedReplies object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'komentar ini',
      owner: 'user-345'
    }

    // Action
    const { id, content, owner } = new AddedReplies(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
  })
})
