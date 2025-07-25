"use client";

import React from "react";

import { ThGrid } from "@/core/Components";
import { Link } from "react-aria-components";

import publicationGridStyles from "./assets/styles/publicationGrid.module.css";

export interface Publication {
  title: string;
  author: string;
  cover: string;
  url: string;
  rendition?: string;
}

export interface PublicationGridProps {
  publications: Publication[];
}

export const PublicationGrid = ({ 
  publications,
}: PublicationGridProps) => {
  return (
    <ThGrid
      className={ publicationGridStyles.publicationGrid }
      items={ publications }
      columnWidth={ 400 }
      gap="1.5rem"
      renderItem={ (publication, index) => (
        <Link
          href={ publication.url }
          key={ index }
          className={ publicationGridStyles.publicationCard }
        >
          <figure className={ publicationGridStyles.publicationCover }>
            <img
              src={ publication.cover }
              alt=""
              className={ publicationGridStyles.publicationImage }
            />
          </figure>
          <div className={ publicationGridStyles.publicationInfo }>
            <h2 className={ publicationGridStyles.publicationTitle }>{ publication.title }</h2>
            <p className={ publicationGridStyles.publicationAuthor }>{ publication.author }</p>
            { publication.rendition && <p className={ publicationGridStyles.publicationRendition }>{ publication.rendition }</p> }
          </div>
        </Link>
      )}
    />
  );
};