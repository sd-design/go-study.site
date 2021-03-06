package main

import (
    "log"
    "net/http"
)


func main() {

    mux := http.NewServeMux()
    // Default Handlers
    mux.HandleFunc("/", home)

    // Blog Handlers
    mux.HandleFunc(blogDomain+"/", blogIndex)

    // Admin Handlers
    mux.HandleFunc(adminDomain+"/", adminIndex)

    // Design Handlers
    mux.HandleFunc(designDomain+"/", designIndex)
    mux.HandleFunc("/download/", downloadHandler)
    fileServer := http.FileServer(http.Dir("./ui/static/"))
    mux.Handle("/static/", http.StripPrefix("/static", fileServer))

    log.Println("Starting server 8080", mux)
    err := http.ListenAndServe(":8080", mux)
    log.Fatal(err)

}