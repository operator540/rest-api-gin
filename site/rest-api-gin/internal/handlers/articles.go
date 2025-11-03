package handlers

import (
	"net/http"

	"example.com/rest-api-gin/internal/data"
	"example.com/rest-api-gin/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetArticles(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, data.ArticlesData)
}

func GetArticleByID(c *gin.Context) {
	id := c.Param("id")

	for _, a := range data.ArticlesData {
		if a.ID == id {
			c.IndentedJSON(http.StatusOK, a)
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "article not found"})
}

func GetArticlesByAuthor(c *gin.Context) {
	author := c.Param("author")
	var found []models.Article

	for _, a := range data.ArticlesData {
		if a.Author == author {
			found = append(found, a)
		}
	}

	c.IndentedJSON(http.StatusOK, found)
}

func PostArticles(c *gin.Context) {
	var newArticle models.Article

	if err := c.BindJSON(&newArticle); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newArticle.ID = uuid.New().String()
	data.ArticlesData = append(data.ArticlesData, newArticle)
	c.IndentedJSON(http.StatusCreated, newArticle)
}

func UpdateArticle(c *gin.Context) {
	id := c.Param("id")
	var updated models.Article

	if err := c.BindJSON(&updated); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for i, a := range data.ArticlesData {
		if a.ID == id {
			data.ArticlesData[i].Title = updated.Title
			data.ArticlesData[i].Content = updated.Content
			data.ArticlesData[i].Author = updated.Author
			c.IndentedJSON(http.StatusOK, data.ArticlesData[i])
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "article not found"})
}

func DeleteArticle(c *gin.Context) {
	id := c.Param("id")

	for i, a := range data.ArticlesData {
		if a.ID == id {
			data.ArticlesData = append(data.ArticlesData[:i], data.ArticlesData[i+1:]...)
			c.IndentedJSON(http.StatusOK, gin.H{"message": "article deleted"})
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "article not found"})
}
