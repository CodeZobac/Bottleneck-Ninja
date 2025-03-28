"use client";

import React from "react";
import dynamic from "next/dynamic";
import "react-cookie-manager/style.css";

const CookieManagerComponent = dynamic(
  () => import("react-cookie-manager").then((mod) => mod.CookieManager),
  { ssr: false, loading: () => null }
);

export function CookieManager({ children }: { children: React.ReactNode }) {
  return (
    <CookieManagerComponent
      showManageButton={true}
      translations={{
        title: "Cookie Preferences",
        message: "We use cookies to enhance your browsing experience and analyze our traffic. Please select which cookies you consent to.",
        buttonText: "Accept All",
        declineButtonText: "Necessary Only",
        manageButtonText: "Manage Cookies",
        privacyPolicyText: "Privacy Policy",
      }}
      privacyPolicyUrl="/policies/privacy"
      displayType="banner"
      theme="light"
      enableFloatingButton={true}
      onManage={(preferences) => {
        if (preferences) {
          console.log("Cookie preferences updated:", preferences);
          // Here you can add logic to handle cookie preferences
          // For example, enabling/disabling analytics
        }
      }}
    >
      {children}
    </CookieManagerComponent>
  );
}

export default CookieManager;