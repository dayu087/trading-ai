import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { ChevronDown } from 'lucide-react'

interface SelectProps {
  options: any[]
  value: string | number | null
  keyname: string
  onChange: (value: string | number) => void
  placeholder?: string
  renderOption?: (option: any) => React.ReactNode
  renderValue?: (option: any) => React.ReactNode
}

export default function Select({ options, value, keyname, onChange, placeholder = 'Select...', renderOption, renderValue }: SelectProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (value: string) => {
    if (!value) return
    onChange(value)
    setOpen(false)
  }

  const selectedObj = options.find((o) => o[keyname] === value) || null

  return (
    <SelectWrapper ref={wrapperRef}>
      <SelectBox onClick={() => setOpen(!open)}>
        <span>{selectedObj?.[keyname] ? (renderValue ? renderValue(selectedObj[keyname]) : selectedObj[keyname]) : placeholder}</span>
        <ChevronDown size={18} />
      </SelectBox>
      {open && (
        <Dropdown>
          {options.map((opt) => (
            <Option key={opt[keyname]} onClick={() => handleChange(opt[keyname])}>
              {renderOption ? renderOption(opt) : opt[keyname]}
            </Option>
          ))}
        </Dropdown>
      )}
    </SelectWrapper>
  )
}

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`

const SelectBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #a3a3a7;

  &:hover {
    border-color: #cafe36;
  }
`

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  z-index: 20;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
`

const Option = styled.div`
  padding: 10px 12px;
  cursor: pointer;

  &:hover {
    background: #f3f3f3;
  }
`
