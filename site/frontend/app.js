document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:8080';
    const articlesContainer = document.getElementById('articles-container');
    const articleForm = document.getElementById('article-form');
    const formModal = document.getElementById('form-modal');
    const showAddFormBtn = document.getElementById('show-add-form-btn');
    const closeModalBtn = document.querySelector('.close-btn');
    const authorSearchInput = document.getElementById('author-search');

    // --- API Functions ---

    const api = {
        getArticles: () => fetch(`${API_BASE_URL}/articles`).then(res => res.json()),
        getArticlesByAuthor: (author) => fetch(`${API_BASE_URL}/articles/author/${author}`).then(res => res.json()),
        createArticle: (article) => fetch(`${API_BASE_URL}/articles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(article),
        }).then(res => res.json()),
        updateArticle: (id, article) => fetch(`${API_BASE_URL}/articles/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(article),
        }).then(res => res.json()),
        deleteArticle: (id) => fetch(`${API_BASE_URL}/articles/${id}`, { method: 'DELETE' }),
    };

    // --- Render Functions ---

    const renderArticles = (articles) => {
        articlesContainer.innerHTML = '';
        if (!articles || articles.length === 0) {
            articlesContainer.innerHTML = '<p>No articles found.</p>';
            return;
        }
        articles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card';
            articleCard.innerHTML = `
                <h3>${article.title}</h3>
                <p class="author">By: ${article.author}</p>
                <p>${article.content}</p>
                <div class="actions">
                    <button class="edit-btn" data-id="${article.id}">Edit</button>
                    <button class="delete-btn" data-id="${article.id}">Delete</button>
                </div>
            `;
            articlesContainer.appendChild(articleCard);
        });
    };

    // --- Event Handlers ---

    const loadArticles = async () => {
        try {
            const articles = await api.getArticles();
            renderArticles(articles);
        } catch (error) {
            console.error('Failed to load articles:', error);
            articlesContainer.innerHTML = '<p>Error loading articles. Is the Go server running?</p>';
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById('article-id').value;
        const articleData = {
            id: id || String(Date.now()), // Assign new ID if creating
            title: document.getElementById('article-title').value,
            author: document.getElementById('article-author').value,
            content: document.getElementById('article-content').value,
        };

        try {
            if (id) {
                await api.updateArticle(id, articleData);
            } else {
                await api.createArticle(articleData);
            }
            closeModal();
            loadArticles();
        } catch (error) {
            console.error('Failed to save article:', error);
            alert('Failed to save article. Check console for details.');
        }
    };
    
    const handleActionsClick = async (e) => {
        const target = e.target;
        const id = target.dataset.id;

        if (target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this article?')) {
                try {
                    await api.deleteArticle(id);
                    loadArticles();
                } catch (error) {
                    console.error('Failed to delete article:', error);
                    alert('Failed to delete article.');
                }
            }
        }

        if (target.classList.contains('edit-btn')) {
            const articles = await api.getArticles();
            const articleToEdit = articles.find(a => a.id === id);
            if (articleToEdit) {
                openModalForEdit(articleToEdit);
            }
        }
    };

    const handleAuthorSearch = async () => {
        const authorName = authorSearchInput.value.trim();
        if (authorName) {
            try {
                const articles = await api.getArticlesByAuthor(authorName);
                renderArticles(articles);
            } catch (error) {
                console.error('Failed to search by author:', error);
            }
        } else {
            loadArticles(); // If search is cleared, load all articles
        }
    };

    // --- Modal Control ---

    const openModalForEdit = (article) => {
        articleForm.reset();
        document.getElementById('article-id').value = article.id;
        document.getElementById('article-title').value = article.title;
        document.getElementById('article-author').value = article.author;
        document.getElementById('article-content').value = article.content;
        formModal.style.display = 'block';
    };

    const openModalForAdd = () => {
        articleForm.reset();
        document.getElementById('article-id').value = '';
        formModal.style.display = 'block';
    };

    const closeModal = () => {
        formModal.style.display = 'none';
    };

    // --- Initial Setup ---

    showAddFormBtn.addEventListener('click', openModalForAdd);
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === formModal) closeModal();
    });
    articleForm.addEventListener('submit', handleFormSubmit);
    articlesContainer.addEventListener('click', handleActionsClick);
    authorSearchInput.addEventListener('input', handleAuthorSearch);

    loadArticles(); // Initial load
});
