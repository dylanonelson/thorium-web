"use client";

import { Link } from "react-aria-components";
import { MANIFEST_CONFIG } from "@/config/manifest";

import { PublicationGrid } from "@/components/PublicationGrid";

const books = [
  {
    title: "Moby Dick",
    author: "Herman Melville",
    cover: "/images/MobyDick.jpg",
    url: "/read/moby-dick",
    rendition: "Reflowable"
  },
  {
    title: "The House of the Seven Gables",
    author: "Nathaniel Hawthorne",
    cover: "/images/TheHouseOfTheSevenGables.jpg",
    url: "/read/the-house-of-seven-gables",
    rendition: "Reflowable"
  },
  {
    title: "Les Diaboliques",
    author: "Jules Barbey d'Aurevilly",
    cover: "/images/LesDiaboliques.png",
    url: "/read/les-diaboliques",
    rendition: "Reflowable"
  },
  {
    title: "Bella the Dragon",
    author: "Barbara Nick, Elaine, Steckler",
    cover: "/images/Bella.jpg",
    url: "/read/bella-the-dragon",
    rendition: "Fixed Layout"
  }
];

export default function Home() {
  return (
    <main>
      <h1>Welcome to Thorium Web (Under Development)</h1>

      <p>Here’s a list of reflowable and fixed-layout publications you can read and test:</p>

      <PublicationGrid
        publications={ books }
      />

      { MANIFEST_CONFIG.enabled && (
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
      ) }
    </main>
  );
}
