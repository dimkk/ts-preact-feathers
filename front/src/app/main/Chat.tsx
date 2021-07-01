import { h, Component } from "preact";
import store, { fillMessages, fillUsers } from "../core/store";
import { useState, useEffect, useRef } from "preact/hooks";
import api from '../core/api'
import {route} from 'preact-router'
import moment from 'moment'
import {connect} from 'unistore/preact'

class Chat extends Component<{userList:any[], messages:any[]},{}> {
    chatInput
    constructor(props) {
        super(props);
        this.chatInput = useRef(null)
        this.checkLogin()
    }

    //console.log(data)

    checkLogin = async () => {
        await api.login()
        if (!store.getState().user) {
            route('/login')
        }
        await fillMessages()
        await fillUsers()
        //console.log(store.getState())
        //console.log(this.props)
    }

    sendMessage = async() => {
        const text = this.chatInput.current?.value
        await api.sendMessage(text)
        if (this.chatInput.current) this.chatInput.current.value = ''
    }

    sendEnterMessage = (e) => {
        if (e.key !== 'Enter') return
        this.sendMessage()
    }

    logout = async () => {
        await api.logout()
        this.checkLogin()
    }

    // Helper to safely escape HTM
    setScroll = () => {
        const chat = document.querySelector('.chat');
        if (chat) chat.scrollTop = chat.scrollHeight - chat.clientHeight;
    }
    componentDidMount() {
        this.setScroll()
    }
    componentDidUpdate(){
        this.setScroll()
    }
    render() { 
        const {userList=[], messages=[]} = this.props
        return (
        <main class="flex flex-column">
            <header class="title-bar flex flex-row flex-center">
            <div class="title-wrapper block center-element">
                <img class="logo" src="http://feathersjs.com/img/feathers-logo-wide.png"
                alt="Feathers Logo"></img>
                <span class="title">Chat</span>
            </div>
            </header>
            <div class="flex flex-row flex-1 clear">
            <aside class="sidebar col col-3 flex flex-column flex-space-between">
                <header class="flex flex-row flex-center">
                    <h4 class="font-300 text-center">
                    <span class="font-600 online-count">{userList.length}</span> users
                    </h4>
                </header>
                <ul class="flex flex-column flex-1 list-unstyled user-list">{
                    userList.map((user) => { 
                        return (
                        <li>
                            <a class="block relative" href="#">
                                <img src={user.avatar} alt="" class="avatar"></img>
                                <span class="absolute username">{user.name || user.email}</span>
                            </a>
                        </li>
                        )
                    })
                }</ul>
                <footer class="flex flex-row flex-center">
                    <a href="#" onClick={this.logout} id="logout" class="button button-primary">
                        Sign Out
                    </a>
                </footer>
            </aside>
            <div class="flex flex-column col col-9">
                <main class="chat flex flex-column flex-1 clear">{
                    messages.map((message) => {
                        const { user = {} } = message;
                        const text = message.text;
                        return (
                            <div class="message flex flex-row">
                                <img src={user.avatar} alt={user.name || user.email} class="avatar"></img>
                                <div class="message-wrapper">
                                    <p class="message-header">
                                    <span class="username font-600">{user.name || user.email}</span>
                                    <span class="sent-date font-300">{moment(message.createdAt).format('MMM Do, hh:mm:ss')}</span>
                                    </p>
                                    <p class="message-content font-300">{text}</p>
                                </div>
                            </div>
                        )
                    })
                    
                }
                </main>
                <div class="flex flex-row flex-space-between" id="send-message">
                    <input type="text" ref={this.chatInput} name="text" onKeyUp={this.sendEnterMessage} class="flex flex-1"></input>
                    <button class="button-primary" onClick={this.sendMessage}>Send</button>
                </div>
            </div>
            </div>
        </main>
    )
            }
}

export default connect(['userList', 'messages'])(Chat)