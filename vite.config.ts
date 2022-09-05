import fs from 'fs'
import path from 'path'
import { defineConfig, Plugin } from 'vite'
import Unocss from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Inspect from 'vite-plugin-inspect'
import Mkcert from 'vite-plugin-mkcert'
import { getPackageInfo } from 'local-pkg'
import pkg from './package.json'

const pathSrc = path.resolve(__dirname, 'src')
const xFormFile = path.resolve(__dirname, './src/libs/xForm.js')
const xFormCSSFile = path.resolve(__dirname, './src/libs/xForm.css')

function copyFilePlugin(): Plugin {
  return {
    name: 'copy-file',
    buildStart() {
      fs.copyFileSync(xFormFile, path.resolve('public/xForm.js'))
      fs.copyFileSync(xFormCSSFile, path.resolve('public/xForm.css'))
    },
  }
}
export default defineConfig(async () => {
  const repl = await getPackageInfo('@vue/repl')
  return {
    base: '/demo-playground/',
    resolve: {
      alias: {
        '@': pathSrc,
      },
    },
    define: {
      'import.meta.env.APP_VERSION': JSON.stringify(pkg.version),
      'import.meta.env.REPL_VERSION': JSON.stringify(repl!.version),
    },
    server: {
      https: true,
      host: true,
    },
    plugins: [
      vue({
        reactivityTransform: true,
      }),
      copyFilePlugin(),
      AutoImport({
        dirs: [path.resolve(pathSrc, 'composables')],
        imports: ['vue', '@vueuse/core'],
        resolvers: [ElementPlusResolver()],
        dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
      }),
      Components({
        dirs: [path.resolve(pathSrc, 'components')],
        resolvers: [ElementPlusResolver()],
        dts: path.resolve(pathSrc, 'components.d.ts'),
      }),
      Unocss(),
      Mkcert(),
      Inspect(),
    ],
  }
})
