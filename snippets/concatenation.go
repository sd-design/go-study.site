package main

import (
	"bytes"
	"fmt"
)

func main() {
	var params = []string{"string-One", "string-Two", "string-Three", "string-Four"}
	var string1 string = "Hello"
	var string2 string = " world!"
	var result string
	result = string1 + string2
	fmt.Println(conkString(params))
	fmt.Println(conkBytes(params))
	fmt.Println(result)
}

func conkString(args []string) string {
	result := ""

	for _, arg := range args {
		result += arg
	}
	return result
}

func conkBytes(args []string) string {
	buffer := bytes.Buffer{}

	for _, arg := range args {
		buffer.WriteString(arg)
	}
	return buffer.String()
}
