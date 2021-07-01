import feathersClient, { FeathersClient } from '@feathersjs/client'
import {Application} from '@feathersjs/feathers'
import io from 'socket.io-client'
import {AuthenticationClient} from '@feathersjs/authentication-client'
import store from './store';
import { ServiceTypes } from '../../../../back/declarations';
import {fillMessages, fillUsers} from './store'

// Establish a Socket.io connection
const socket = io('http://localhost:3030');
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client:Application<FeathersClient & AuthenticationClient & ServiceTypes> = feathersClient();

client.configure(feathersClient.socketio(socket));
// Use localStorage to store our login token
client.configure(feathersClient.authentication());

client.service('messages').on('created', fillMessages)
client.service('users').on('created', fillUsers)

const sendMessage = async (text) => {
    //console.log(text)
    await client.service('messages').create({text})
}

const getMessages = async () => {
    const messages:any = await client.service('messages').find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      });
      //console.log(messages)
      return messages.data.reverse()
}

const getUsers = async () => {
    const users = await client.service('users').find();
    //console.log(users)
    return users
}

const signupLogin = async (credentials) => {
    // First create the user
  await client.service('users').create(credentials);
  // If successful log them in
  await login(credentials);

}

const logout = async () => {
    await client.logout()
    store.setState({'user': ''})
}

const login = async (credentials?) => {
    try {
      if(!credentials) {
        // Try to authenticate using an existing token
        const { user, accessToken } = await client.reAuthenticate();
        store.setState({'user': user})
      } else {
        // Otherwise log in with the `local` strategy using the credentials we got
        const { user, accessToken } = await client.authenticate({
          strategy: 'local',
          ...credentials
        });
        store.setState({'user': user})
      }

      
  
      // If successful, show the chat page
    } catch(error) {
      // If we got an error, show the login page
      console.log(error)
      return false
    }
  };

export default {
    login, signupLogin, logout,
    getUsers, getMessages,
    sendMessage
}