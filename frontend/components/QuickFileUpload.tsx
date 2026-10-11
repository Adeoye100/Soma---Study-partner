import { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function QuickFileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleExtract = async () => {
        if (!file) return;
        setLoading(true);
        setText('');

        try {
            const { data } = await Tesseract.recognize(file, 'eng', {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        setProgress(Math.round(m.progress * 100));
                    }
                }
            });

            setText(data.text);
        } catch (error) {
            setText('Error: Could not extract text from file');
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">📄 Document Text Extraction</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                    Upload Image or PDF
                </label>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept="image/*,.pdf"
                    className="block w-full text-sm border rounded p-2"
                />
            </div>

            <button
                onClick={handleExtract}
                disabled={!file || loading}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? `Extracting... ${progress}%` : 'Extract Text'}
            </button>

            {loading && (
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded">
                        <div
                            className="bg-blue-600 h-2 rounded transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {text && (
                <div className="mt-6 p-4 border rounded bg-gray-50">
                    <h3 className="font-bold mb-2">Extracted Text:</h3>
                    <pre className="whitespace-pre-wrap text-sm">{text}</pre>
                </div>
            )}
        </div>
    );
}