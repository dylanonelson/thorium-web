"use client";

import { Link } from "react-aria-components";
import { MANIFEST_CONFIG } from "@/config/manifest";

export default function Home() {
  return (
    <main>
      <h1>Welcome to Thorium Web (Under Development)</h1>

      <p>Here’s a list of reflowable and fixed-layout publications you can read and test:</p>

      <ul>
        <li>
          <Link href="/read/moby-dick">Moby Dick (reflow)</Link>
        </li>
        <li>
          <Link href="/read/the-house-of-seven-gables">The House of the Seven Gables (reflow advanced)</Link>
        </li>
        <li>
          <Link href="/read/les-diaboliques">Les Diaboliques (reflow french)</Link>
        </li>
        <li>
          <Link href="/read/bella-the-dragon">Bella the Dragon (FXL)</Link>
        </li>
      </ul>

      {MANIFEST_CONFIG.enabled && (
        <>
          <p>Or use an arbitrary manifest:</p>
          <ul>
            <li>
              <Link href="/read/manifest/https%3A%2F%2Fpublication-server.readium.org%2FaHR0cHM6Ly9naXRodWIuY29tL0lEUEYvZXB1YjMtc2FtcGxlcy9yZWxlYXNlcy9kb3dubG9hZC8yMDIzMDcwNC9hY2Nlc3NpYmxlX2VwdWJfMy5lcHVi%2Fmanifest.json">Accessible EPUB3</Link>
            </li>
            <li>
              <Link href="/read/manifest/https%3A%2F%2Fpublication-server.readium.org%2FaHR0cHM6Ly9naXRodWIuY29tL0lEUEYvZXB1YjMtc2FtcGxlcy9yZWxlYXNlcy9kb3dubG9hZC8yMDIzMDcwNC9jaGlsZHJlbnMtbGl0ZXJhdHVyZS5lcHVi%2Fmanifest.json">Children Literature</Link>
            </li>
          </ul>
        </>
      )}
    </main>
  );
}
