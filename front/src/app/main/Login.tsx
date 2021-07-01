import { h } from "preact";
import { useRef } from "preact/hooks";
import api from '../core/api'
import store from '../core/store'
import {route} from 'preact-router'

export default (props) => {
    const email = useRef(null);
    const pass = useRef(null)

    const getCreds = () => {return {email: email.current?.value, password: pass.current?.value}}

    const login = async () => {
        await api.login(getCreds())
        checkChat()
    }

    const sl = async () => {
        await api.signupLogin(getCreds())
        checkChat()
    }
    //const loginRes = api.login()
    const checkChat = () => {
        if (store.getState().user) route('/chat')
    }
    login()
    checkChat()
    
    return (
        <main class="login container">
            <div class="row">
                <div class="col-12 col-6-tablet push-3-tablet text-center heading">
                <h1 class="font-100">Log in or signup</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
                <form class="form">
                    <fieldset>
                    <input class="block" ref={email} type="email" name="email" placeholder="email"></input>
                    </fieldset>
                    <fieldset>
                    <input class="block" ref={pass} type="password" name="password" placeholder="password"></input>
                    </fieldset>
                    <button type="button" id="login" onClick={login} class="button button-primary block signup">
                    Log in
                    </button>
                    <button type="button" id="signup" onClick={sl} class="button button-primary block signup">
                    Sign up and log in
                    </button>
                    <a class="button button-primary block" href="/oauth/github">
                    Login with GitHub
                    </a>
                </form>
                </div>
            </div>
        </main>
    )
} 