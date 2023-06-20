import queryString from 'querystring'
import objectAssign from 'object-assign'
import nodeUrl from 'url'
import { BrowserWindow, app, protocol } from 'electron'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const fetch = (
  ...args: { method: string; headers: { Accept: string; 'Content-Type': string }; body: string }[]
) => import('node-fetch').then((module) => module.default(...args))

// console.log({fetchPkg})
// const { default: fetch } = fetchPkg

const generateRandomString = function (length): string {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

let authWindow: BrowserWindow

type AuthenticateOptions = {
  scope: string
  accessType?: string
  additionalTokenRequestData?: string
}

const authenticate = (
  config,
  windowParams
): {
  getAuthorizationCode: (opts: AuthenticateOptions) => Promise<unknown>
  getAccessToken: (opts: AuthenticateOptions) => Promise<unknown>
  refreshToken: (refreshToken: string) => Promise<unknown>
} => {
  function getAuthorizationCode(opts: AuthenticateOptions): Promise<unknown> {
    const { scope, accessType } = opts || {}

    if (!config.redirectUri) {
      config.redirectUri = 'urn:ietf:wg:oauth:2.0:oob'
    }

    let urlParams: {
      response_type: string
      redirect_uri: string
      client_id: string
      state: string
      scope?: string
      access_type?: string
    } = {
      response_type: 'code',
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      state: generateRandomString(16)
    }

    if (scope) {
      urlParams = { ...urlParams, scope: scope }
    }

    if (accessType) {
      urlParams = { ...urlParams, access_type: accessType }
    }

    const url = config.authorizationUrl + '?' + queryString.stringify(urlParams)

    return new Promise(function (resolve, reject) {
      authWindow = new BrowserWindow(windowParams || { 'use-content-size': true })

      authWindow.loadURL(url)
      authWindow.show()

      authWindow.on('closed', () => {
        reject(new Error('window was closed by user'))
      })

      function onCallback(url: string): void {
        const url_parts = nodeUrl.parse(url, true)
        const query = url_parts.query
        const code = query.code
        const error = query.error

        if (error !== undefined) {
          reject(error)
          authWindow.removeAllListeners('closed')
          setImmediate(function () {
            authWindow.close()
          })
        } else if (code) {
          resolve(code)
          authWindow.removeAllListeners('closed')
          setImmediate(function () {
            authWindow.close()
          })
        }
      }

      authWindow.webContents.on('will-navigate', (event, url) => {
        onCallback(url)
      })

      authWindow.webContents.on('did-redirect-navigation', (event, newUrl) => {
        onCallback(newUrl)
      })
    })
  }

  function tokenRequest(
    data
  ): Promise<{ access_token: string; token_type: string; scope: string }> {
    const header = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    if (config.useBasicAuthorizationHeader) {
      header.Authorization =
        'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64')
    } else {
      objectAssign(data, {
        client_id: config.clientId,
        client_secret: config.clientSecret
      })
    }

    return fetch(config.tokenUrl, {
      method: 'POST',
      headers: header,
      body: queryString.stringify(data)
    }).then((res) => {
      return res.json() as unknown as { access_token: string; token_type: string; scope: string }
    })
  }

  function getAccessToken(opts: AuthenticateOptions): Promise<unknown> {
    return getAuthorizationCode(opts).then((authorizationCode) => {
      let tokenRequestData = {
        code: authorizationCode,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri
      }
      tokenRequestData = Object.assign(tokenRequestData, opts.additionalTokenRequestData)
      return tokenRequest(tokenRequestData)
    })
  }

  function refreshToken(refreshToken): Promise<unknown> {
    return tokenRequest({
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      redirect_uri: config.redirectUri
    })
  }

  return {
    getAuthorizationCode,
    getAccessToken,
    refreshToken
  }
}

const config = {
  clientId: import.meta.env.MAIN_VITE_GITHUB_CLIENT_ID,
  clientSecret: import.meta.env.MAIN_VITE_GITHUB_CLIENT_SECRET,
  authorizationUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  useBasicAuthorizationHeader: false,
  redirectUri: 'my-app://oauth'
}

const options = {
  scope: 'repo read:org'
  // accessType: 'ACCESS_TYPE'
}

const windowParams = {
  alwaysOnTop: true,
  autoHideMenuBar: true,
  webPreferences: {
    nodeIntegration: false
  }
}

console.log({ config })

const githubOAuth = authenticate(config, windowParams)

const doAuth = async (): Promise<{ token: string | null }> => // ; win: BrowserWindow
  new Promise((resolve, reject) => {
    // set the protocal for oauth redirection.
    app.setAsDefaultProtocolClient('my-app')

    app.whenReady().then(() => {
      protocol.handle('my-app', (request: Request) => {
        console.log(`OAuth callback URL: ${request.url}`)
        return new Response('received code....')
      })

      // use your token here
      githubOAuth
        .getAccessToken(options)
        .then((value) => {
          console.log('json value', value)
          resolve({ token: value.access_token })
        })
        .catch((error) => reject(error))
    })
  })

export default doAuth
