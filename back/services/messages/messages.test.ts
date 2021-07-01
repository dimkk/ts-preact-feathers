import app from '../../app';

describe('\'messages\' service', () => {
    let user:any
    beforeAll(async (done) => {
        try{
            user = await app.service('users').create({
                email: 'messagetest@example.com',
                password: 'supersecret'
              });
        } catch (err) {
            // TODO howto handle union types properly - stop using TS?
            const users:any = await app.service('users').find({query: {email: 'messagetest@example.com'}})
            if (users.data.length > 0) {
                user = users.data[0]
            }
        } finally {
            done()
        }
         
    })
    afterAll(async (done) => {
        try {
            await app.service('users').remove(user.id)
        } catch (err) {

        } finally {
            done ()
        }
    })
  test('registered the service', () => {
    const service = app.service('messages');

    expect(service).not.toBeUndefined()
  });

  test('creates and processes message, adds user information', async () => {
    // Create a new user we can use for testing
    

    // The messages service call params (with the user we just created)
    const params = { user };
    const message = await app.service('messages').create({
      text: 'a test',
      additional: 'should be removed'
    }, params);

    expect(message.text).toMatch('a test')
    // `userId` should be set to passed users it
    expect(message.userId).toMatch(user._id)
    // Additional property has been removed
    expect(message).not.toHaveProperty('additional')
    // `user` has been populated
    expect(message.user).toMatchObject(user)
  });
});