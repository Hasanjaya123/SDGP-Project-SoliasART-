import { useEffect, useState } from "react";
import { addComment, getComments } from "../api/feedApi";

function CommentBox({ targetType, targetId, userId, onCommentCountChange }) {
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [comments, setComments] = useState([]);
    const [showAllComments, setShowAllComments] = useState(false);

    useEffect(() => {
        let active = true;

        async function loadComments() {
            try {
                const response = await getComments(targetType, targetId);
                const list = Array.isArray(response.data) ? response.data : [];
                if (!active) return;
                setComments(list);
                if (onCommentCountChange) {
                    onCommentCountChange(list.length);
                }
            } catch (error) {
                console.error("Failed to load comments:", error);
            }
        }

        loadComments();
        return () => {
            active = false;
        };
    }, [targetType, targetId, onCommentCountChange]);

    async function handleSubmit(e) {
        // prevent form from reloading the page
        e.preventDefault();
        if (!text.trim()) return; // don't send empty comments

        setSending(true); // disable button while sending
        try {
            const response = await addComment(targetType, targetId, userId, text);
            const created = response?.data;
            if (created?.content) {
                setComments((prev) => [created, ...prev]);
                setShowAllComments(true);
                if (onCommentCountChange) {
                    onCommentCountChange((prev) => (Number(prev) || 0) + 1);
                }
            }
            setText(""); // clear input after successful comment
        } catch (error) {
            console.error("Failed to add comment: ", error);
        } finally {
            setSending(false); // reenable button after request completes
        }
    }


    const visibleComments = showAllComments ? comments : comments.slice(0, 2);

    return (
        <div className="mx-3.5 mb-3 border-t border-stone-100 dark:border-gray-700 pt-2">
            {comments.length > 0 && (
                <div className="mb-2">
                    {comments.length > 2 && (
                        <button
                            type="button"
                            onClick={() => setShowAllComments((prev) => !prev)}
                            className="mb-1 block w-full text-left text-[11px] leading-4 text-stone-500 dark:text-gray-400 hover:text-stone-600 dark:hover:text-gray-300"
                        >
                            {showAllComments ? "Hide comments" : `View all ${comments.length} comments`}
                        </button>
                    )}

                    <div className="space-y-1.5">
                        {visibleComments.map((comment, index) => (
                            <p key={`${comment.user_id}-${index}`} className="text-sm leading-5 text-stone-800 dark:text-gray-300">
                                <span className="mr-2 font-semibold text-stone-900 dark:text-gray-100">
                                    {comment.user_name || "Unknown User"}
                                </span>
                                {comment.content}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-2 py-1">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-200 dark:bg-gray-700 text-[10px] font-semibold text-stone-700 dark:text-gray-200">
                        {String(userId || "U").slice(0, 1).toUpperCase()}
                    </div>

                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Add a comment..."
                        className="min-w-0 flex-1 bg-transparent text-sm text-stone-700 dark:text-gray-300 placeholder:text-stone-400 dark:placeholder:text-gray-500 outline-none"
                        disabled={sending}
                    />

                    <button
                        type="submit"
                        disabled={sending || !text.trim()}
                        className="text-sm font-semibold text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition disabled:cursor-not-allowed disabled:text-stone-300 dark:disabled:text-gray-600"
                    >
                        {sending ? "Posting" : "Post"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CommentBox