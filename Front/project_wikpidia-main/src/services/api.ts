const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export const articleService = {
    // функція створення статті
    async createArticle(title: string, content: string, comment: string) {
        const response = await fetch(`${BASE_URL}/api/articles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, comment })
        });
        if (!response.ok) throw new Error('API Error');
        return response.json();
    },
    // функція отримання статті за її slug
    async getArticleBySlug(slug: string) {
        const response = await fetch(`${BASE_URL}/api/articles/${slug}`);
        if (!response.ok) throw new Error('Article not found');
        return response.json();
    },
    // збереження статті користувачем до профіля
    async saveArticleToProfile(slug: string, token: string) {
        const response = await fetch(`${BASE_URL}/api/users/saved-articles`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ articleSlug: slug })
        });
        if (!response.ok) throw new Error('не вдалося зберегти статтю в особистому кабінеті.');
        return response.json();
    },
    // видалення статті (тільки для адмінів)
    async deleteArticle(slug: string, token: string) {
        const response = await fetch(`${BASE_URL}/api/articles/${slug}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Не вдалося видалити статтю. Доступ заборонено або ресурс відсутній.');
        return response;
    },
    // прив'язка статті до категорії (POST)
    async assignCategory(articleSlug: string, categoryId: number, token: string) {
        const response = await fetch(`${BASE_URL}/api/articles/${articleSlug}/categories`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ categoryId })
        });
        if (!response.ok) throw new Error('Помилка прив\'язки до категорії');
        return response.json();
    },
    // вилучення статті з категорії (DELETE)
    async removeCategory(articleSlug: string, categoryId: number, token: string) {
        const response = await fetch(`${BASE_URL}/api/articles/${articleSlug}/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Помилка вилучення з категорії');
        return response;
    },
    // отримання всіх тем обговорення для статті (app\article\[slug]\page.tsx)
    async getDiscussionTopics(slug: string) {
        const response = await fetch(`${BASE_URL}/api/articles/${slug}/discussions`);
        if (!response.ok) throw new Error('Не вдалося завантажити теми обговорення');
        return response.json(); // Повертає масив об'єктів тем із БД
    },
    // створення нової теми/коментаря в обговоренні з обов'язковою авторизацією
    async createDiscussionTopic(slug: string, topicTitle: string, commentContent: string, token: string) {
        const response = await fetch(`${BASE_URL}/api/articles/${slug}/discussions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: topicTitle, content: commentContent })
        });
        if (!response.ok) throw new Error('Помилка створення теми. Можливо, сесія застаріла.');
        return response.json();
    }
};