export const convertImage = async (file: File): Promise<string> => {
    const reader = new FileReader();
    await new Promise<void>((resolve, reject) => {
        reader.onload = () => {
            resolve();
        };
        reader.onerror = () => {
            reject(reader.error);
        };
        reader.readAsDataURL(file);
    });

    return reader.result as string;
};