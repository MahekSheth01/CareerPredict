import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';

const ResumeUpload = ({ onUpload, isUploading }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

    const validateFile = (file) => {
        if (!file) return 'Please select a file.';
        if (file.type !== 'application/pdf') return 'Only PDF files are accepted.';
        if (file.size > MAX_SIZE) return 'File size must not exceed 5 MB.';
        return null;
    };

    const handleFile = useCallback((file) => {
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            setSelectedFile(null);
            return;
        }
        setError('');
        setSelectedFile(file);
    }, []);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (selectedFile && onUpload) {
            onUpload(selectedFile);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setError('');
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="w-full">
            {/* Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300
                    ${dragActive
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }
                `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleChange}
                    className="hidden"
                />

                <div className="flex flex-col items-center space-y-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors
                        ${dragActive
                            ? 'bg-primary-100 dark:bg-primary-800/40'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                    >
                        <Upload className={`w-8 h-8 ${dragActive ? 'text-primary-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                            {dragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            or click to browse • PDF only • Max 5 MB
                        </p>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mt-4 flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {/* Selected File */}
            {selectedFile && (
                <div className="mt-4 flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-700">
                    <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-primary-600" />
                        <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-xs">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {(selectedFile.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={(e) => { e.stopPropagation(); removeFile(); }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>
            )}

            {/* Upload Button */}
            {selectedFile && (
                <button
                    onClick={handleSubmit}
                    disabled={isUploading}
                    className="mt-4 w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isUploading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                            <span>Analysing Resume…</span>
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            <span>Analyse Resume</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default ResumeUpload;
