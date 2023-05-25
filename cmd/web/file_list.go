package main

import (
	"log"
	"os"
	"path"
)

type Row struct {
	ID       int
	Filename string
}
type List struct {
	FileList []Row
}

func getListFiles(folder string) (int, List) {
	Error := "Error"
	files, err := os.ReadDir(folder)
	if err != nil {
		log.Printf(Error)
	}
	Struct1 := List{}
	Struct2 := Row{}
	count := 0
	for _, f := range files {
		if path.Ext(f.Name()) == ".DS_Store" {

		} else {
			Struct2 = Row{count, f.Name()}
			Struct1.FileList = append(Struct1.FileList, Struct2)
			count++
		}

	}
	//fmt.Printf("%+v", Struct1)
	return count, Struct1
}
