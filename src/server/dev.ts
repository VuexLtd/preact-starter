import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { Compiler, Stats } from 'webpack';
import * as webpack from '@vuex/koa-webpack';
import MemoryFileSystem = require('memory-fs');

const wpConfig = require('../../webpack.config.js');

function requireFromString(src: string, filename: string) {
  var Module: any = module.constructor;
  var m = new Module();
  m._compile(src, filename);
  return m.exports;
}

export function webpackMiddleware() {
    return webpack({
        config: wpConfig,
        dev: {
            serverSideRender: true,
        }
    });
}

export async function devMiddleware(ctx, next) {
    const ofs: MemoryFileSystem = (<Compiler> ctx['webpack']).outputFileSystem;

    const stats: Stats = ctx['webpackStats'];

    let assets: string[] = stats.toJson().assetsByChunkName.main;
    if (!Array.isArray(assets)) {
        assets = [assets];
    }

    const scripts = assets.filter(file => file.endsWith('.js'));
    ctx['assets'] = {
        scripts,
        styles: assets.filter(file => file.endsWith('.css')),
    }

    const mainScript = scripts.find(name => wpConfig.output.filename);
    const srcFile = resolve(wpConfig.output.path, mainScript);
    const script = ofs.readFileSync(srcFile, 'utf-8');
    ctx['App'] = requireFromString(script, srcFile).App;

    return next();
}
