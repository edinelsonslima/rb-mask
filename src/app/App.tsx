import { Input } from '@/components/input'

function App() {
  return (
    <>
      <h1>Masks Examples</h1>
      <div >
        <Input name="example-cpf" defaultValue="12345678909" mask="000.000.000-00" />
        <Input name="example-cpf" defaultValue={1.23} mask={Input.masks.currency()} />
      </div>
    </>
  )
}

export default App
