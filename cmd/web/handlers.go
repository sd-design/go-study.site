package main

import (
	"html/template"
	"log"
	"net/http"
)

type Client struct {
	role string
	ip   string
}

type View struct {
	Client Client
}

func home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	//ip_address := r.Header.Get("X-Real-IP")
	newClient := Client{role: "client", ip: "0.0.0.0"}
	data := View{Client: newClient}

	// Initialize a slice containing the paths to the two files. Note that the
	// home.page.tmpl file must be the *first* file in the slice.
	files := []string{
		"./ui/html/client.page.tmpl",
		"./ui/html/menu.page.tmpl",
		"./ui/html/home.page.tmpl",
		"./ui/html/base.layout.tmpl",
	}
	// Use the template.ParseFiles() function to read the files and store the
	// templates in a template set. Notice that we can pass the slice of file paths
	// as a variadic parameter?
	ts, err := template.ParseFiles(files...)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, "Internal Server Error", 500)
		return
	}
	//log.Println(data.role)
	err = ts.Execute(w, data)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, "Internal Server Error", 500)
	}
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
	if file == "NaN" || file == "" {
		//Added condition of checking empty query or root download directory - || file == ""
		http.NotFound(w, r)
		return
	} else {
		http.ServeFile(w, r, "./ui/downloads/"+file)
	}
}
