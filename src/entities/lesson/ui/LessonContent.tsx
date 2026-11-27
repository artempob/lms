import React from 'react';
import { VideoPlayer, MarkdownViewer } from '@/shared/ui';
import styles from './LessonContent.module.scss';

interface LessonContentProps {
    title: string;
    videoUrl?: string | null;
    content?: string | null;
}

export const LessonContent: React.FC<LessonContentProps> = ({ title, videoUrl, content }) => {
    return (
        <article className={styles.container}>
            <h1 className={styles.title}>{title}</h1>

            {videoUrl && (
                <div className={styles.videoWrapper}>
                    <VideoPlayer url={videoUrl} />
                </div>
            )}

            {content && (
                <div className={styles.textWrapper}>
                    <MarkdownViewer content={content} />
                </div>
            )}
        </article>
    );
};