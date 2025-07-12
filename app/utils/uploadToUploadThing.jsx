import * as FileSystem from "expo-file-system";
const UPLOADTHING_API_KEY =
  "sk_live_3884e19b50721e5915afb16fc793692ebf762491933f4fa34b9e8afffc5b85fa";
const FILE_ROUTE = "aaryanparkar-personal-team/studyNoteCollector-app";
const getMimeType = (uri) => {
  // eg. uri = "file:///storage/emulated/0/Download/test.jpg"
  const ext = uri?.split(".").pop()?.toLowerCase();
  const mimeMap = {
    jpg: "image/jpg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    pdf: "application/pdf",
  };
  return mimeMap[ext] || "application/octet-stream";
};

export async function uploadMultipleFiles(uris) {
  try {
    const uploadRequests = await Promise.all(
      uris.map(async (uri) => {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        const fileType = getMimeType(uri);
        const fileName = uri.split("/").pop() || "upload";
        return {
          name: fileName,
          type: fileType,
          size: fileInfo.size,
          uri,
        };
      })
    );

    const res = await fetch("https://uploadthing.com/api/uploadFiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-uploadthing-api-key": UPLOADTHING_API_KEY,
      },
      body: JSON.stringify({
        files: uploadRequests.map(({ name, type, size }) => ({
          name,
          type,
          size,
        })),
        route: FILE_ROUTE,
      }),
    });
    const json = await res.json();
    console.log("📡 UploadThing response:", JSON.stringify(json));

    if (!json?.data?.length) {
      throw new Error("UploadThing error: invalid response");
    }

    const uploadedFiles = [];

    for (let i = 0; i < json.data.length; i++) {
      const { fields, url, fileUrl, key } = json.data[i];
      const { uri, type, name } = uploadRequests[i];

      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
      formData.append("file", {
        uri: uri.startsWith("file://") ? uri : `file://${uri}`,
        name: name || `upload.${type.split("/")[1] || "jpg"}`,
        type: type || "application/octet-stream",
      });

      const uploadRes = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadRes.ok) {
        uploadedFiles.push({
          fileUrl,
          fileKey: key,
          fileName: name,
          type,
        });
      } else {
        console.warn(`❌ Upload failed for ${name}`);
      }
    }

    return uploadedFiles;
  } catch (err) {
    console.error("❌ Multi-upload failed:", err);
    return [];
  }
}
