import { useEffect, useRef, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'
import type * as monacoEditor from 'monaco-editor'

const CodeEditor = (): JSX.Element => {
  const [code, setCode] = useState('')
  const editorRef = useRef(null)

  useEffect(() => {
    // @ts-ignore (define in dts)
    window?.api?.handleUpdates((event: string, value: string) => {
      //   document.getElementById('output').innerHTML += `${value}<br>`;
      // event.sender.send('confirmation', "done");
      setCode((pv) => {
        return `${pv}\n${value}`
      })
    })

    if (editorRef.current) {
      ;(editorRef?.current as monacoEditor.editor.IStandaloneCodeEditor).focus()
    }
  }, [])

  const onChange = (value: string, event: monacoEditor.editor.IModelContentChangedEvent): void => {
    //eslint-disable-next-line
    console.log('onChange', value, event)
  }

  const options = {
    selectOnLineNumbers: true
  }

  return (
    <MonacoEditor
      width="800"
      height="600"
      language="javascript"
      theme="vs-dark"
      value={code}
      options={options}
      onChange={onChange}
      editorDidMount={(editor) => (editorRef.current = editor)}
    />
  )
}

export default CodeEditor
