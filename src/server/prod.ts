import { resolve } from 'path';
import * as compose from 'koa-compose';
import * as serveStatic from 'koa-static';
import * as mount from 'koa-mount';

const distDir = process.env.DIST_DIR;

export function ssr() {
    // TODO: don't assume main file name
    const App = require(resolve(distDir, 'bundle.js')).App;
    const assets = require(resolve(distDir, 'stats.json')).assetsByChunkName.main;

    return async (ctx, next) => {
        const assetDir = 'assets/';
        ctx['assets'] = {
            scripts: assets
                .filter(file => file.endsWith('.js'))
                .map(file => assetDir + file),
            styles: assets
                .filter(file => file.endsWith('.css'))
                .map(file => assetDir + file),
        };

        ctx['App'] = App;

        return next();
    }
}

export function prodMiddleware() {
    return compose([
        ssr(),
        mount('/assets', serveStatic(distDir)),
    ]);
}
