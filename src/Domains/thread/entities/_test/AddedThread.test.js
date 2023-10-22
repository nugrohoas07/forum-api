const AddedThread = require('../AddedThread')

describe('a AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: '123',
      title: 'judul'
    }

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      title: 123,
      owner: {}
    }

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'ini judul',
      owner: 'user-345'
    }

    // Action
    const { id, title, owner } = new AddedThread(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(title).toEqual(payload.title)
    expect(owner).toEqual(payload.owner)
  })
})
