import type { FieldValues, UseFormProps } from 'react-hook-form'
import type { ZodType, ZodTypeDef } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm as _useForm } from 'react-hook-form'

const useForm = <TOut, TDef extends ZodTypeDef, TIn extends FieldValues>(
  props: Omit<UseFormProps<TIn>, 'resolver'> & { schema: ZodType<TOut, TDef, TIn> }
) => _useForm<TIn>({ ...props, resolver: zodResolver(props.schema, undefined) })

export { useForm }
