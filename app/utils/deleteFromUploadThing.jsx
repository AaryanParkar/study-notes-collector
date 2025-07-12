export async function deleteFromUploadThing(fileKey) {
    try {
        if (!fileKey) {
            console.warn("⚠️ No fileKey provided to delete.");
            return;
        }

        const res = await fetch("https://uploadthing.com/api/deleteFile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-uploadthing-api-key": "UPLOADTHING_API_KEY",
            },
            body: JSON.stringify({
                fileKeys: Array.isArray(fileKey) ? fileKey : [fileKey], // ensure it's always an array
            }),
        });

        const json = await res.json();

        if (!json.success) {
            console.warn("🚫 UploadThing delete failed:", json);
        } else {
            console.log("✅ UploadThing file(s) deleted successfully.");
        }
    } catch (err) {
        console.error("❌ Error deleting from UploadThing:", err);
    }
}