package main

import (
	"example.com/rest-api-gin/internal/handlers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	router.GET("/articles", handlers.GetArticles)
	router.GET("/articles/:id", handlers.GetArticleByID)
	router.GET("/articles/author/:author", handlers.GetArticlesByAuthor)
	router.POST("/articles", handlers.PostArticles)
	router.PUT("/articles/:id", handlers.UpdateArticle)
	router.DELETE("/articles/:id", handlers.DeleteArticle)

	router.Run("localhost:8080")
}
