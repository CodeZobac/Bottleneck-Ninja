"use client"

import {
  IconCirclePerson,
  IconCommandRegular,
  IconDeviceDesktop,
  IconLogout,
  IconMacbook,
  IconMoon,
  IconSun,
} from "justd-icons"
import { useTheme } from "next-themes"
import { signIn, signOut, useSession } from "next-auth/react"
import { Avatar, Menu } from "./ui"



export function HeaderMenu() {
  const { resolvedTheme, setTheme } = useTheme()
  const { data: session } = useSession()
  
  // If not signed in, show guest menu
  if (!session) {
    return (
      <Menu>
        <Menu.Trigger aria-label="Open Menu">
          <Avatar 
            alt="Guest" 
            size="large" 
            src="/icon.jpg"
            className="bg-gray-200 w-12 h-12 mr-[100px]"
          />
        </Menu.Trigger>
        <Menu.Content placement="bottom" showArrow className="sm:min-w-64">
          <Menu.Header separator>
            <span className="block">Guest</span>
            <span className="font-normal text-muted-fg">Not signed in</span>
          </Menu.Header>

          <Menu.Submenu>
            <Menu.Item>
              {resolvedTheme === "light" ? (
                <IconSun />
              ) : resolvedTheme === "dark" ? (
                <IconMoon />
              ) : (
                <IconDeviceDesktop />
              )}
              <span className="menu-label">Switch theme</span>
            </Menu.Item>
            <Menu.Content>
              <Menu.Item onAction={() => setTheme("system")}>
                <IconDeviceDesktop /> System
              </Menu.Item>
              <Menu.Item onAction={() => setTheme("dark")}>
                <IconMoon /> Dark
              </Menu.Item>
              <Menu.Item onAction={() => setTheme("light")}>
                <IconSun /> Light
              </Menu.Item>
            </Menu.Content>
          </Menu.Submenu>
          <Menu.Separator />
          <Menu.Item onAction={() => signIn("google")}>
            <span className="menu-label">Sign In / Register</span>
          </Menu.Item>
        </Menu.Content>
      </Menu>
    )
  }
  
  return (
    <Menu>
      <Menu.Trigger aria-label="Open Menu">
        <Avatar 
          alt={session.user?.name || "User"} 
          size="large" 
          src={session.user?.image}
          className="bg-gray-200 w-12 h-12 mr-[100px]" 
        />
      </Menu.Trigger>
      <Menu.Content placement="bottom" showArrow className="sm:min-w-64">
        <Menu.Header separator>
          <span className="block">{session.user?.name}</span>
          <span className="font-normal text-muted-fg">{session.user?.email}</span>
        </Menu.Header>

        <Menu.Section>
          <Menu.Item href="/builds">
            <IconMacbook />
            <span className="menu-label">My Builds</span>
          </Menu.Item>
          <Menu.Item href="/profile">
            <IconCirclePerson />
            <span className="menu-label">Profile</span>
          </Menu.Item>
        </Menu.Section>
        <Menu.Separator />
        <Menu.Item>
          <IconCommandRegular />
          <span className="menu-label">Command Menu</span>
        </Menu.Item>
        <Menu.Submenu>
          <Menu.Item>
            {resolvedTheme === "light" ? (
              <IconSun />
            ) : resolvedTheme === "dark" ? (
              <IconMoon />
            ) : (
              <IconDeviceDesktop />
            )}
            <span className="menu-label">Switch theme</span>
          </Menu.Item>
          <Menu.Content>
            <Menu.Item onAction={() => setTheme("system")}>
              <IconDeviceDesktop /> System
            </Menu.Item>
            <Menu.Item onAction={() => setTheme("dark")}>
              <IconMoon /> Dark
            </Menu.Item>
            <Menu.Item onAction={() => setTheme("light")}>
              <IconSun /> Light
            </Menu.Item>
          </Menu.Content>
        </Menu.Submenu>
        <Menu.Separator />
        <Menu.Item href="#contact-s">
          <span className="menu-label">Contact Support</span>
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item onAction={() => signOut()}>
          <IconLogout />
          <span className="menu-label">Log out</span>
        </Menu.Item>
      </Menu.Content>
    </Menu>
  )
}
