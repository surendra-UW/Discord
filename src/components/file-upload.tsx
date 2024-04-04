import { useRef, useState } from "react";
import upload from '../../public/cloud-upload.svg';
import Image from "next/image";
import { Button } from "./ui/button";
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_S3_REGION,
});

interface FileUploadProps {
    onChange: (url?: string) => void,
    value: string,
    endpoint: "messageFile" | "serverImage" 
}

export const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState<File|null>(null);
    const [fileUploadStatus, setFileUploadStatus] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (event: any) => {
        const file: File = event.target.files[0];
        setSelectedFile(file);
        console.log(process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID);
        console.log(process.env.NEXT_PUBLIC_S3_BUCKET_NAME);

    };

  const handleFileUpload = async (event:any) => {
    event.preventDefault();
    if (selectedFile) {
      // Perform the actual file upload here, e.g., using a library like Formidable or axios
      setFileUploadStatus('Uploading...');
    // Upload the image to S3
      const params = {
        Bucket: `${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}`,
        Key: selectedFile?.name, // Use a unique filename or add a timestamp
        Body: selectedFile,
      };

      try {
        console.log(params);
        const response = await s3.upload(params).promise();
        console.log(response)
        setFileUploadStatus('Upload successful!');
      } catch (error) {
        console.error(error);
        setFileUploadStatus('Upload failed. Please try again.');
      }
    //   setTimeout(() => {
    //     setFileUploadStatus('Uploaded successfully!');
    //   }, 2000);
    } else {
      setFileUploadStatus('Please select a file to upload.');
    }
  };

  const handleClick = () => {
    if (fileInputRef && fileInputRef.current) {
        const input = fileInputRef.current as HTMLInputElement;
        input.click();
    }
  };

  return (
    <div className="file-upload flex flex-col items-center justify-center p-10 border border-gray-200 rounded-lg">
      <div className="dropzone w-full h-40 border-dashed border-gray-400 rounded-lg 
      flex flex-col items-center justify-center relative cursor-pointer"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
        console.log('file is uploaded', event);
          const files = event.dataTransfer.files;
          handleFileChange({ target: { files } });
        }}
        onClick={handleClick}
      >
        <input ref={fileInputRef} type="file" onChange={handleFileChange} style={{ display: 'none' }} />
        <Image src={upload} 
            alt="Upload icon"
            height={60}
            width={60}
        />
        <p className="text-blue-500 font-bold text-center">Choose a file or drag and drop</p>
        <p className="text-zinc-500 text-center">Image(4MB)</p>
      </div>
      <Button onClick={handleFileUpload} hidden={!selectedFile} variant={'secondary'}>Upload</Button>
      <p>{fileUploadStatus}</p>
    </div>
  );
} 