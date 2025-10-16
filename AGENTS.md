# This repo

This repo is an AI-powered ereading application that includes a frontend and backend. The frontend is a fork of https://github.com/edrlab/thorium-web and so this app uses the Readium Architecture for serving and navigating ebooks.

There are multiple code workspaces and each one is largely configured in its own folder. When using Cursor or VSCode, the config files are in the _.code-workspace file in the root folder and in _/.vscode/settings.json.

## Dependencies

Dependencies are managed using pip and pip-tools. Dependencies are listed in both requirements.in (for production) and dev.in (for development), then compiled with pinned hashes into requirements.txt and dev.txt. To find which dependencies are included in the project or to add a new dependency, see the .in files.

# Instructions

Make changes based only on the instructions in my prompt. If you think other actions are necessary or would be helpful, ask before adding them to the plan or doing them. When the prompt is vague or doesn't include specific instructions, create a more concrete set of steps and ask for confirmation before carrying them out.

If the prompt is a question that doesn't explicitly ask for you to take action, create a plan for me to approve before doing anything.
