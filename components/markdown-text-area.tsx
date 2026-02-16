"use client"

import { useEffect, useState, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Link2,
    Heading2,
    Code,
    Quote,
    Eye,
    Pencil,
    Columns2,
    Maximize2,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownTextAreaProps {
    label?: string
    name: string
    placeholder?: string
    value?: string
    onChange?: (value: string) => void
    rows?: number
    required?: boolean
    className?: string
    helperText?: string
    maxLength?: number
}

export function MarkdownTextArea({
    label,
    name,
    placeholder = "Type your markdown here...",
    value = "",
    onChange,
    rows = 12,
    required = false,
    className = "",
    helperText,
    maxLength,
}: MarkdownTextAreaProps) {
    const [content, setContent] = useState(value)
    const [viewMode, setViewMode] = useState<"write" | "preview" | "split">("write")
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        setContent(value)
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        if (maxLength && newValue.length > maxLength) return
        setContent(newValue)
        onChange?.(newValue)
    }

    const insertMarkdown = (before: string, after: string = "", placeholderVal: string = "") => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = content.substring(start, end) || placeholderVal

        const newContent =
            content.substring(0, start) +
            before +
            selectedText +
            after +
            content.substring(end)

        setContent(newContent)
        onChange?.(newContent)

        // Restore focus and cursor
        setTimeout(() => {
            textarea.focus()
            const newPosition = start + before.length + selectedText.length
            textarea.setSelectionRange(newPosition, newPosition)
        }, 0)
    }

    // Keyboard Shortcuts
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case "b":
                    e.preventDefault()
                    insertMarkdown("**", "**", "bold text")
                    break
                case "i":
                    e.preventDefault()
                    insertMarkdown("*", "*", "italic text")
                    break
                case "k":
                    e.preventDefault()
                    insertMarkdown("[", "](url)", "link text")
                    break
            }
        }
    }

    const toolbarGroups = [
        [
            { icon: Heading2, label: "Heading", action: () => insertMarkdown("## ", "", "Heading"), shortcut: "" },
            { icon: Bold, label: "Bold", action: () => insertMarkdown("**", "**", "bold text"), shortcut: "Ctrl+B" },
            { icon: Italic, label: "Italic", action: () => insertMarkdown("*", "*", "italic text"), shortcut: "Ctrl+I" },
        ],
        [
            { icon: List, label: "Bullet List", action: () => insertMarkdown("- ", "", "Item"), shortcut: "" },
            { icon: ListOrdered, label: "Numbered List", action: () => insertMarkdown("1. ", "", "Item"), shortcut: "" },
        ],
        [
            { icon: Link2, label: "Link", action: () => insertMarkdown("[", "](url)", "text"), shortcut: "Ctrl+K" },
            { icon: Quote, label: "Quote", action: () => insertMarkdown("> ", "", "Quote"), shortcut: "" },
            { icon: Code, label: "Code", action: () => insertMarkdown("`", "`", "code"), shortcut: "" },
        ],
    ]

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center justify-between">
                {label && (
                    <Label htmlFor={name} className="text-sm font-medium">
                        {label} {required && <span className="text-red-500">*</span>}
                    </Label>
                )}
                {maxLength && (
                    <span className="text-xs text-muted-foreground">
                        {content.length} / {maxLength}
                    </span>
                )}
            </div>

            <div className="rounded-md border bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring">
                {/* Header: Tabs & Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b bg-muted/20 p-1 gap-2">
                    {/* View Toggles */}
                    <div className="flex bg-muted/50 rounded-md p-0.5 self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => setViewMode("write")}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-sm transition-all",
                                viewMode === "write" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Write
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("preview")}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-sm transition-all",
                                viewMode === "preview" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Eye className="h-3.5 w-3.5" />
                            Preview
                        </button>
                        <div className="hidden sm:block w-px bg-border mx-1 my-1" />
                        <button
                            type="button"
                            onClick={() => setViewMode("split")}
                            title="Split View"
                            className={cn(
                                "hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-sm transition-all",
                                viewMode === "split" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Columns2 className="h-3.5 w-3.5" />
                            Split
                        </button>
                    </div>

                    {/* Editor Toolbar (Only show in Write or Split) */}
                    {(viewMode === "write" || viewMode === "split") && (
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 sm:py-0 px-2 sm:px-0">
                            <TooltipProvider delayDuration={300}>
                                {toolbarGroups.map((group, groupIndex) => (
                                    <div key={groupIndex} className="flex items-center gap-0.5 pl-2 first:pl-0 border-l first:border-l-0 border-border/60">
                                        {group.map((btn) => (
                                            <Tooltip key={btn.label}>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                        onClick={btn.action}
                                                    >
                                                        <btn.icon className="h-4 w-4" />
                                                        <span className="sr-only">{btn.label}</span>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom" className="text-xs">
                                                    {btn.label} {btn.shortcut && <span className="text-muted-foreground ml-1">({btn.shortcut})</span>}
                                                </TooltipContent>
                                            </Tooltip>
                                        ))}
                                    </div>
                                ))}
                            </TooltipProvider>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className={cn(
                    "grid",
                    viewMode === "split" ? "grid-cols-2 divide-x" : "grid-cols-1"
                )}>
                    {/* Write Mode */}
                    <div className={cn(
                        "relative",
                        viewMode === "preview" ? "hidden" : "block"
                    )}>
                        <Textarea
                            ref={textareaRef}
                            id={name}
                            name={name}
                            value={content}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            required={required}
                            className={cn(
                                "min-h-[300px] w-full resize-y border-0 bg-transparent p-4 focus-visible:ring-0 rounded-none font-mono text-sm leading-relaxed",
                                viewMode === "split" && "resize-none h-full"
                            )}
                            style={{ height: viewMode === "split" ? "400px" : undefined }}
                        />
                    </div>

                    {/* Preview Mode */}
                    <div className={cn(
                        "p-4 overflow-y-auto bg-muted/10",
                        viewMode === "write" ? "hidden" : "block",
                        viewMode === "split" ? "h-[400px]" : "min-h-[300px]"
                    )}>
                        {content ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center text-muted-foreground gap-2 opacity-50">
                                <Eye className="h-8 w-8" />
                                <p className="text-sm">Nothing to preview</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer / Helper Text */}
            <div className="flex justify-between items-start text-xs text-muted-foreground">
                <p>{helperText}</p>
                <div className="flex gap-4">
                    <span className="hidden sm:inline-block">Basic formatting supported</span>
                    <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noreferrer" className="hover:underline hover:text-primary">Markdown Guide ↗</a>
                </div>
            </div>
        </div>
    )
}