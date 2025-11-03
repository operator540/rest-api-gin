package data

import "example.com/rest-api-gin/internal/models"

var ArticlesData = []models.Article{
	{ID: "1", Title: "First Post", Content: "This is the content of the first post.", Author: "John Kaningem"},
	{ID: "2", Title: "Second Post", Content: "This is the content of the second post.", Author: "Molly Juss"},
	{ID: "3", Title: "Go is Fun", Content: "Let's learn Go and Gin.", Author: "Senor Islande"},
}
