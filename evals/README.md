# Evals Quickstart

This folder houses promptfoo-based evaluations for the reader_api `/ask` endpoint. The harness runs locally and uses an Ollama-served model as an AI judge.

## 1. Prerequisites

- Node.js (matching the repo's frontend toolchain); run `nvm use` from the repo root if needed.
- [Ollama](https://ollama.ai) installed locally.
  - macOS: `brew install ollama` then `ollama run llama3` (or another model) to confirm the daemon works.
  - Linux: follow the official installer script from `https://ollama.ai/download`.
- A running `reader_api` instance that exposes the `/ask` endpoint.

## 2. Bootstrap the eval workspace

```bash
cd ./evals
npm install
cp .env.example .env  # Edit the values after copying.
```

Update the new `.env` file:

- `READER_API_URL`: Base URL for your running backend (e.g., `http://localhost:8000`).
- `OLLAMA_MODEL`: Name of the local model you pulled with Ollama (e.g., `llama3`, `mistral`).
  - Hint: Prefer a judge model that reliably scores factuality; larger models may give sharper gradients.

## 3. Fill in the placeholders

- `promptfooconfig.yaml`: Replace the rubric TODO block with concrete scoring rules. Think about:
  - Explicit score scale (e.g., 1–5) and what each number means.
  - Required elements for Anna Karenina answers (relevant plot facts, cites, tone, safety constraints).
  - Automatic failure conditions (hallucinations, refusal, policy violations, tool crash output).
- `scenarios/anna-karenina.yaml`: Swap each `TODO` prompt with a real Anna Karenina test case.
  - Capture varied behaviors: happy paths, deep retrieval, safety boundaries, and failure recovery.
  - Optionally attach gold responses via `expected:` if you want deterministic regression diffs.

## 4. Run evaluations

```bash
# Single run
npm run eval

# Re-run on every file save (hot reload)
npm run eval:watch

# Inspect prior runs in the browser UI
npm run eval:view
```

Each command automatically loads variables from `.env`. When using `eval:view`, the CLI prompts before opening a browser; pass `--yes` if you want to skip the confirmation.

### Smoke test checklist

1. Fill in all TODOs in `promptfooconfig.yaml` and `scenarios/anna-karenina.yaml`.
2. Confirm the Ollama daemon is running (e.g., `ollama serve` or `ollama list`).
3. Validate config wiring before the first run: `npx promptfoo validate --config promptfooconfig.yaml --env-path .env`.
4. Run a single-scenario dry run to confirm end-to-end wiring: `npm run eval -- --filter-first-n 1 --description "smoke"`.
5. Inspect the output with `npm run eval:view` to ensure the judge recorded a score and no HTTP/tooling errors occurred.

## 5. Interpreting results

- Promptfoo prints a table with judge scores. Use `promptfoo view` for a searchable UI with diffing.
- Document notable failures and adjust either the backend or the rubric until scores stabilize.

## 6. Next steps

- Add more Anna Karenina scenarios (translations, obscure subplots, adaptations).
- Capture real `/ask` transcripts and convert them into regression tests.
- Once rubric and scenarios are stable, wire this folder into CI (e.g., `npm run eval -- --no-share`) or trigger via your deployment pipeline.

## Troubleshooting

- Ollama errors: ensure the daemon is running (`ollama serve`) and model is pulled (`ollama pull llama3`).
- HTTP 4xx/5xx from `/ask`: make sure `READER_API_URL` points to a live backend and that request payload fields in `promptfooconfig.yaml` match the API contract.
- Promptfoo schema changes: run `npx promptfoo validate --config promptfooconfig.yaml` after you fill the placeholders to catch configuration errors.
