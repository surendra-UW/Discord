import { useRef, useState } from "react";
import upload from '../../public/cloud-upload.svg';
import Image from "next/image";
import { Button } from "./ui/button";
import AWS from 'aws-sdk';
import {X} from 'lucide-react'

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

export const FileUpload = ({ handleImageUpload, setS3Url }:any) => {
    const [selectedFile, setSelectedFile] = useState<File|null>(null);
    const [fileUploadStatus, setFileUploadStatus] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const fileInputRef = useRef(null);
    const VALID_IMAGE_EXTENSION = ['jpg', 'png', 'jpeg', 'PNG'];
  

  const previewComponent = () => {
    return (
      <div className="relative h-20 w-20">
        <Image 
        fill
        src={imageUrl}
        alt="Server Image"
        className="rounded-full"
        />
        <Button 
        onClick={() => {
          setImageUrl('');
          setSelectedFile(null);
          setFileUploadStatus('');
          handleImageUpload('');
          setS3Url('');
        }}
        className="bg-rose-500 text-white rounded-full absolute top-0 right-0 p-1"
        type="button"
        >
        <X className="h-4 w-5"></X>
        </Button>
      </div>
    );
  }

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
        setS3Url(response.Location);
        setFileUploadStatus('Upload successful!');

        const fileType = selectedFile?.name.split('.').pop();
        if(selectedFile) {
          if(fileType && VALID_IMAGE_EXTENSION.includes(fileType) ) {
            const fileReader = new FileReader();
            fileReader.onload = (event) => {
              setImageUrl(event.target?.result as string);
              handleImageUpload(event.target?.result);
            }
            fileReader.readAsDataURL(selectedFile);
        }
      }
        // If the uploaded file is image return the html with image

      } catch (error) {
        console.error(error);
        setFileUploadStatus('Upload failed. Please try again.');
      }
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

  if (imageUrl) {
    return previewComponent();
  }

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