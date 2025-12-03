import * as React from 'react'
import { styled } from 'styled-components'
import { Eye, EyeOff } from 'lucide-react'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = 'text', ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <InputGroup>
      <InputSection className={className} ref={ref} type={showPassword ? 'text' : type} {...props} autoComplete={type === 'password' ? 'current-password' : props.autoComplete} />
      {type === 'password' && <Toggle onClick={() => setShowPassword(!showPassword)}> {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</Toggle>}
    </InputGroup>
  )
})

Input.displayName = 'Input'

export default Input

const InputGroup = styled.div`
  position: relative;
  width: 100%;
`

const InputSection = styled.input`
  width: 100%;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  border: 1px solid #a3a3a7;

  &:focus {
    outline: 1px solid var(--brand-green);
  }

  @media (max-width: 768px) {
    padding: 8px 24px 8px 12px;
  }
`

const Toggle = styled.button`
  position: absolute;
  right: 8px;
  top: 0;
  bottom: 0;
  width: 18px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
`
