import Decimal from 'decimal.js'
import BN from 'bn.js'
import { format } from 'date-fns'
export const subNumber = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '₁₀', '₁₁', '₁₂', '₁₃', '₁₄', '₁₅', '₁₆', '₁₇']
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function addressSlice(address: string) {
  return address ? address.slice(0, 4) + '...' + address.slice(-4) : '-'
}

export function hexToRgba(hex: string, alpha: number) {
  hex = hex.replace('#', '')
  let r, g, b
  if (hex.length === 6) {
    // #RRGGBB
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  } else if (hex.length === 8) {
    // #RRGGBBAA
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
    alpha = parseInt(hex.substring(6, 8), 16) / 255
    alpha = Math.floor(alpha * 100) / 100
  } else {
    throw new Error('无效的十六进制颜色代码')
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function priceChangeFormat(price: number | string) {
  if (price) {
    const num = Math.abs(Number(price)).toFixed(2)
    let newNum = Number(num)
    if (newNum < 1) {
      return priceFormat(newNum)
    }
    return newNum >= 100 ? Math.ceil(newNum) : newNum
  } else {
    return 0
  }
}

export function priceFormat(price: number | any): string {
  let efficientNum = 4
  let efficientZero = 4
  let priceStr = new Decimal(price || 0).toSignificantDigits(efficientNum).toFixed()
  let len = priceStr.search(/[123456789]/g)
  if (priceStr.length - len > efficientNum) {
    priceStr = priceStr.slice(0, len + efficientNum)
  }
  if (len >= 2 + efficientZero) {
    let sub = len - 2
    return '0.0' + subNumber[sub] + priceStr.slice(len)
  } else {
    return priceStr
  }
}

/** 判断是否像十六进制（有 0x 前缀或含 a-f 字母） */
const isHexLike = (s: string) => /^0x[0-9a-f]+$/i.test(s) || /[a-f]/i.test(s)

/** 把 number|string 解析为 Decimal；支持十六进制字符串（可无 0x） */
export function toDecimal(v: number | string | null | undefined): Decimal {
  if (v === null || v === undefined) return new Decimal(0)

  if (BN.isBN(v)) {
    return new Decimal(v.toString(10))
  }

  if (typeof v === 'number') {
    return new Decimal(v)
  }
  const s = v.trim()
  if (s === '') return new Decimal(0)
  if (isHexLike(s)) {
    const hex = s.startsWith('0x') ? s : '0x' + s
    // 用 BigInt 转十进制字符串，避免精度丢失
    const decStr = BigInt(hex).toString(10)
    return new Decimal(decStr)
  }
  // 否则按十进制处理
  return new Decimal(s)
}

export function toNumberFormat(v: Decimal | number | string, formatState = false): string {
  const num = v instanceof Decimal ? v : toDecimal(v)
  const efficientNum = 2
  if (num.isZero()) return '0'
  // 千分位整型格式（可选）
  if (formatState && num.greaterThanOrEqualTo(1000)) {
    // toDP 后输出为 JS number 只在可安全范围内；若担心安全性，可输出字符串并手动加逗号
    return Number(num.toDP(efficientNum).toString()).toLocaleString('en-US')
  }
  const K = new Decimal(1_000)
  const M = new Decimal(1_000_000)
  const B = new Decimal(1_000_000_000)
  const T = new Decimal(1_000_000_000_000)
  if (num.greaterThanOrEqualTo(T)) return num.div(T).toDP(efficientNum).toString() + 'T'
  if (num.greaterThanOrEqualTo(B)) return num.div(B).toDP(efficientNum).toString() + 'B'
  if (num.greaterThanOrEqualTo(M)) return num.div(M).toDP(efficientNum).toString() + 'M'
  if (num.greaterThanOrEqualTo(K)) return num.div(K).toDP(efficientNum).toString() + 'K'

  if (num.lessThan(1)) {
    // 你原有的 priceFormat(num)；若它只收 number，可传 Number(num.toString())
    return priceFormat(num)
  }

  return num.toDP(efficientNum).toString()
}

export function dateFormat(date: string | number, formatStr?: string): string {
  return format(new Date(date), formatStr || 'yyyy-MM-dd HH:mm:ss')
}

export function getAgoTime(date: string): string {
  if (date) {
    let time = new Date(date).getTime()
    let now = new Date().getTime()
    let diff = now - time

    let min = diff / (1000 * 60)
    let sec = (diff / 1000) % 60
    if (min < 1) {
      return '~ ' + Math.floor(sec) + 's ago'
    }
    let hour = diff / (1000 * 60 * 60)
    if (hour < 1) {
      if (min < 10 && sec > 0) {
        return '~ ' + Math.floor(min) + 'm ' + Math.floor(sec) + 's ago'
      }
      return '~ ' + Math.floor(min) + 'm ago'
    }
    let day = diff / (1000 * 60 * 60 * 24)
    if (day < 1) {
      return '~ ' + Math.floor(hour) + 'h ago'
    }

    if (day < 7) {
      return '~ ' + Math.floor(day) + 'd ago'
    }
    return dateFormat(date, 'MM/dd/yy HH:mm')
  }
  return ''
}

export function percentageCalculate(price: number | Decimal, num: number = 2) {
  if (!price) return 0
  const percentage = price instanceof Decimal ? price.mul(100) : price * 100
  return percentage.toFixed(num)
}

export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function openUrl(url: string) {
  window.open(url)
}
