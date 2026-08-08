"use client";

import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

/**
 * Embedded Sanity Studio — open /studio after logging in with the Sanity
 * account that owns the project. Invite dad/employees as Editors in the
 * Sanity project settings.
 */
export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div className="flex h-full items-center justify-center bg-sand-50 p-8 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-ink-900">
            Catalogue editor not connected yet
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-sand-600">
            Create a Sanity project, set{" "}
            <code className="rounded bg-sand-200 px-1.5 py-0.5 text-[13px]">
              NEXT_PUBLIC_SANITY_PROJECT_ID
            </code>{" "}
            in the environment, then redeploy. See the README section
            “Updating the product catalogue”.
          </p>
        </div>
      </div>
    );
  }

  return <NextStudio config={config} />;
}
