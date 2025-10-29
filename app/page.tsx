import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFeatured, getLatestByCategory } from "@/lib/store";
import Link from "next/link";

export default async function HomePage() {
    const featured = getFeatured();
    const latestArticles = getLatestByCategory("article", 3);
    const latestPoems = getLatestByCategory("poem", 3);
    const latestNews = getLatestByCategory("news", 3);
    const latestArt = getLatestByCategory("art", 3);

    return (
        <div className="space-y-10">
            <section className="grid gap-6 lg:grid-cols-2 items-stretch">
                <Card className="bg-muted border-dashed">
                    <CardContent className="p-6 md:p-10 flex flex-col justify-center">
                        <h1 className="text-3xl md:text-4xl font-semibold text-balance">Apodartho</h1>
                        <p className="mt-3 text-muted-foreground text-pretty">
                            The yearly wall magazine from the Department of Physics, College XYZ. A digital wall for
                            articles, poems, artwork, and news — where curiosity meets creativity.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Button asChild>
                                <Link href="/contribute">Contribute</Link>
                            </Button>
                            <Button asChild variant="secondary">
                                <Link href="/articles">Browse Posts</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {featured ? (
                    <Link href={`/post/${featured.id}`} className="group relative rounded-md overflow-hidden border">
                        <img
                            src={
                                featured.image ||
                                "/placeholder.svg?height=500&width=800&query=featured%20wall%20magazine" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                            }
                            alt={featured.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h2 className="text-white text-xl font-semibold drop-shadow">{featured.title}</h2>
                            <p className="text-white/90 text-sm drop-shadow">by {featured.author}</p>
                        </div>
                    </Link>
                ) : null}
            </section>

            <section className="space-y-4">
                <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-semibold">Latest Articles</h3>
                    <Link href="/articles" className="text-sm text-muted-foreground hover:underline">
                        View all
                    </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {latestArticles.map(p => (
                        <PostCard key={p.id} post={p} />
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-semibold">Latest Poems</h3>
                    <Link href="/poems" className="text-sm text-muted-foreground hover:underline">
                        View all
                    </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {latestPoems.map(p => (
                        <PostCard key={p.id} post={p} />
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-semibold">Latest Artwork</h3>
                    <Link href="/gallery" className="text-sm text-muted-foreground hover:underline">
                        View gallery
                    </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {latestArt.map(p => (
                        <PostCard key={p.id} post={p} />
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-semibold">Latest News</h3>
                    <Link href="/news" className="text-sm text-muted-foreground hover:underline">
                        View all
                    </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {latestNews.map(p => (
                        <PostCard key={p.id} post={p} />
                    ))}
                </div>
            </section>
        </div>
    );
}
