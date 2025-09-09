import { IncomingForm } from "formidable";
import fs from "fs/promises";
import path from "path";

export const config = {
    api: { bodyParser: false },
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).end();
        return;
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const form = new IncomingForm({ uploadDir, keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
        
        if (err) {
            res.status(500).end();
            return;
        }

        let file = Array.isArray(files.file) ? files.file[0] : files.file;
        const ext = path.extname(file.originalFilename || "");
        const finalName = `file_${Date.now()}${ext}`;
        const finalPath = path.join(uploadDir, finalName);


        await fs.rename(file.filepath, finalPath);
        res.status(200).json({ filename: finalName });
    });
}
