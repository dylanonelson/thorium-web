"use client";

import { use } from "react";
import { StatefulReader } from "@/components/Epub";
import { StatefulLoader } from "@/components/StatefulLoader";
import { usePublication } from "@/hooks/usePublication";
import { MANIFEST_CONFIG } from "@/config/manifest";

import "@/app/app.css";

type Params = { manifest: string };

type Props = {
  params: Promise<Params>;
};

function ManifestContent({ manifestUrl }: { manifestUrl: string }) {
  const { error, manifest, selfLink, isLoading } = usePublication({
    url: manifestUrl,
    onError: (error) => {
      console.error("Manifest loading error:", error);
    }
  });

  return (
    <>
      { error ? (
        <div className="container">
          <h1>Error</h1>
          <p>{ error }</p>
        </div>
      ) : (
        <StatefulLoader isLoading={ isLoading }>
          { manifest && selfLink && <StatefulReader rawManifest={ manifest } selfHref={ selfLink } /> }
        </StatefulLoader>
      )}
    </>
  );
}

export default function ManifestPage({ params }: Props) {
  const isProduction = process.env.NODE_ENV === "production";
  const isManifestEnabled = !isProduction || MANIFEST_CONFIG.enabled;

  if (isProduction && !isManifestEnabled) {
    return (
      <div className="container">
        <h1>Manifest route is disabled in production mode</h1>
        <p>To enable manifest access in production, set <code>NEXT_PUBLIC_MANIFEST_FORCE_ENABLE=true</code> in your environment variables.</p>
      </div>
    );
  }

  const manifestUrl = use(params).manifest;
  return <ManifestContent manifestUrl={ manifestUrl } />;
}
