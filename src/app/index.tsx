import { h, render } from 'preact';

import App from './components/App';

declare const module: any;

if (typeof window !== 'undefined') {
    let root: Element;
    if (document.body.classList.contains('ssr')) {
        root = document.body.children[0];
    }
    let init = function () {
        root = render(
            <App />,
            document.body,
            root,
        );
    }

    if (module.hot) {
        module.hot.accept('./components/App', init)
    }

    init();
}

export { App };
