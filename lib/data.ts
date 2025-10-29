import type { Post } from "./types";

export const seedPosts: Post[] = [
    {
        id: "p1",
        title: "The Echoes of Hallways",
        author: "Ananya Sharma",
        date: new Date().toISOString(),
        category: "poem",
        excerpt: "Footsteps whisper secrets of the day...",
        content:
            "Footsteps whisper secrets of the day,\nPinned notes dance in the breeze,\nOn this wall, we stitch our voices,\nInto a quilt of stories and dreams.",
        likes: 12,
        approved: true,
    },
    {
        id: "a1",
        title: "Why Our Wall Magazine Matters",
        author: "Faculty Editor",
        date: new Date(Date.now() - 86400000).toISOString(),
        category: "article",
        excerpt: "A living canvas for campus thought and creativity.",
        content:
            "Wall magazines turn corridors into conversation. This digital version preserves that spirit—open, vibrant, diverse—so your words and art meet readers anywhere.",
        likes: 25,
        approved: true,
    },
    {
        id: "n1",
        title: "Campus Fest Announced",
        author: "Student Council",
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        category: "news",
        excerpt: "Music, art, food stalls, and competitions all week.",
        content:
            "The annual Campus Fest starts next Monday. Stages across the main lawn, DIY booths, open mic nights, and the much-awaited art derby!",
        image: "/campus-festival-poster.jpg",
        likes: 5,
        approved: true,
    },
    {
        id: "art1",
        title: "Chalk Mural: The River",
        author: "Rohit Mehta",
        date: new Date().toISOString(),
        category: "art",
        excerpt: "Flowing lines and sky reflections.",
        content: "A study in motion and calm inspired by the monsoon.",
        image: "/student-chalk-mural-river.jpg",
        likes: 18,
        approved: true,
    },
    {
        id: "a2",
        title: "Five Tips to Start Writing",
        author: "Editor Team",
        date: new Date(Date.now() - 3 * 86400000).toISOString(),
        category: "article",
        excerpt: "Blank page blues? Try these quick warmups.",
        content:
            "1) Free-write for five minutes.\n2) Describe a hallway notice in detail.\n3) Rewrite a nursery rhyme as sci-fi.\n4) Interview your backpack.\n5) Post it!",
        likes: 9,
        approved: true,
    },
];
