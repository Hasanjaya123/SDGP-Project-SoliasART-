import { useState } from "react";
import { toggleSave } from "../api/feedApi";

function SaveButton({ targetType, targetId, initialSaved, userId }) {
    const [saved, setSaved] = useState(initialSaved);

    async function handleClick() {
        // update UI immediately for responsiveness
        const newSaved = !saved;
        setSaved(newSaved);

        try {
            await toggleSave(targetType, targetId, userId);
        } catch (error) {
            setSaved(!newSaved); // if backend fails, undo the save state change
            console.error('Save failed: ', error);
        }
    }

    return (
        <button onClick={handleClick} className="ml-auto">
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={saved ? '#c47c2b' : 'none'}
                stroke={saved ? '#c47c2b' : '#57534e'}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
        </button>
    )
}

export default SaveButton
