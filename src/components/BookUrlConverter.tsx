"use client";

import { useState } from "react";

import bookUrlConverterStyles from "./assets/styles/bookUrlConverter.module.css";

import { Button, Form, Input, Label, TextField } from "react-aria-components";

export const BookUrlConverter = () => {
  const [bookUrl, setBookUrl] = useState("");
  
  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookUrl) return;
    
    // Convert the book URL to base64 without padding
    const base64Url = btoa(bookUrl).replace(/=/g, "");
    // Redirect to the /read page with the base64 URL as a query parameter
    window.location.href = `${ window.location.href }/read?book=https://publication-server.readium.org/${ encodeURIComponent(base64Url) }/manifest.json`
  };

  return (
    <>
    <Form 
      className={ bookUrlConverterStyles.bookConverterForm }
      onSubmit={ handleAction }
    >
      <TextField>
        <Label
        className={ bookUrlConverterStyles.bookConverterFormLabel }
        >
          Load an EPUB publication from a remote server (it must support byte-range requests):
        </Label>
        <Input 
          className={ bookUrlConverterStyles.bookConverterFormInput }
          value={ bookUrl }
          onChange={ (e) => setBookUrl(e.target.value) }
          placeholder="https://www.example.org/ebook.epub"
        />
      </TextField>
      <Button 
        className={ bookUrlConverterStyles.bookConverterFormButton } 
        type="submit" 
      >
        Load
      </Button>
    </Form>
  </>
  )
}