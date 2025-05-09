import { mergeProps, useObjectRef } from '@react-aria/utils';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import type {
  ChangeEvent,
  ComponentProps,
  ElementRef,
  ForwardedRef,
  ReactElement,
} from 'react';
import React, { forwardRef, useCallback, useState } from 'react';
import type { AriaNumberFieldProps } from 'react-aria';
import { useFocusRing, useHover, useLocale, useNumberField } from 'react-aria';
import { useNumberFieldState } from 'react-stately';
import { useMobile } from '../../../utils';
import { Field } from '../Field/Field';
import { input } from '../Form.css';
import type { IFormFieldHeaderProps } from '../FormFieldHeader/FormFieldHeader';
import { NumberFieldActions } from './NumberFieldActions';

type Variants = NonNullable<RecipeVariants<typeof input>>;

type PickedAriaNumberFieldProps = Omit<
  AriaNumberFieldProps,
  'children' | 'inputElementType' | 'onChange' | 'type'
>;
export interface INumberFieldProps extends PickedAriaNumberFieldProps {
  variant?: Variants['variant'];
  fontType?: Variants['fontType'];
  size?: Variants['size'];
  className?: string;
  isPositive?: boolean;
  tag?: string;
  info?: string;
  /*
   * @deprecated Use `isDisabled` instead. only here to support libs that manages props like `react-hook-form`
   */
  disabled?: boolean;
  /*
   * using native onChange handler instead of AriaNumberFieldProps.onChange to support uncontrolled form state eg. react-hook-form
   */
  onChange?: ComponentProps<'input'>['onChange'];
  /*
   * alias for `AriaNumberFieldProps.onChange`
   */
  onValueChange?: (value: number) => void;
  startVisual?: ReactElement;
  isOutlined?: boolean;
  direction?: IFormFieldHeaderProps['direction'];
}

export function NumberFieldBase(
  props: INumberFieldProps,
  forwardedRef: ForwardedRef<ElementRef<'input'>>,
) {
  const ref = useObjectRef<ElementRef<'input'>>(forwardedRef);
  const isDisabled = props.isDisabled || props.disabled;
  const { locale } = useLocale();
  const state = useNumberFieldState({
    ...props,
    onChange: props.onValueChange,
    locale,
  });

  const {
    size = 'md',
    fontType = 'ui',
    className,
    tag,
    info,
    errorMessage,
    description,
    variant = 'default',
    label,
    startVisual,
    direction = 'row',
  } = props;

  const { inputProps, ...fieldProps } = useNumberField(
    {
      ...props,
      onChange: props.onValueChange,
      isDisabled,
    },
    state,
    ref,
  );

  const { hoverProps, isHovered } = useHover(props);
  const { isFocused, isFocusVisible, focusProps } = useFocusRing({
    isTextInput: true,
    autoFocus: props.autoFocus,
  });
  const [isTouched, setIsTouched] = useState(false);
  const { isMobile } = useMobile();

  // handle uncontrollable form state eg. react-hook-form
  const handleOnChange = useCallback(
    (event: ChangeEvent<ElementRef<'input'>>) => {
      inputProps.onChange?.(event);
      props.onChange?.(event);
      setIsTouched(isTouched && !!event.target.value);
    },
    [props.onChange, inputProps.onChange],
  );

  return (
    <Field
      {...fieldProps}
      variant={variant}
      label={label}
      isDisabled={isDisabled}
      description={description}
      startVisual={startVisual}
      direction={direction}
      endAddon={
        <NumberFieldActions
          isDisabled={isDisabled}
          variant={variant}
          state={state}
          size={size}
        />
      }
      errorMessage={errorMessage}
      size={size}
      tag={tag}
      info={info}
      ref={ref}
    >
      <input
        {...mergeProps(inputProps, focusProps, hoverProps)}
        onChange={handleOnChange}
        ref={ref}
        className={classNames(
          input({
            variant:
              fieldProps.isInvalid && isTouched ? 'negative' : props.variant,
            size,
            fontType,
          }),
          className,
        )}
        data-focused={isFocused || undefined}
        data-disabled={isDisabled || undefined}
        data-hovered={isHovered || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-invalid={props.isInvalid || undefined}
        data-positive={props.isPositive || undefined}
        data-has-start-addon={!!props.startVisual || undefined}
        data-has-end-addon
        data-is-mobile={isMobile || undefined}
      />
    </Field>
  );
}

export const NumberField = forwardRef(NumberFieldBase);
