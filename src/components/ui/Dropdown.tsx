import { styled, keyframes } from 'styled-components'
import lessIcon from '@/assets/images/dashboard_icon_arrowless.png'
import moreIcon from '@/assets/images/dashboard_icon_arrowmore.png'
import yesIcon from '@/assets/images/home_icon_yesgreen.png'

interface DropdownListProps {
  lable: string
  DropdownDataList: any[]
  selectId: string
  setSelectId: (modelId: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  isDisabled?: boolean
}

function getShortName(fullName: string): string {
  const parts = fullName.split('_')
  return parts.length > 1 ? parts[parts.length - 1] : fullName
}

export default function DropdownList({ lable, DropdownDataList, selectId, setSelectId, open, setOpen, isDisabled }: DropdownListProps) {
  return (
    <Dropdown $isDisabled={isDisabled}>
      <DropdownHeader onClick={() => !isDisabled && setOpen(!open)} $open={open}>
        {selectId ? selectId : lable}
        <DropdownIcon src={open ? lessIcon : moreIcon} />
      </DropdownHeader>
      {open && (
        <DropdownContent>
          <Option
            $active={!selectId}
            onClick={() => {
              setSelectId('')
              setOpen(false)
            }}
          >
            {lable}
          </Option>
          {DropdownDataList.map((model: any) => (
            <Option
              key={model.id}
              $active={model.id === setSelectId}
              onClick={() => {
                setSelectId(model.id)
                setOpen(false)
              }}
            >
              {getShortName(model.name)} ({model.type.toUpperCase()}) {model.id === selectId && <img src={yesIcon} alt="" />}
            </Option>
          ))}
        </DropdownContent>
      )}
    </Dropdown>
  )
}

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`

const DropdownHeader = styled.div<{ $open: boolean }>`
  display: ${(p) => (p.$open ? 'none' : 'flex')};
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  color: #1a1a1a;
`

const DropdownIcon = styled.img`
  width: 16px;
  height: 16px;
`

const Dropdown = styled.div<{ $isDisabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #191a23;
  opacity: ${(p) => (p.$isDisabled ? 0.5 : 1)};
`

const DropdownContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  animation: ${slideDown} 0.25s ease forwards;
`

const Option = styled.div<{ $active?: boolean }>`
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease-in-out;

  background: ${(p) => (p.$active ? '#f3f3f3' : 'transparent')};

  &:hover {
    background: #f3f3f3;
  }

  img {
    width: 12px;
    height: 12px;
  }
`
