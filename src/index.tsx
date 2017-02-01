import { h, render } from 'preact';

import App from './components/App';

let root: Element;
function init() {
    root = render(
        <App />,
        document.body,
        root,
    );
}

declare const module: any;
if (module.hot) {
    module.hot.accept('./components/App', init)
}

init();
