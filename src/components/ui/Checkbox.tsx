import styled from 'styled-components'

interface CheckboxProps {
  label?: string
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}

interface StyledProps {
  checked?: boolean
  disabled?: boolean
}

export default function Checkbox({ label, checked, onChange, disabled = false }: CheckboxProps) {
  return (
    <CheckboxWrapper disabled={disabled}>
      <HiddenCheckbox checked={checked} onChange={(e) => !disabled && onChange(e.target.checked)} disabled={disabled} />
      <StyledCheckbox checked={checked}>
        <CheckIcon>{checked && '✔️'}</CheckIcon>
      </StyledCheckbox>
      {label && <span>{label}</span>}
    </CheckboxWrapper>
  )
}

const CheckboxWrapper = styled.label<StyledProps>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  color: #eaecef;
  font-size: 14px;

  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
  `}

  span {
    font-size: 14px;
    color: #000000;
  }
`

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  display: none;
`

const StyledCheckbox = styled.div<StyledProps>`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 120ms ease;
  background: ${({ checked }) => (checked ? '#CAFE36' : '#fff')};

  ${CheckboxWrapper}:hover & {
    border-color: #3b4450;
  }
`

const CheckIcon = styled.div<StyledProps>`
  font-size: 14px;
`
