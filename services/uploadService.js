export const uploadFile = async (file, onProgress) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Upload failed");
  }

  return data.url;
};
