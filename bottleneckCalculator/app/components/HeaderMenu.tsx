"use client"

import {
  IconCommandRegular,
  IconDashboard,
  IconDeviceDesktop,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
  IconAnonymous,
} from "justd-icons"
import { useTheme } from "next-themes"
import { signIn, signOut, useSession } from "next-auth/react"
import { Avatar, Menu } from "./ui"



export function HeaderMenu() {
  const { resolvedTheme, theme, setTheme } = useTheme()
  const { data: session } = useSession()
  
  console.log("Current theme:", theme, "Resolved theme:", resolvedTheme);
  
  // If not signed in, show guest menu
  if (!session) {
    return (
      <Menu>
        <Menu.Trigger aria-label="Open Menu">
          <Avatar 
            alt="Guest" 
            size="large" 
            src="/icon.jpg"
            className="bg-gray-200 w-12 h-12"
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
