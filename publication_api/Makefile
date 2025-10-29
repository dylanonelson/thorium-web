GO ?= go
PORT ?= 8091
PUBLICATIONS_DIR ?= publications
BIN ?= bin/publication-server
PKG := ./...
MAIN := ./cmd/server

# Local bin directory for dev tools (separate from build output)
TOOLS_BIN ?= $(CURDIR)/.tools/bin

# Dev tools (pinned)
AIR_VERSION ?= v1.61.0
AIR := github.com/air-verse/air@$(AIR_VERSION)

.PHONY: deps tidy build run test race fmt vet lint coverage clean dev tools

deps: tidy ## Download modules
	$(GO) mod download
	test -d bin || mkdir -p bin

tidy: ## Tidy go.mod
	$(GO) mod tidy

tools: ## Install dev tools into .tools/bin
	@echo "Installing dev tools to $(TOOLS_BIN)"
	@mkdir -p $(TOOLS_BIN)
	@GOBIN=$(TOOLS_BIN) $(GO) install $(AIR)

build: deps ## Build server binary
	$(GO) build -o $(BIN) $(MAIN)

run: ## Run server with env
	PUBLICATION_SERVER_PORT=$(PORT) PUBLICATIONS_DIR=$(PUBLICATIONS_DIR) $(GO) run $(MAIN)

dev: deps tools ## Run server with live reload (Air)
	PUBLICATION_SERVER_PORT=$(PORT) PUBLICATIONS_DIR=$(PUBLICATIONS_DIR) $(TOOLS_BIN)/air -c .air.toml

test: deps ## Run unit tests
	$(GO) test $(PKG) -v

race: deps ## Run tests with -race
	$(GO) test $(PKG) -race -v

fmt: ## Format sources
	$(GO) fmt $(PKG)

vet: ## Vet sources
	$(GO) vet $(PKG)

lint: fmt vet ## Lightweight lint (fmt + vet)

coverage: ## Generate coverage report
	$(GO) test $(PKG) -coverprofile=coverage.out
	$(GO) tool cover -func=coverage.out

clean: ## Clean artifacts and caches
	rm -rf bin coverage.out
	$(GO) clean -cache -testcache


