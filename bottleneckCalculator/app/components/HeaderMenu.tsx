"use client"

import {
  IconCommandRegular,
  IconDashboard,
  IconDeviceDesktop,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
} from "justd-icons"
import { useTheme } from "next-themes"
import { signIn, signOut, useSession } from "next-auth/react"
import { Avatar, Menu } from "./ui"

export function HeaderMenu() {
  const { resolvedTheme, setTheme } = useTheme()
  const { data: session } = useSession()
  
  // If not signed in, show sign in button
  if (!session) {
    return (
      <button 
        onClick={() => signIn("google")}
        className="rounded-md px-3 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90"
      >
        Sign In
      </button>
    )
  }
  
  return (
    <Menu>
      <Menu.Trigger aria-label="Open Menu">
        <Avatar 
          alt={session.user?.name || "User"} 
          size="large" 
          src={session.user?.image || "/images/avatar/default.jpg"} 
        />
      </Menu.Trigger>
      <Menu.Content placement="bottom" showArrow className="sm:min-w-64">
        <Menu.Header separator>
          <span className="block">{session.user?.name}</span>
          <span className="font-normal text-muted-fg">{session.user?.email}</span>
        </Menu.Header>

        <Menu.Section>
          <Menu.Item href="#dashboard">
            <IconDashboard />
            <span className="menu-label">Dashboard</span>
          </Menu.Item>
          <Menu.Item href="#settings">
            <IconSettings />
            <span className="menu-label">Settings</span>
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
