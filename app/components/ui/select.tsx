"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false)
  
  React.useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    
    checkTouch()
    window.addEventListener('resize', checkTouch)
    
    return () => window.removeEventListener('resize', checkTouch)
  }, [])
  
  return isTouchDevice
}

interface SelectItemData {
  value: string
  label: string
  disabled?: boolean
}

interface HybridSelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  items?: SelectItemData[]
  useNative?: boolean
  name: string;
}

const HybridSelect = React.forwardRef<HTMLElement, HybridSelectProps>(
  ({ name, value, defaultValue, onValueChange, placeholder, disabled, className, children, items, useNative, ...props }, ref) => {
    const isTouchDevice = useIsTouchDevice()
    const shouldUseNative = useNative || isTouchDevice

    // Extract options from SelectItem children - always call hooks at top level
    const selectItems = React.useMemo(() => {
      if (items && items.length > 0) {
        return items
      }

      const extractedItems: SelectItemData[] = []
      
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          // Handle SelectContent wrapper
          if (child.type === SelectContent) {
            React.Children.forEach(child.props.children, (contentChild) => {
              if (React.isValidElement(contentChild) && contentChild.type === SelectItem) {
                const childProps = contentChild.props as any
                extractedItems.push({
                  value: childProps.value,
                  label: typeof childProps.children === 'string' 
                    ? childProps.children 
                    : childProps.value,
                  disabled: childProps.disabled
                })
              }
            })
          }
          // Handle direct SelectItem children
          else if (child.type === SelectItem) {
            const childProps = child.props as any
            extractedItems.push({
              value: childProps.value,
              label: typeof childProps.children === 'string' 
                ? childProps.children 
                : childProps.value,
              disabled: childProps.disabled
            })
          }
        }
      })

      return extractedItems
    }, [items, children])

    if (shouldUseNative) {
      return (
        <NativeSelect
          ref={ref as React.RefObject<HTMLSelectElement>}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn('w-full', className)}
          name={name}
        >
          {selectItems.map((item) => (
            <option key={item.value} value={item.value} disabled={item.disabled}>
              {item.label}
            </option>
          ))}
        </NativeSelect>
      )
    }

    return (
      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
        {...props}
      >
        {children}
      </SelectPrimitive.Root>
    )
  }
)
HybridSelect.displayName = "HybridSelect"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode
  onValueChange?: (value: string) => void
  value?: string
  defaultValue?: string
  placeholder?: string
}

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, onValueChange, value, defaultValue, placeholder, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onValueChange?.(e.target.value)
      onChange?.(e)
    }

    return (
      <div className="relative w-full">
        <select
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
      </div>
    )
  }
)
NativeSelect.displayName = "NativeSelect"

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  useNative?: boolean
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, useNative, ...props }, ref) => {
  const isTouchDevice = useIsTouchDevice()
  
  if (useNative || isTouchDevice) {
    return null
  }

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={(ref) => ref?.addEventListener('touchend', (e) => e.preventDefault())}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-base font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-base outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  NativeSelect,
  HybridSelect,
  useIsTouchDevice,
}
