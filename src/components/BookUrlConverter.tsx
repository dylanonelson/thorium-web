"use client";

import { useState } from "react";

import Locale from "../resources/locales/en.json";

import bookUrlConverterStyles from "./assets/styles/bookUrlConverter.module.css";

import { ThForm } from "@/core/Components/Form/ThForm";
import { ThFormTextField } from "@/core/Components";

export const BookUrlConverter = () => {
  const [bookUrl, setBookUrl] = useState("");
  
  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookUrl) return;
    
    try {
      // Convert the book URL to base64Url format using TextEncoder for proper Unicode handling
      const bytes = new TextEncoder().encode(bookUrl);
      const binString = Array.from(bytes, byte => String.fromCodePoint(byte)).join('');
      const base64 = btoa(binString);
      const base64Url = base64
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      
      // Redirect to the /read page with the base64 URL as a query parameter
      window.location.href = new URL(
        `read?book=https://publication-server.readium.org/${encodeURIComponent(base64Url)}/manifest.json`, 
        window.location.href
      ).href;
    } catch (error) {
      console.error("Error encoding URL:", error);
      // You could add user-friendly error handling here
    }
  };

  return (
    <>
    <ThForm
      label={ Locale.bookUrlConverter.button }
      className={ bookUrlConverterStyles.bookConverterForm }
      onSubmit={ handleAction }
      compounds={{
        button: {
          className: bookUrlConverterStyles.bookConverterFormButton,
          isDisabled: !bookUrl
        }
      }}
    >
      <ThFormTextField
        label={ Locale.bookUrlConverter.label }
        name="book-url-converter"
        className={ bookUrlConverterStyles.bookConverterFormTextField }
        type="url"
        errorMessage={ Locale.bookUrlConverter.error }
        compounds={{
          label: {
            className: bookUrlConverterStyles.bookConverterFormLabel
          },
          input: {
            className: bookUrlConverterStyles.bookConverterFormInput,
            value: bookUrl,
            onChange: (e) => setBookUrl(e.target.value),
            placeholder: Locale.bookUrlConverter.placeholder
          },
          fieldError: {
            className: bookUrlConverterStyles.bookConverterFormFieldError
          }
        }}
      />
    </ThForm>
  </>
  )
}