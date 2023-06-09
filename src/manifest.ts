import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, isFirefox, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  console.log(process.env.EXTENSION)
  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: isFirefox ? 2 : 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    options_ui: {
      page: './dist/options/index.html',
      open_in_tab: true,
    },
    background: isFirefox
      ? {
        scripts: ['dist/background/index.mjs'],
        type: 'module',
      }
      : {
        service_worker: './dist/background/index.mjs',
      },
    icons: {
      16: './assets/icon-16.png',
      48: './assets/icon-48.png',
      128: './assets/icon-128.png',
    },
    permissions: [
      'tabs',
      'storage',
      'activeTab',
      "contextMenus",
      "*://api.openai.com/*"
    ],
    content_scripts: [
      {
        matches: [
          '<all_urls>',
        ],
        js: [
          'dist/contentScripts/index.global.js',
        ],
      },
    ],
    web_accessible_resources:
      isFirefox ?
        ['dist/contentScripts/style.css']
        :
        [

          {
            resources: ['dist/contentScripts/style.css'],
            matches: ['<all_urls>'],
          },
        ],
    browser_action: {
      "default_icon": {
        16: './assets/icon-16.png',
        48: './assets/icon-48.png',
        128: './assets/icon-128.png',
      },
    }
  }

  if (!isFirefox) {
    manifest.action = {
      default_icon: './assets/icon-512.png',
      default_popup: './dist/popup/index.html',
    };

    manifest.host_permissions = ['*://*/*'];
  }

  // FIXME: not work in MV3
  if (isDev && false) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts
    manifest.permissions?.push('webNavigation')
  }

  return manifest
}
