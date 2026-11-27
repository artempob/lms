import React from 'react';
import styles from './VideoPlayer.module.scss';

interface VideoPlayerProps {
    url: string;
    poster?: string;
    className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, poster, className }) => {
    const getEmbedUrl = (sourceUrl: string) => {
        if (sourceUrl.includes('youtube.com') || sourceUrl.includes('youtu.be')) {
            const videoId = sourceUrl.split('v=')[1]?.split('&')[0] || sourceUrl.split('youtu.be/')[1];
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }
        if (sourceUrl.includes('vimeo.com')) {
            const videoId = sourceUrl.split('vimeo.com/')[1];
            return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
        }
        return null;
    };

    const embedUrl = getEmbedUrl(url);
    const containerClass = className ? `${styles.wrapper} ${className}` : styles.wrapper;

    if (embedUrl) {
        return (
            <div className={containerClass}>
                <iframe
                    src={embedUrl}
                    className={styles.player}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video player"
                />
            </div>
        );
    }

    return (
        <div className={containerClass}>
            <video
                src={url}
                poster={poster}
                controls
                controlsList="nodownload"
                className={styles.player}
            >
                Ваш браузер не поддерживает тег video.
            </video>
        </div>
    );
};