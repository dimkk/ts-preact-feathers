import {Router} from 'preact-router'
import {h} from 'preact'
import Login from './main/Login'
import Chat from './main/Chat'
import { Provider } from 'unistore/preact'
import store from './core/store'

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Login path="/login"></Login>
                <Chat path="/chat"></Chat>
                <Chat path="/"></Chat>
                {/* <Chat path="/"></Chat> */}
            </Router>
        </Provider>
    ) 
}

export default App
