import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { ChevronDown } from 'lucide-react'

interface SelectProps {
  options: any[]
  value: string | number | any
  keyname: string
  isDisabled?: boolean
  onChange: (value: string | number) => void
  placeholder?: string
  renderOption?: (option: any) => React.ReactNode
  renderValue?: (option: any) => React.ReactNode
}

import yesIcon from '@/assets/images/home_icon_yesgreen.png'

export default function Select({ options, value, keyname, isDisabled, onChange, placeholder = 'Select...', renderOption, renderValue }: SelectProps) {
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
    <SelectWrapper $isDisabled={isDisabled || false} ref={wrapperRef}>
      <SelectBox onClick={() => !isDisabled && setOpen(!open)}>
        <span>{selectedObj?.[keyname] ? (renderValue ? renderValue(selectedObj[keyname]) : selectedObj[keyname]) : placeholder}</span>
        <ChevronDown size={18} />
      </SelectBox>
      {open && (
        <Dropdown>
          {options.map((opt) => (
            <Option key={opt[keyname]} onClick={() => handleChange(opt[keyname])}>
              {renderOption ? renderOption(opt) : opt[keyname]}
              {value === opt[keyname] && <img src={yesIcon} alt="Yes" />}
            </Option>
          ))}
        </Dropdown>
      )}
    </SelectWrapper>
  )
}

const SelectWrapper = styled.div<{ $isDisabled: boolean }>`
  position: relative;
  width: 100%;
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.5 : 1)};
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

  @media (max-width: 768px) {
    padding: 8px 24px 8px 12px;
  }
`

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  z-index: 20;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
`

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 8px;
  font-size: 14px;

  &:hover {
    background: #f3f3f3;
  }

  img {
    width: 12px;
    height: 12px;
  }
`
