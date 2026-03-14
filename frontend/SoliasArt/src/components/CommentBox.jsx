import { useState } from "react";
import { addComment } from "../api/feedApi";

function CommentBox({ targetType, targetId, userId }) {
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);

    async function handleSubmit(e) {
        // prevent form from reloading the page
        e.preventDefault();
        if (!text.trim()) return; // don't send empty comments

        setSending(true); // disable button while sending
        try {
            await addComment(targetType, targetId, userId, text);
            setText(""); // clear input after successful comment
        } catch (error) {
            console.error("Failed to add comment: ", error);
        } finally {
            setSending(false); // reenable button after request completes
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mx-3.5 mb-3">
            <div className="bg-stone-100-round-full px-4 py-2 flex items-center gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write a comment..."
                    className="bg-transparent text-sm text-stone-500
                    placeholder:text-stone-400 outline-none flex-1"
                    disabled={sending}
                />
                {/* Only show Send button when there is text */}
                {text.trim() && (
                    <button
                        type="submit"
                        disabled={sending}
                        className="text-amber-600 text-sm font-semibold"
                    >
                        {sending ? "Posting..." : "Post"}
                    </button>
                )}
            </div>
        </form>
    )
}

export default CommentBox