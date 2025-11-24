import ReactMarkdown from 'react-markdown';

interface MarkdownTextProps {
    content: string;
}

export function MarkdownText({ content }: MarkdownTextProps) {
    return (
        <div className="prose prose-zinc max-w-none dark:prose-invert">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
}
