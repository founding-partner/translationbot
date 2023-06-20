import { app, shell, BrowserWindow, screen, ipcMain, protocol } from 'electron'
import { join, resolve, relative } from 'node:path'
import { readFile, readdir, stat } from 'node:fs/promises'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import commander from 'commander'
import { chromium } from 'playwright'
import doAuth from './oauth'

const { program } = commander
let mainWindow: BrowserWindow

program
  .option('-s, --source <lang>', 'source language')
  .option('-t, --target <lang>', 'target language')

program.parse(process.argv)

const sl = program.source || 'en'
const tl = program.target || 'ta'

const sendToUI = (channel: string, ...params: unknown[]): void =>
  mainWindow.webContents.send(channel, ...params)

const getDimensions = (): Electron.Size => screen.getPrimaryDisplay().workAreaSize

function createWindow(): void {
  const { width, height } = getDimensions()

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: width / 2,
    height,
    x: 0,
    y: 0,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

const handleCommands = async (_event: any, command: any): Promise<void> => {
  // const webContents = event.sender
  // const win = BrowserWindow.fromWebContents(webContents)
  try {
    switch (command) {
      case 'login':
        // eslint-disable-next-line no-case-declarations
        const { token } = await doAuth() // , win
        console.log('token-----', token)

        console.log('sending token')
        // window will be closed, at this moment.
        // so webContent will not be available, so use
        // main window webcontent
        sendToUI('token', token)
        break

      default:
        break
    }
  } catch (error) {
    // handle error here
    console.error(error)
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
const launcher = async (): Promise<void> => {
  app.whenReady().then(() => {
    ipcMain.on('commands', handleCommands)
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    createWindow()

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
const markdownDir = join(__dirname, '../../resources/md')

const getFilesRecursively = async (directory: string): Promise<string[]> => {
  let results: string[] = []
  const files = await readdir(directory)

  for (let file of files) {
    file = resolve(directory, file)
    const stats = await stat(file)

    if (stats && stats.isDirectory()) {
      results = results.concat(await getFilesRecursively(file))
    } else {
      results.push(file)
    }
  }

  return results.filter((file) => file.endsWith('.md'))
}

function sleep(ms: number | undefined): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let insideCodeBlock = false
const shouldSkipLine = (line: string): boolean => {
  // Skip empty
  if (line.trim() === '') return true

  // Check if line is just '---'
  if (line.trim() === '---') return true

  // Handle start and end of code blocks
  if (line.trim().startsWith('```')) {
    insideCodeBlock = !insideCodeBlock
    return true
  }

  // Skip lines inside code blocks
  if (insideCodeBlock) return true

  // // Skip inline code and JSX
  // if (line.includes('`')) return true;

  // Skip inline code and JSX
  if (line.includes('<') && line.includes('>')) return true

  return false
}

const main = async (): Promise<void> => {
  const markdownFiles = await getFilesRecursively(markdownDir)
  console.log(`Markdown files: ${markdownFiles}`)

  const { width, height } = getDimensions()

  const browser = await chromium.launch({
    headless: false,
    args: [`--window-position=${width / 2 + 1},0`, `--window-size=${width / 2},${height}`]
  })
  const page = await browser.newPage()
  await page.setViewportSize({ width: width / 2, height: height })
  await page.goto(`https://translate.google.com/?sl=${sl}&tl=${tl}&op=translate`)

  for (const file of markdownFiles) {
    const filePath = join(markdownDir, relative(markdownDir, file))
    const content = await readFile(filePath, 'utf-8')
    const lines = content.split('\n')

    for (const line of lines) {
      if (shouldSkipLine(line)) continue

      // console.log(`Original: ${line}`);
      sendToUI('translation', `Original: ${line}`)

      await page.fill(`span[lang=${sl}] textarea`, line)

      // Wait for the translation to be completed
      const target = `span[lang=${tl}]`
      await page.waitForSelector(target, { state: 'attached' })

      // Check if there are any alternative translations
      const alternatives = await page.$$(`${target} [data-alternative-index]`)

      if (alternatives.length > 0) {
        // Get all translations (including alternatives)
        const translations = await page.$$eval(
          `${target} [data-alternative-index] ${target}`,
          (els) => els.map((el) => el.textContent)
        )
        // console.log(`Translations: ${translations}`);
        sendToUI('translation', `Translations: ${translations}`)
      } else {
        // Get the main translation
        const translation = await page.$eval(target, (el) => el.textContent)
        // console.log(`Translation: ${translation}`);
        sendToUI('translation', `Translation: ${translation}`)
      }

      // clear the text, so that the next line is not affected.
      await page.fill(`span[lang=${sl}] textarea`, '')
      await page.waitForSelector(target, { state: 'detached' })
      await sleep(10)
    }
  }

  await browser.close()
}

;(async (): Promise<void> => {
  try {
    await launcher()
    // await main()
  } catch (error) {
    console.error(error)
  }
})()
