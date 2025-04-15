# Thorium Web

Thorium Web is a web-based reader for EPUB and other digital publications, built using Next.js and modern web technologies. It is designed to provide a fast, responsive, and accessible reading experience.

## Features

- Supports EPUB
- Fast and responsive rendering of publications using Next.js
- Accessible design for readers with disabilities
- Customizable reading experience with themes, adjustable font sizes, line heights, word- and letter-spacing, etc.

## Getting Started

To get started with Thorium Web, follow these steps:

- Fork or clone the repository: git clone [https://github.com/your-username/thorium-web.git](https://github.com/your-username/thorium-web.git`)
- Install dependencies: `pnpm install`
- Start the development server: `pnpm dev`
- Open the reader in your web browser: [http://localhost:3000](http://localhost:3000)

The development server will automatically reload the page when you make changes to the code.

## Customizing

You can customize this project extensively through [Preferences](./src/preferences.ts): breakpoints, which and how to display actions, themes provided to users, configuration of the docking system, sizes and offsets of icons, etc.

See [Customization in docs](./docs/Customization.md) for further details.

## Building and Deploying

To build and deploy Thorium Web, run the following commands:

```bash
pnpm build
pnpm run deploy
```

This will create a production-ready build of the reader and deploy it to the specified hosting platform.

This repository is using the following configuration:

- Go-Toolkit on Google Cloud Run
- Thorium Web App on CloudFlare Pages
- Assets e.g. demo EPUBs stored on Google Cloud Storage

To deploy, the following script is run: 

```bash
npx @cloudflare/next-on-pages && npx wrangler pages deploy
```

It’s running with defaults, which means a commit triggers a build and deploy for the current branch to preview. You can then access the app from a subdomain using this branch name. 

More details in [the @cloudflare/next-on-pages repo](https://github.com/cloudflare/next-on-pages).

## Contributing

We welcome contributions to Thorium web! If you're interested in helping out, please fork this repository and submit a pull request with your changes.

## License

Thorium Web is licensed under the [BSD-3-Clause license](https://opensource.org/licenses/BSD-3-Clause).

## Acknowledgments

Thorium Web is built using a number of open-source libraries and frameworks, including [Readium](https://readium.org/), [React](https://reactjs.org/), [React Aria](https://react-spectrum.adobe.com/react-aria/index.html), and [Material Symbols and Icons](https://fonts.google.com/icons). We are grateful for the contributions of the developers and maintainers of these projects.