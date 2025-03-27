"use client"
import * as React from "react"
import { cn } from "@/utils/classes"
import { IconBulletFill, IconCheck, IconChevronLgRight } from "justd-icons"
import type {
  MenuItemProps as MenuItemPrimitiveProps,
  MenuProps as MenuPrimitiveProps,
  ButtonProps,
  MenuSectionProps,
  MenuTriggerProps as MenuTriggerPrimitiveProps,
  PopoverProps,
  SeparatorProps
} from "react-aria-components"
import {
  Button,
  Collection,
  composeRenderProps,
  Header,
  Menu as MenuPrimitive,
  MenuItem,
  MenuSection,
  MenuTrigger as MenuTriggerPrimitive,
  Separator,
  SubmenuTrigger as SubmenuTriggerPrimitive
} from "react-aria-components"
import type { VariantProps } from "tailwind-variants"
import { tv } from "tailwind-variants"
import { DropdownItemDetails, dropdownItemStyles, dropdownSectionStyles } from "./dropdown"
import { Keyboard } from "./keyboard"
import { Popover } from "./popover"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

// Create a context to share theme information and positioning throughout the menu components
interface MenuContextProps {
  respectScreen: boolean;
  isDarkTheme: boolean;
  customOffset?: {
    x?: number;
  };
}

const MenuContext = React.createContext<MenuContextProps>({ 
  respectScreen: true,
  isDarkTheme: false
})

interface MenuProps extends MenuTriggerPrimitiveProps {
  respectScreen?: boolean;
  customOffset?: {
    x?: number;
  };
}

const Menu = ({ respectScreen = true, customOffset, ...props }: MenuProps) => {
  // Add theme awareness
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Ensure we only render theme-specific elements after component mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Theme-aware styling
  const isDarkTheme = mounted && resolvedTheme === 'dark';
  
  return (
    <MenuContext.Provider value={{ respectScreen, isDarkTheme, customOffset }}>
      <MenuTriggerPrimitive {...props}>{props.children}</MenuTriggerPrimitive>
    </MenuContext.Provider>
  )
}

const SubMenu = ({ delay = 0, ...props }) => (
  <SubmenuTriggerPrimitive {...props} delay={delay}>
    {props.children}
  </SubmenuTriggerPrimitive>
)

const menuStyles = tv({
  slots: {
    menu: "z32kk max-h-[calc(var(--visual-viewport-height)-10rem)] sm:max-h-[inherit] overflow-auto rounded-xl p-1 outline outline-0 [clip-path:inset(0_0_0_0_round_calc(var(--radius)-2px))]",
    popover: "z-50 min-w-40 p-0 outline-none shadow-sm",
    trigger: [
      "inline relative text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-primary pressed:outline-none"
    ]
  }
})

const { menu, popover, trigger } = menuStyles()

interface MenuTriggerProps extends ButtonProps {
  className?: string
}

const Trigger = ({ className, ...props }: MenuTriggerProps) => (
  <Button className={trigger({ className })} {...props}>
    {(values) => (
      <>{typeof props.children === "function" ? props.children(values) : props.children}</>
    )}
  </Button>
)

interface MenuContentProps<T>
  extends Omit<PopoverProps, "children" | "style">,
    MenuPrimitiveProps<T> {
  className?: string
  popoverClassName?: string
  showArrow?: boolean
  respectScreen?: boolean
  alignWithTrigger?: boolean
  offset?: number
  style?: React.CSSProperties
}

const Content = <T extends object>({
  className,
  showArrow = false,
  popoverClassName,
  alignWithTrigger = false,
  offset,
  style,
  ...props
}: MenuContentProps<T>) => {
  const { respectScreen, isDarkTheme, customOffset } = React.useContext(MenuContext)
  
  // Add theme-aware classes
  const themeClass = isDarkTheme 
    ? 'bg-gray-800 text-gray-100' 
    : 'bg-white text-gray-900'
  
  // Combine custom styles with any offset adjustments
  const combinedStyles = {
    ...style,
    // Apply a more fine-grained adjustment for the offset
    ...(customOffset?.x !== undefined && alignWithTrigger ? { 
      '--custom-offset-x': `${customOffset.x}%`,
      // This allows for more precise control
      marginLeft: `var(--custom-offset-x)`
    } : {})
  }
  
  return (
    <Popover.Content
      respectScreen={respectScreen}
      showArrow={showArrow}
      offset={offset}
      style={combinedStyles}
      className={popover({
        className: cn([
          showArrow && "placement-left:mt-[-0.38rem] placement-right:mt-[-0.38rem]",
          themeClass,
          popoverClassName
        ])
      })}
      {...props}
    >
      <MenuPrimitive className={menu({ className: cn(className) })} {...props} />
    </Popover.Content>
  )
}

