import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './MarkdownViewer.module.scss';

interface MarkdownViewerProps {
    content: string;
    className?: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className }) => {
    return (
        <div className={className ? `${styles.viewer} ${className}` : styles.viewer}>
            <ReactMarkdown>
                {content}
            </ReactMarkdown>
        </div>
    );
};