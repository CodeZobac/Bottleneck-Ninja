/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { Card } from "../../components/ui/card";
import { Heading } from "../../components/ui/heading";
import Link from "next/link";
import { HeaderLogo } from "../../components/HeaderLogo";
import CookieManager from "../../components/CookieManager";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/">
          <HeaderLogo style={{ cursor: 'pointer' }} />
        </Link>
      </div>
      
      <Heading level={1} className="mb-6 text-center">
        Privacy Policy
      </Heading>
      
      <Card className="p-6 mb-8">
        <Heading level={2} className="mb-4">
          Last Updated: March 27, 2025
        </Heading>

        <div className="space-y-4">
          <p>
            Bottleneck Ninja ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you visit our website or use our services.
          </p>
          
          <Heading level={3} className="mt-6">1. Information We Collect</Heading>
          
          <Heading level={4} className="mt-4">1.1. Personal Data</Heading>
          <p>
            We may collect personal identification information, including but not limited to:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Authentication data (if you create an account)</li>
          </ul>
          
          <Heading level={4} className="mt-4">1.2. Usage Data</Heading>
          <p>
            We may also collect information on how the website is accessed and used. This usage data may include:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Your computer's Internet Protocol address (e.g., IP address)</li>
            <li>Browser type and version</li>
            <li>Pages of our website that you visit</li>
            <li>Time and date of your visit</li>
            <li>Time spent on those pages</li>
            <li>Other diagnostic data</li>
          </ul>

          <Heading level={3} className="mt-6">2. How We Use Your Information</Heading>
          <p>We use the collected data for various purposes:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our service</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent, and address technical issues</li>
          </ul>

          <Heading level={3} className="mt-6">3. Cookies and Tracking Technologies</Heading>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and store certain information. 
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
            For more information about the cookies we use, please see our <CookieManager><a href="/policies/cookies" className="text-blue-600 hover:underline">Cookie Policy</a></CookieManager>.
          </p>
          
          <Heading level={3} className="mt-6">4. Legal Basis for Processing (EU Users)</Heading>
          <p>
            Under the General Data Protection Regulation (GDPR), we collect and process your personal data with the following legal bases:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Consent:</strong> You have given us permission to process your personal data for specific purposes</li>
            <li><strong>Legitimate Interests:</strong> Processing your data is necessary for our legitimate interests and your rights do not override these interests</li>
            <li><strong>Contract:</strong> Processing is necessary for a contract with you or to take steps at your request before entering into a contract</li>
          </ul>

          <Heading level={3} className="mt-6">5. Your Data Protection Rights</Heading>
          <p>
            Under the GDPR, you have certain rights regarding your personal data:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Right to access:</strong> You have the right to request copies of your personal data</li>
            <li><strong>Right to rectification:</strong> You have the right to request that we correct inaccurate or complete incomplete information</li>
            <li><strong>Right to erasure:</strong> You have the right to request that we erase your personal data in certain circumstances</li>
            <li><strong>Right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data</li>
            <li><strong>Right to data portability:</strong> You have the right to request that we transfer your data to another organization or directly to you</li>
            <li><strong>Right to object:</strong> You have the right to object to our processing of your personal data</li>
          </ul>

          <Heading level={3} className="mt-6">6. Third-Party Services</Heading>
          <p>
            We may employ third-party companies and individuals due to the following reasons:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>To facilitate our service</li>
            <li>To provide the service on our behalf</li>
            <li>To perform service-related services</li>
            <li>To assist us in analyzing how our service is used</li>
          </ul>
          <p className="mt-2">
            These third parties have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>

          <Heading level={3} className="mt-6">7. Data Retention</Heading>
          <p>
            We will retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. 
            We will retain and use your personal data to the extent necessary to comply with our legal obligations, 
            resolve disputes, and enforce our legal agreements and policies.
          </p>

          <Heading level={3} className="mt-6">8. Data Transfers</Heading>
          <p>
            Your information, including personal data, may be transferred to — and maintained on — computers located outside of your state, 
            province, country or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction.
          </p>
          <p className="mt-2">
            If you are located outside the United States and choose to provide information to us, please note that we transfer the data, 
            including personal data, to the United States and process it there.
          </p>
          
          <Heading level={3} className="mt-6">9. Children's Privacy</Heading>
          <p>
            Our service does not address anyone under the age of 16. We do not knowingly collect personal data from children under 16. 
            If we discover that a child under 16 has provided us with personal data, we will delete such information from our servers immediately.
          </p>

          <Heading level={3} className="mt-6">10. Changes to This Privacy Policy</Heading>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <Heading level={3} className="mt-6">11. Contact Us</Heading>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@bottleneck-ninja.com.
          </p>
        </div>
      </Card>
    </div>
  );
}