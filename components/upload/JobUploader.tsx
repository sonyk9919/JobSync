"use client";

import { cn } from "@/utils/css/tailwind";
import parserFactory from "@/utils/parser/ParserFactory";
import { ParsedJob } from "@/utils/parser/types";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";

interface Props {
    handleResult: (job: ParsedJob) => void;
}

const JobUploader = ({ handleResult }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isValid, setIsValid] = useState(true);
    const [isDragIn, setIsDragIn] = useState(false);

    const handleClick = () => {
        if (!inputRef.current) return;
        inputRef.current.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files || files.length === 0) return;
        files.forEach(parseFile);
    }

    const parseFile = (file: File) => {
        const fileReader = new FileReader();
        fileReader.readAsText(file, 'utf-8');
        fileReader.onload = () => {
            if (typeof fileReader.result !== 'string') return;
            const parser = new DOMParser();
            const document = parser.parseFromString(fileReader.result, 'text/html');
            const result = parserFactory.parse(document);
            handleResult(result);
        };
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const items = Array.from(e.dataTransfer.items).filter(item => {
            return item.type === 'text/html'
        });
        setIsValid(items.length > 0);
        setIsDragIn(true);
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!isValid) {
            setIsValid(true);
            setIsDragIn(false);
            return;
        }
        Array.from(e.dataTransfer.files)
            .filter(file => file.type === 'text/html')
            .forEach(parseFile);
        setIsDragIn(false);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        setIsValid(true);
        setIsDragIn(false);
    };

    return (
        <div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} onClick={handleClick} className={cn("border-2 rounded-2xl md:w-3xl h-80 border-gray-100 border-dashed overflow-hidden hover:border-blue-100 duration-200 cursor-pointer", isDragIn && isValid && 'border-blue-100', isDragIn && !isValid && 'border-red-50')}>
            <div className="bg-gray-50 w-full h-full flex flex-col items-center justify-center gap-2">
                <div className="rounded-lg p-2 bg-blue-600">
                    <Upload className="text-blue-100"/>
                </div>
                <div className="text-center">
                    <div className="text-[16px] text-gray-900 font-bold">HTML 파일을 여기에 드래그하거나 클릭하세요</div>
                    <div className="text-[14px] text-gray-400 font-bold">Cmd+S로 저장한 채용공고 파일을 업로드하세요</div>
                </div>
                <input ref={inputRef} type="file" className="hidden" accept=".html" multiple onChange={handleChange}/>
            </div>
        </div>
    )
};

export default JobUploader;