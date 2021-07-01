import app from '../../app';

describe('\'users\' service', () => {
  beforeAll(async (done) => {
    try {
      const users: any = await app.service('users').find({ query: { email: 'test@example.com' } })
      if (users.data.length > 0) {
        const user = users.data[0]
        await app.service('users').remove(user._id)
      }
      const users2: any = await app.service('users').find({ query: { email: 'test2@example.com' } })
      if (users2.data.length > 0) {
        const user2 = users2.data[0]
        await app.service('users').remove(user2._id)
      }

    } catch (err) {
      // TODO howto handle union types properly - stop using TS?
      // console.log(err)
    } finally {
      done()
    }

  })

  test('registered the service', () => {
    const service = app.service('users');

    expect(service).not.toBeUndefined()
  });

  test('creates a user, encrypts password and adds gravatar', async () => {
    const user: any = await app.service('users').create({
      email: 'test@example.com',
      password: 'secret'
    }, {});

    // Verify Gravatar has been set as we'd expect
    expect(user.avatar).toMatch('https://s.gravatar.com/avatar/55502f40dc8b7c769880b10874abc9d0?s=60')
    // Makes sure the password got encrypted
    expect(user.password).not.toMatch('secret')
  });

  test('removes password for external requests', async () => {
    // Setting `provider` indicates an external request
    const params = { provider: 'rest' };

    const user: any = await app.service('users').create({
      email: 'test2@example.com',
      password: 'secret'
    }, params);

    // Make sure password has been removed
    expect(user).not.toHaveProperty('password')
  });
});