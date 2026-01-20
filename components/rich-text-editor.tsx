'use client';

import { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    $getRoot,
    $insertNodes
} from 'lexical';

const theme = {
    paragraph: 'mb-2',
    text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
    },
};

function onError(error: Error) {
    console.error(error);
}

function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    setIsBold(selection.hasFormat('bold'));
                    setIsItalic(selection.hasFormat('italic'));
                    setIsUnderline(selection.hasFormat('underline'));
                }
            });
        });
    }, [editor]);

    return (
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${isBold ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                title="Fett"
            >
                <span className="font-bold text-gray-700 dark:text-gray-200">B</span>
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${isItalic ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                title="Kursiv"
            >
                <span className="italic text-gray-700 dark:text-gray-200">I</span>
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${isUnderline ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                title="Unterstrichen"
            >
                <span className="underline text-gray-700 dark:text-gray-200">U</span>
            </button>
        </div>
    );
}

// Dedicated Data Sync Plugin
function HtmlSyncPlugin({ initialHtml, onChange }: { initialHtml: string, onChange: (html: string) => void }) {
    const [editor] = useLexicalComposerContext();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (isInitialized) return;

        if (initialHtml) {
            editor.update(() => {
                const parser = new DOMParser();
                const dom = parser.parseFromString(initialHtml, 'text/html');
                const nodes = $generateNodesFromDOM(editor, dom);

                $getRoot().select();
                $insertNodes(nodes);
            });
        }
        setIsInitialized(true);
    }, [editor, initialHtml, isInitialized]);

    return (
        <OnChangePlugin
            onChange={(editorState) => {
                editorState.read(() => {
                    const html = $generateHtmlFromNodes(editor, null);
                    onChange(html);
                });
            }}
        />
    );
}

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
    const initialConfig = {
        namespace: 'WishlistEditor',
        theme,
        onError,
        nodes: [], // Add LinkNode, HeadingNode etc if needed
    };

    return (
        <div className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 bg-white dark:bg-gray-700 ${className}`}>
            <LexicalComposer initialConfig={initialConfig}>
                <ToolbarPlugin />
                <div className="relative">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="min-h-[100px] outline-none p-3 text-gray-900 dark:text-white" />
                        }
                        placeholder={
                            <div className="absolute top-14 left-3 text-gray-400 pointer-events-none">
                                {placeholder || 'Beschreibung eingeben...'}
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <HtmlSyncPlugin initialHtml={value} onChange={onChange} />
                </div>
            </LexicalComposer>
        </div>
    );
}
