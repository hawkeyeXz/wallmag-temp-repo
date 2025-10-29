import { seedPosts } from "./data";
import type { Category, Post } from "./types";

const posts: Post[] = [...seedPosts];

export type QueryParams = {
    category?: Category;
    q?: string;
    page?: number;
    limit?: number;
};

export function queryPosts(params: QueryParams) {
    const { category, q, page = 1, limit = 6 } = params;
    const start = (page - 1) * limit;

    let filtered = posts.filter(p => p.approved);
    if (category) filtered = filtered.filter(p => p.category === category);
    if (q) {
        const s = q.toLowerCase();
        filtered = filtered.filter(
            p =>
                p.title.toLowerCase().includes(s) ||
                p.author.toLowerCase().includes(s) ||
                p.excerpt.toLowerCase().includes(s)
        );
    }

    const total = filtered.length;
    const items = filtered.sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(start, start + limit);

    return { items, total, page, pageSize: limit };
}

export function getLatestByCategory(category: Category, limit = 3) {
    return posts
        .filter(p => p.approved && p.category === category)
        .sort((a, b) => +new Date(b.date) - +new Date(a.date))
        .slice(0, limit);
}

export function getFeatured(): Post | null {
    const arts = posts.filter(p => p.approved && (p.category === "art" || p.image));
    return arts[0] ?? posts.find(p => p.approved) ?? null;
}

export function getPostById(id: string) {
    return posts.find(p => p.id === id && p.approved) ?? null;
}

export function likePost(id: string) {
    const idx = posts.findIndex(p => p.id === id);
    if (idx >= 0) {
        posts[idx] = { ...posts[idx], likes: posts[idx].likes + 1 };
        return posts[idx];
    }
    return null;
}

export type NewSubmission = {
    title: string;
    author: string;
    content: string;
    category: Category;
    image?: string;
};

export function addSubmission(sub: NewSubmission): Post {
    const id = Math.random().toString(36).slice(2);
    const post: Post = {
        id,
        title: sub.title,
        author: sub.author,
        content: sub.content,
        category: sub.category,
        image: sub.image,
        excerpt: sub.content.slice(0, 120) + (sub.content.length > 120 ? "..." : ""),
        likes: 0,
        date: new Date().toISOString(),
        approved: false, // requires admin approval
    };
    posts.unshift(post);
    return post;
}
