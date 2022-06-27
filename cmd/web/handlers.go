package main

import (
    "log"
	"net/http"
)


const (
    domain = "go-study.site"
    blogDomain = "blog." + domain
    adminDomain = "admin." + domain
    designDomain = "design." + domain
)

func home(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("Hello from VPS Jino by Golang"))
}
func designIndex(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("Designa maina domain"))
}

func blogIndex(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("Blog domain"))
}
func adminIndex(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("Admin domain"))
}

func downloadHandler(w http.ResponseWriter, r *http.Request) {
    var file string
    file = "NaN"
    file = r.URL.Query().Get("file")
    log.Println(file)
    if file == "NaN" {
        http.NotFound(w, r)
        return
    }else{
        http.ServeFile(w, r, "./ui/downloads/"+file)
    }
}