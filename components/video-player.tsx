interface VideoPlayerProps {
    url: string;
}

export function VideoPlayer({ url }: VideoPlayerProps) {
    if (!url) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">No video available</p>
            </div>
        );
    }

    return (
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
                src={url}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Course video"
            />
        </div>
    );
}