interface MenuItemProps
  extends Omit<MenuItemPrimitiveProps, "isDanger">,
    VariantProps<typeof dropdownItemStyles> {
  isDanger?: boolean
}

const Item = ({ className, isDanger = false, children, ...props }: MenuItemProps) => {
  const { isDarkTheme } = React.useContext(MenuContext)
  const textValue = props.textValue || (typeof children === "string" ? children : undefined)
  
  return (
    <MenuItem
      className={composeRenderProps(className, (className, renderProps) =>
        dropdownItemStyles({
          ...renderProps,
          className: cn(
            className,
            isDarkTheme && 'hover:bg-gray-700 active:bg-gray-700'
          )
        })
      )}
      textValue={textValue}
      data-danger={isDanger ? "true" : undefined}
      {...props}
    >
      {(values) => (
        <>
          {typeof children === "function" ? children(values) : children}
          {values.hasSubmenu && <IconChevronLgRight className="gpfw ml-auto size-3.5" />}
        </>
      )}
    </MenuItem>
  )
}

export interface MenuHeaderProps extends React.ComponentProps<typeof Header> {
  separator?: boolean
}

const MenuHeader = ({ className, separator = false, ...props }: MenuHeaderProps) => {
  const { isDarkTheme } = React.useContext(MenuContext)
  
  return (
    <Header
      className={cn(
        "p-2 text-base font-semibold sm:text-sm",
        separator && "-mx-1 border-b px-3 pb-[0.625rem]",
        isDarkTheme && separator && "border-gray-700",
        className
      )}
      {...props}
    />
  )
}

const MenuSeparator = ({ className, ...props }: SeparatorProps) => {
  const { isDarkTheme } = React.useContext(MenuContext)
  
  return (
    <Separator 
      className={cn(
        "-mx-1 my-1 h-px border-b", 
        isDarkTheme ? "border-gray-700" : "border-gray-200",
        className
      )} 
      {...props} 
    />
  )
}

const Checkbox = ({ className, children, ...props }: MenuItemProps) => (
  <Item className={cn("relative pr-8", className)} {...props}>
    {(values) => (
      <>
        {typeof children === "function" ? children(values) : children}
        {values.isSelected && (
          <span className="absolute right-2 flex size-4 shrink-0 items-center animate-in justify-center">
            <IconCheck />
          </span>
        )}
      </>
    )}
  </Item>
)

const Radio = ({ className, children, ...props }: MenuItemProps) => (
  <Item className={cn("relative", className)} {...props}>
    {(values) => (
      <>
        {typeof children === "function" ? children(values) : children}
        {values.isSelected && (
          <span
            data-slot="menu-radio"
            className="absolute right-3 flex items-center animate-in justify-center"
          >
            <IconBulletFill />
          </span>
        )}
      </>
    )}
  </Item>
)

const { section, header } = dropdownSectionStyles()

interface SectionProps<T> extends MenuSectionProps<T> {
  title?: string
}

const Section = <T extends object>({ className, ...props }: SectionProps<T>) => {
  return (
    <MenuSection className={section({ className })} {...props}>
      {"title" in props && <Header className={header()}>{props.title}</Header>}
      <Collection items={props.items}>{props.children}</Collection>
    </MenuSection>
  )
}

Menu.Primitive = MenuPrimitive
Menu.Content = Content
Menu.Header = MenuHeader
Menu.Item = Item
Menu.Content = Content
Menu.Keyboard = Keyboard
Menu.Checkbox = Checkbox
Menu.Radio = Radio
Menu.Section = Section
Menu.Separator = MenuSeparator
Menu.Trigger = Trigger
Menu.ItemDetails = DropdownItemDetails
Menu.Submenu = SubMenu

export { Menu, type MenuContentProps }
