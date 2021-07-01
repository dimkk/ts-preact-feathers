import createStore from 'unistore'
import api from './api'

const store = createStore({
                                    user: '',
                                    userList: [],
                                    messages: []
                                })


export const fillMessages = async() => {
    if (!store.getState().user) return
    const messages = await api.getMessages()
    store.setState({messages})
}

export const fillUsers = async() => {
    if (!store.getState().user) return
    const users:any = await api.getUsers()
    store.setState({userList: users.data})
}

export default store