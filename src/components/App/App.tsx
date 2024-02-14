import { useState } from 'react'
import styles from './App.module.scss'
import Select, { SelectOption } from 'components/Select/Select'

export default function App() {
  const [singleValue, setSingleValue] = useState<SelectOption | undefined>()
  const [multipleValue, setMultipleValue] = useState<SelectOption[]>([])

  const options = [
    { label: 'One', value: 1 },
    { label: 'Two', value: 2 },
    { label: 'Three', value: 3 },
    { label: 'Four', value: 4 },
    { label: 'Five', value: 5 }
  ]

  return (
    <div className={styles.app}>
      <Select
        options={options}
        selectedOption={singleValue}
        selectOption={(option: SelectOption | undefined) => setSingleValue(option)}
      />
      <Select
        multiple
        options={options}
        selectedOption={multipleValue}
        selectOption={(option: SelectOption[]) => setMultipleValue(option)}
      />
    </div>
  )
}