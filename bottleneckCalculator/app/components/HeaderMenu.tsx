"use client"

import {
  IconCirclePerson,
  IconLogout,
  IconMacbook,
  IconMoon,
  IconSun,
  IconTrash,
} from "justd-icons"
import { useTheme } from "next-themes"
import { signIn, signOut, useSession } from "next-auth/react"
import { Avatar, Menu } from "./ui"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { ConfirmationModal } from "./ConfirmationModal"
import { useToast } from "./ui/toast"

export function HeaderMenu() {
  const { resolvedTheme, setTheme } = useTheme()
  const { data: session } = useSession()
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const toast = useToast()
  
  // Create prefetch handlers
  const prefetchBuilds = useCallback(() => {
    router.prefetch('/builds')
    console.log('Prefetching /builds page')
  }, [router])
  
  const prefetchProfile = useCallback(() => {
    router.prefetch('/profile')
    console.log('Prefetching /profile page')
  }, [router])

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true)
      
      const response = await fetch('/api/profile', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete account')
      }
      
      // Show success message
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted",
        variant: "success",
      })
      
      // Sign out and redirect to home page
      signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete account",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }
  
  // If not signed in, show guest menu
  if (!session) {
    return (
      <Menu customOffset={{ x: -5 }}>
        <Menu.Trigger aria-label="Open Menu">
          <Avatar 
            alt="Guest" 
            size="large" 
            src="/icon.jpg"
            className="bg-gray-200 w-12 h-12 mr-[100px]"
          />
        </Menu.Trigger>
        <Menu.Content 
          placement="bottom" 
          showArrow={false} // Removing the arrow for cleaner appearance
          offset={15}
          alignWithTrigger
          className="sm:min-w-64"
        >
          <Menu.Header separator>
            <span className="block">Guest</span>
            <span className="font-normal text-muted-fg">Not signed in</span>
          </Menu.Header>

          <Menu.Submenu>
            <Menu.Item>
              {resolvedTheme === "light" ? (
                <IconSun />
              ) : (
                <IconMoon />
              )}
              <span className="menu-label">Switch theme</span>
            </Menu.Item>
            <Menu.Content>
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
    <>
      <Menu customOffset={{ x: -5 }}>
        <Menu.Trigger aria-label="Open Menu">
          <Avatar 
            alt={session.user?.name || "User"} 
            size="large" 
            src={session.user?.image}
            className="bg-gray-200 w-12 h-12 mr-[100px]" 
          />
        </Menu.Trigger>
        <Menu.Content 
          placement="bottom" 
          showArrow={false}
          offset={15}
          alignWithTrigger
          className="sm:min-w-64"
        >
          <Menu.Header separator>
            <span className="block">{session.user?.name}</span>
            <span className="font-normal text-muted-fg">{session.user?.email}</span>
          </Menu.Header>
          <Menu.Section>
            <Menu.Item 
              href="/builds"
              onHoverStart={prefetchBuilds}
            >
              <IconMacbook />
              <span className="menu-label">My Builds</span>
            </Menu.Item>
            <Menu.Item 
              href="/profile"
              onHoverStart={prefetchProfile}
            >
              <IconCirclePerson />
              <span className="menu-label">Profile</span>
            </Menu.Item>
          </Menu.Section>
          <Menu.Separator />
          <Menu.Submenu>
            <Menu.Item>
              {resolvedTheme === "light" ? (
                <IconSun />
              ) : (
                <IconMoon />
              )}
              <span className="menu-label">Switch theme</span>
            </Menu.Item>
            <Menu.Content>
              <Menu.Item onAction={() => setTheme("dark")}>
                <IconMoon /> Dark
              </Menu.Item>
              <Menu.Item onAction={() => setTheme("light")}>
                <IconSun /> Light
              </Menu.Item>
            </Menu.Content>
          </Menu.Submenu>
          <Menu.Item href="#contact-s">
            <span className="menu-label">Contact Support</span>
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item 
            onAction={() => setShowDeleteModal(true)}
            className="text-red-400 hover:bg-red-50/30 hover:text-red-500 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
          >
            <IconTrash className="text-red-400 dark:text-red-400" />
            <span className="menu-label">Delete Account</span>
          </Menu.Item>
          <Menu.Item onAction={() => signOut()}>
            <IconLogout />
            <span className="menu-label">Log out</span>
          </Menu.Item>
        </Menu.Content>
      </Menu>
      
      <ConfirmationModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
        confirmButtonText={isDeleting ? "Deleting..." : "Delete Account"}
        confirmButtonIntent="danger"
        cancelButtonText="Cancel"
        icon="error"
      />
    </>
  )
}
