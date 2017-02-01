import { h, Component } from 'preact';

import './App.scss';
import Logo from './logo.svg';

class App extends Component<{}, {}> {
    public render() {
        return (
            <header>
                <Logo />
                <h1>Preact Starter</h1>
            </header>
        )
    }
}

export default App;
