import { toast, ToastContainer } from '@react-bunker/toast-notification'
import { Input } from '@react-bunker/input-mask'

import '@react-bunker/toast-notification/style.css'

function App() {
  return (
    <>
      <h1>Masks Examples</h1>
      <ToastContainer />
      <div onClick={() => toast.info({content: 'Funciona ainda?'})}>
        <Input name="example-cpf" defaultValue="12345678909" mask="000.000.000-00" />
        <Input name="example-cpf" defaultValue={1.23} mask={Input.masks.currency()} />
      </div>
    </>
  )
}

export default App
