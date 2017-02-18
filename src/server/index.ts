import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as Koa from 'koa';
import * as renderPreact from 'preact-render-to-string';
import { h } from 'preact';

import { prodMiddleware } from './prod';
import { devMiddleware, webpackMiddleware } from './dev';

const production = process.env.NODE_ENV === 'production';
const distDir = process.env.DIST_DIR = process.env.DIST_DIR ? resolve(process.env.DIST_DIR) : resolve(__dirname, '..');

let indexPath = resolve(distDir, 'index.tmpl.html');
if (!production) {
    indexPath = resolve(__dirname, '../index.tmpl.html');
}

const app = new Koa();
const indexTemplate = readFileSync(indexPath, 'utf-8');

if (!production) {
    console.warn('Running in development mode');
    app.use(webpackMiddleware());
}

app.use(async (ctx, next) => {
    ctx.set('content-type', 'text/html');
    ctx.body = indexTemplate;
    return next();
})

if (production) {
    app.use(prodMiddleware());
} else {
    app.use(devMiddleware);
}

interface Assets {
    scripts: string[];
    styles: string[];
}

app.use(async ctx => {
    const assets: Assets = ctx['assets'];

    const scripts = assets.scripts
        .map(script => `<script src="${script}"></script>`)
        .join('');
    ctx.body = ctx.body.replace('<!-- scripts -->', scripts);

    const styles = assets.styles
        .map(style => `<link rel="stylesheet" href="${style}">`)
        .join('');
    ctx.body = ctx.body.replace('<!-- styles -->', styles);

    const App = ctx['App'];
    ctx.body = ctx.body.replace('<!-- render -->', renderPreact(h(App, {})));
});

app.listen(4545, () => {
    console.log('Server running on http://localhost:4545');
});
