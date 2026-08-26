import {
  useEffect,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/shared/lib/utils'
import './Field.css'

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('field', className)} {...rest} />
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('field field--textarea', className)} {...rest} />
}

interface SelectOption {
  value: string
  label: string
  /** Se lista pero no se puede elegir: sirve para ensenar lo que habra. */
  disabled?: boolean
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
}

export function Select({ options, className, ...rest }: SelectProps) {
  return (
    <select className={cn('field field--select', className)} {...rest}>
      {options.map((o) => (
        <option key={o.value} value={o.value} disabled={o.disabled}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: ReactNode
  /** Estado mixto del "seleccionar todo": no es un atributo, solo una propiedad del DOM. */
  indeterminate?: boolean
}

export function Checkbox({ label, indeterminate = false, className, ...rest }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <label className={cn('checkbox', rest.disabled && 'is-disabled', className)}>
      <input ref={ref} type="checkbox" className="checkbox__input" {...rest} />
      <span className="checkbox__label">{label}</span>
    </label>
  )
}

interface LabeledFieldProps {
  label: string
  htmlFor?: string
  children: ReactNode
}

export function LabeledField({ label, htmlFor, children }: LabeledFieldProps) {
  return (
    <label className="labeled-field" htmlFor={htmlFor}>
      <span className="labeled-field__label">{label}</span>
      {children}
    </label>
  )
}
