package main

import (
	"log"
	"net/http"
)

// Sub domains constants

// const (
// 	domain       = "localhost" //Don't forget to change URL
// 	blogDomain   = "blog." + domain
// 	adminDomain  = "admin." + domain
// 	designDomain = "design." + domain
// )

func startRouter() {
	mux := http.NewServeMux()
	// Default Handlers
	mux.HandleFunc("/", home)

	// Blog Handlers
	mux.HandleFunc("/blog", blogIndex)

	// Admin Handlers
	mux.HandleFunc("/admin", adminIndex)

	mux.HandleFunc("/contacts", contactIndex)

	// Design Handlers
	mux.HandleFunc("/design", designIndex)
	mux.HandleFunc("/download/", downloadHandler)
	mux.HandleFunc("/upload/", uploadFile)
	mux.HandleFunc("/list_files/", listFiles)

	// Blog Handlers
	mux.HandleFunc("/pwd", pwdIndex)

	fileServer := http.FileServer(http.Dir("./ui/static/"))
	mux.Handle("/static/", http.StripPrefix("/static", fileServer))

	log.Println("Starting server 9999", mux)
	err := http.ListenAndServe(":9999", mux)
	log.Fatal(err)
}
