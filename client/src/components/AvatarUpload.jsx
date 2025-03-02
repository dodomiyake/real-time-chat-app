import React, { useState } from "react";

export default function AvatarUpload({ user, setUser }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select an image!");

        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("userId", user._id); // Send user ID to backend

        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/api/user/upload-avatar", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                setUser({ ...user, avatar: data.avatar });
                alert("Avatar updated successfully!");
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error("Error uploading avatar:", error);
            alert("Error uploading avatar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>Upload Avatar</h3>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
            </button>
        </div>
    );
}
// In this component, we define a form for uploading a user's avatar. The form contains an input element of type 
// file that allows users to select an image file. When the user selects an image, we store it in the file state using the handleFileChange function.