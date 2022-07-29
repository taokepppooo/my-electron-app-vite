import path from "path";
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { builtinModules } from 'module'
import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'
import esbuild from 'rollup-plugin-esbuild'
import { defineConfig } from 'rollup'
import { dependencies } from '../package.json'

export default (env = "production", type = "main") => {
  return defineConfig({
    input:
      type === "main"
        ? path.join(__dirname, "..", "src", "main", "index.ts")
        : path.join(__dirname, "..", "src", "preload", "index.ts"),
    output: {
      file: path.join(
        __dirname,
        "..", "dist", "electron", "main", "index.js"
      ),
      format: "cjs",
      sourcemap: false,
    },
    plugins: [
      // 提供路径和读取别名
      nodeResolve({ preferBuiltins: true, browser: false, extensions: ['.mjs', '.ts', '.js', '.json', '.node'] }),
      commonjs({
        sourceMap: false,
      }),
      json(),
      esbuild({
        include: /\.[jt]s?$/,
        exclude: /node_modules/,
        sourceMap: env != "production",
        minify: env === "production",
        target: "esnext",
        define: {
          __VERSION__: '"x.y.z"',
        },
        loaders: {
          ".json": "json",
          ".js": "jsx",
        },
      }),
      alias({
        entries: [
          {
            find: "@main", replacement: path.join(__dirname, "../src/main")
          },
        ],
      }),
    ],
    external: [
      ...builtinModules,
      ...Object.keys(dependencies),
      "electron"
    ],
  })
};


