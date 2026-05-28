import type { MediaItem } from "@/lib/projects";

export function Media({ item }: { item: MediaItem }) {
  return (
    <figure className="space-y-2">
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        {item.type === "image" && (
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            className="h-auto w-full"
          />
        )}
        {item.type === "video" && (
          <video
            src={item.src}
            poster={item.poster}
            controls
            playsInline
            className="h-auto w-full"
          />
        )}
        {item.type === "youtube" && (
          <div className="relative aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${item.id}`}
              title="Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        )}
      </div>
      {item.caption && (
        <figcaption className="text-sm text-muted-foreground">
          {item.caption}
        </figcaption>
      )}
    </figure>
  );
}
