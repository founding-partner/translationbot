// import { app, protocol } from 'electron'
// import electronOauth2 from 'electron-oauth2'

// const config = {
//   clientId: import.meta.env.MAIN_VITE_GITHUB_CLIENT_ID,
//   clientSecret: import.meta.env.MAIN_VITE_GITHUB_CLIENT_SECRET,
//   authorizationUrl: 'https://github.com/login/oauth/authorize',
//   tokenUrl: 'https://github.com/login/oauth/access_token',
//   useBasicAuthorizationHeader: false,
//   redirectUri: 'my-app://oauth'
// }

// const options = {
//   scope: 'SCOPE',
//   accessType: 'ACCESS_TYPE'
// }

// const windowParams = {
//   alwaysOnTop: true,
//   autoHideMenuBar: true,
//   webPreferences: {
//     nodeIntegration: false
//   }
// }

// console.log({ config })

// const githubOAuth = electronOauth2(config, windowParams)

// const doAuth = async (): Promise<string | null> =>
//   new Promise((resolve, reject) => {
//     // set the protocal for oauth redirection.
//     app.setAsDefaultProtocolClient('my-app')

//     app.whenReady().then(() => {
//       protocol.handle('my-app', (request: Request) => {
//         console.log(`OAuth callback URL: ${request.url}`)
//         const uri = new URL(request.url)

//         // Handle the callback here. For example:
//         resolve(uri?.searchParams?.get('code'))
//         return new Response('received code....')
//       })

//       // use your token here
//       githubOAuth
//         .getAccessToken(options)
//         .then(() => {})
//         .catch((error) => reject(error))
//     })
//   })

// export default doAuth
