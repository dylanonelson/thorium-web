package main

import (
	"fmt"
	"net/http"

	"publication_server/internal/config"
	httpapi "publication_server/internal/http"
)

func main() {
	r := httpapi.Router()
	addr := fmt.Sprintf(":%s", config.Port())
	_ = http.ListenAndServe(addr, r)
}


