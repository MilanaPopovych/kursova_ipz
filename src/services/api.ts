const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const articleService = {
    // Функція створення статті
    async createArticle(title: string, content: string, comment: string) {
        const response = await fetch(`${BASE_URL}/api/articles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, comment })
        });
        if (!response.ok) throw new Error('API Error');
        return response.json();
    },

    // Функція отримання статті за її slug
    async getArticleBySlug(slug: string) {
        const response = await fetch(`${BASE_URL}/api/articles/${slug}`);
        if (!response.ok) throw new Error('Article not found');
        return response.json();
    }
};