import { MouseEvent, useEffect, useRef, useState } from 'react'
import styles from './Select.module.scss'

export type SelectOption = {
  label: string,
  value: string | number
}

type SingleSelectProps = {
  multiple?: false,
  selectedOption?: SelectOption,
  selectOption: (option: SelectOption | undefined) => void
}

type MultipleSelectProps = {
  multiple: true,
  selectedOption: SelectOption[],
  selectOption: (option: SelectOption[]) => void
}

type SelectProps = {
  options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

export default function Select({
  multiple,
  options,
  selectedOption,
  selectOption
}: SelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const clearOptions = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    multiple ? selectOption([]) : selectOption(undefined)
  }

  const onSelect = (e: MouseEvent<HTMLElement>, option: SelectOption) => {
    e.stopPropagation()

    if (multiple) {
      const isSelected = selectedOption.some(item => item.value === option.value)
      isSelected
        ? selectOption(selectedOption.filter(item => item.value !== option.value))
        : selectOption([...selectedOption, option])
    } else {
      if (option.value !== selectedOption?.value) {
        selectOption(option)
        setIsOpen(false)
      }
    }

  }

  const getOptionClassName = (option: SelectOption) => {
    let className = styles.option

    const isSelected = multiple
      ? selectedOption.some(item => item.value === option.value)
      : option.value === selectedOption?.value

    if (isSelected) {
      className += ` ${styles.selected}`
    }

    return className
  }

  useEffect(() => {
    const closeSelect = (e: unknown) => {
      const target = (e as MouseEvent).target as Node

      if (isOpen && selectRef.current && !selectRef.current.contains(target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', closeSelect)

    return () => {
      document.removeEventListener('mousedown', closeSelect)
    }
  }, [selectRef, setIsOpen, isOpen])

  return (
    <div
      ref={selectRef}
      className={`${styles.container} ${isOpen && styles.open}`}
      onClick={() => setIsOpen(state => !state)}
    >
      <span className={`${styles.value} ${multiple && styles.multiple}`}>
        {multiple && selectedOption.map(item => (
          <button
            key={item.value}
            className={styles.optionBadge}
            onClick={e => onSelect(e, item)}
          >
            {item.label}
            <span className={styles.clearButton}>&times;</span>
          </button>
        ))}
        {!multiple && selectedOption?.label}
      </span>
      <button className={styles.clearButton} onClick={e => clearOptions(e)}>
        &times;
      </button>
      <div className={styles.divider} />
      <div className={styles.caret} />
      <ul className={`${styles.options} ${isOpen && styles.show}`}>
        {options.map(option => (
          <li
            key={option.value}
            className={getOptionClassName(option)}
            onClick={e => onSelect(e, option)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  )
}