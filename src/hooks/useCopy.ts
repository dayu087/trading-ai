import { useState, useRef, useEffect, useCallback } from 'react'

type CopyState = Record<string, boolean>

export default function useCopy() {
  const [copiedMap, setCopiedMap] = useState<CopyState>({})
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({})

  const onCopy = useCallback(
    async (text: string, key: string) => {
      try {
        await navigator.clipboard.writeText(text)
        // 设置对应 key 的复制状态为 true
        setCopiedMap((prev) => ({ ...prev, [key]: true }))
        // 清理之前的定时器
        if (timeoutRefs.current[key]) clearTimeout(timeoutRefs.current[key])
        // 设置定时器恢复状态
        timeoutRefs.current[key] = setTimeout(() => {
          setCopiedMap((prev) => ({ ...prev, [key]: false }))
          delete timeoutRefs.current[key]
        }, 1600)
      } catch (error) {
        console.error('复制失败', error)
      }
    },
    [copiedMap]
  )

  // 清理所有定时器
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach((t) => clearTimeout(t))
    }
  }, [])

  return { copiedMap, onCopy }
}
