/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { useCookieConsent } from "react-cookie-manager";
import { Card } from "../../components/ui/card";
import { Heading } from "../../components/ui/heading";
import Link from "next/link";
import { HeaderLogo } from "../../components/HeaderLogo";
import CookieManager from "../../components/CookieManager";

export default function CookiePolicyPage() {
  return (
    <CookieManager>
      <CookieContent />
    </CookieManager>
  );
}

function CookieContent() {
  const { showConsentBanner } = useCookieConsent();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/">
          <HeaderLogo style={{ cursor: 'pointer' }} />
        </Link>
      </div>
      
      <Heading level={1} className="mb-6 text-center">
        Cookie Policy
      </Heading>
      
      <Card className="p-6 mb-8">
        <Heading level={2} className="mb-4">
          Last Updated: March 27, 2025
        </Heading>

        <div className="space-y-4">
          <p>
            This Cookie Policy explains how Bottleneck Ninja ("we", "us", or "our") uses cookies and similar technologies on our website. 
            This policy is designed to comply with the EU General Data Protection Regulation (GDPR) and the ePrivacy Directive.
          </p>
          
          <Heading level={3} className="mt-6">1. What are Cookies?</Heading>
          <p>
            Cookies are small text files that are placed on your device when you visit our website. 
            They are widely used to make websites work more efficiently and provide information to the website owners.
          </p>

          <Heading level={3} className="mt-6">2. Types of Cookies We Use</Heading>
          <p>We use the following types of cookies on our website:</p>
          
          <Heading level={4} className="mt-4">2.1. Essential Cookies</Heading>
          <p>
            These cookies are necessary for the website to function properly. They enable core functionality such as user authentication, 
            security, and session management. You cannot opt out of these cookies as the website cannot function properly without them.
          </p>
          <p>Specifically, we use:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Next-Auth cookies for authentication and session management</li>
          </ul>

          <Heading level={4} className="mt-4">2.2. Analytics Cookies</Heading>
          <p>
            These cookies collect information about how you use our website, such as which pages you visited and which links you clicked on.
            All information collected is aggregated and anonymous. It helps us improve our website and user experience.
          </p>
          <p>Specifically, we use:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Vercel Analytics to gather anonymized usage statistics</li>
          </ul>

          <Heading level={4} className="mt-4">2.3. Functional Cookies</Heading>
          <p>
            These cookies enable enhanced functionality and personalization, such as remembering your preferences.
          </p>

          <Heading level={3} className="mt-6">3. How to Manage Cookies</Heading>
          <p>
            You can manage your cookie preferences through our cookie consent banner or by clicking the button below:
          </p>
          
          <div className="mt-4">
            <button 
              onClick={showConsentBanner}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Manage Cookie Preferences
            </button>
          </div>
          
          <p className="mt-4">
            You can also control cookies through your browser settings. Please note that disabling certain cookies may impact the functionality of our website.
          </p>

          <Heading level={3} className="mt-6">4. Third-Party Cookies</Heading>
          <p>
            Some cookies are placed by third parties on our behalf. These third parties may include analytics providers and functionality providers.
          </p>

          <Heading level={3} className="mt-6">5. Data Retention</Heading>
          <p>
            The cookies we use have various expiration dates. Essential cookies related to authentication typically expire when you close your browser or within a short period after (session cookies), 
            while preference-setting cookies may last longer to remember your choices.
          </p>

          <Heading level={3} className="mt-6">6. Updates to This Policy</Heading>
          <p>
            We may update this Cookie Policy from time to time. Any changes will be posted on this page with a revised "Last Updated" date.
          </p>

          <Heading level={3} className="mt-6">7. Contact Us</Heading>
          <p>
            If you have any questions about our use of cookies, please contact us at support@bottleneck-ninja.com.
          </p>
        </div>
      </Card>
    </div>
  );
}