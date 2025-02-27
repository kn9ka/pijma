import {
  Box,
  Card,
  CardPos,
  css,
  getDataProps,
  Icon,
  InputField,
  MenuControl,
  OptionModel,
  Overlay,
  OverlayProps,
  Pos,
  SelectFieldControl,
  SelectInput,
  SimpleTransition,
  styled,
} from '@qiwi/pijma-core'
import React, { FC, ReactNode } from 'react'

import { MenuItem } from '../menu'

const CardMenuItem = styled(Card)().withComponent(MenuItem)

CardMenuItem.displayName = 'CardMenuItem'

export interface SelectFieldProps<I extends OptionModel<V>, V> {
  items: I[]
  title: string
  value: V
  stub?: boolean
  tabIndex?: number
  error?: ReactNode
  disabled?: boolean
  name?: string
  autoFocus?: boolean
  onChange: (value: V) => void
  equals?: (a: V, b: V) => boolean
  onFocus?: () => void
  onBlur?: () => void
  onHide?: () => void
}

export interface SelectFieldItemModel<V> extends OptionModel<V> {
  text: string
}

const Transition: OverlayProps['transition'] = (props) => (
  <SimpleTransition
    {...props}
    timeout={{
      enter: 150,
      exit: 150,
    }}
    enteringClassName={(timeout: number) =>
      css({
        opacity: 0,
        transform: `translateY(${-12}px)`,
        transition: `opacity ${timeout}ms cubic-bezier(0.4, 0.0, 0.2, 1), transform ${timeout}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
      })
    }
    enteredClassName={(timeout: number) =>
      css({
        opacity: 1,
        transform: `translateY(${0}px)`,
        transition: `opacity ${timeout}ms cubic-bezier(0.4, 0.0, 0.2, 1), transform ${timeout}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
      })
    }
    exitingClassName={(timeout: number) =>
      css({
        opacity: 0,
        transform: `translateY(${-12}px)`,
        transition: `opacity ${timeout}ms cubic-bezier(0.4, 0.0, 0.2, 1), transform ${timeout}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
      })
    }
    exitedClassName={(timeout: number) =>
      css({
        opacity: 0,
        transform: `translateY(${-12}px)`,
        transition: `opacity ${timeout}ms cubic-bezier(0.4, 0.0, 0.2, 1), transform ${timeout}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
      })
    }
  />
)

Transition.displayName = 'Transition'

export const SelectField: FC<
  SelectFieldProps<SelectFieldItemModel<any>, any>
> = (props) =>
  props.stub ? (
    <InputField
      active={false}
      input={false}
      title={props.title}
      error={props.error}
      stub
    />
  ) : (
    <SelectFieldControl
      value={props.value}
      items={props.items}
      disabled={props.disabled}
      equals={props.equals}
      onChange={props.onChange}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onHide={props.onHide}
      children={(renderProps) => (
        <MenuControl
          count={props.items.length}
          selected={renderProps.select}
          onKeyDown={renderProps.onKeyDown}
          onSelect={renderProps.onItemSelect}
          children={(menuRenderProps) => (
            <CardPos
              {...getDataProps(props)}
              ref={renderProps.containerRef}
              type="relative"
            >
              <Box ref={renderProps.targetRef}>
                <Pos
                  type="absolute"
                  top={4}
                  right={0}
                  children={<Icon name="angle-down" color="#000" />}
                  transform={`rotate(${renderProps.show ? 180 : 0}deg)`}
                  transition="transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)"
                />
                <InputField
                  title={props.title}
                  active={renderProps.select !== undefined}
                  error={props.error}
                  input={
                    <SelectInput
                      value={
                        renderProps.select !== undefined &&
                        props.items[renderProps.select]
                          ? props.items[renderProps.select].text
                          : ''
                      }
                      focused={renderProps.focused}
                      error={!!props.error}
                      tabIndex={props.tabIndex}
                      disabled={props.disabled}
                      autoFocus={props.autoFocus}
                      name={props.name}
                      onFocus={renderProps.onFocus}
                      onBlur={renderProps.onBlur}
                      onKeyDown={
                        renderProps.show
                          ? menuRenderProps.onKeyDown
                          : renderProps.onKeyDown
                      }
                      onClick={renderProps.onActive}
                    />
                  }
                />
              </Box>
              <Overlay
                show={renderProps.show}
                placement="bottom"
                target={() => renderProps.targetRef.current!}
                container={() => renderProps.containerRef.current}
                transition={Transition}
                popperConfig={{
                  modifiers: [
                    {
                      name: 'preventOverflow',
                      enabled: false,
                    },
                  ],
                }}
                children={(overlayRenderProps) => (
                  <CardPos
                    ref={overlayRenderProps.props.ref}
                    css={overlayRenderProps.props.style}
                    height={1}
                    width="calc(100% + 48px)"
                    mt={-2}
                    zIndex={999}
                  >
                    <CardPos
                      ref={menuRenderProps.containerRef}
                      r="10px"
                      s="0 20px 64px 0 rgba(0, 0, 0, 0.16)"
                      bg="#fff"
                      overflow="auto"
                      minHeight={1}
                      maxHeight={104}
                      pt={3}
                      pb={3}
                    >
                      {menuRenderProps.items.map((item, key) => (
                        <CardMenuItem
                          key={key}
                          ref={item.ref}
                          cursor="pointer"
                          text={props.items[key].text}
                          hover={item.focused}
                          active={item.selected}
                          focus={item.selected}
                          onClick={item.onClick}
                          onMouseDown={item.onMouseDown}
                          onMouseEnter={item.onMouseEnter}
                        />
                      ))}
                    </CardPos>
                  </CardPos>
                )}
              />
            </CardPos>
          )}
        />
      )}
    />
  )

SelectField.displayName = 'SelectField'
