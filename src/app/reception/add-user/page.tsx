'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Loader2, UserPlus, X } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { type ExtractUserDataOutput, extractUserData } from '@/ai/flows/extract-user-data-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';

type IdSide = 'front' | 'back';

export default function AddUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [frontIdImage, setFrontIdImage] = useState<string | null>(null);
  const [backIdImage, setBackIdImage] = useState<string | null>(null);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturingSide, setCapturingSide] = useState<IdSide>('front');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isCameraOpen) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setHasCameraPermission(true);
  
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          setIsCameraOpen(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        }
      };
      getCameraPermission();
    } else {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
  }, [isCameraOpen, toast]);

  const openCamera = (side: IdSide) => {
    setCapturingSide(side);
    setIsCameraOpen(true);
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        if (capturingSide === 'front') {
          setFrontIdImage(dataUri);
        } else {
          setBackIdImage(dataUri);
        }
        setIsCameraOpen(false);
      }
    }
  };

  const handleExtractData = async () => {
    if (!frontIdImage && !backIdImage) {
        toast({
            variant: "destructive",
            title: "No Images",
            description: "Please scan at least one side of the ID card."
        });
        return;
    }
    setIsProcessing(true);
    try {
        const result: ExtractUserDataOutput = await extractUserData({ 
            frontPhotoDataUri: frontIdImage || undefined,
            backPhotoDataUri: backIdImage || undefined
        });
        
        if(result.name) setName(result.name);
        if(result.email) setEmail(result.email);
        if(result.phone) setPhone(result.phone);
        if(result.address) setAddress(result.address);

        toast({
            title: 'Success!',
            description: 'Patient data extracted from ID.',
        });

    } catch (error) {
        console.error("Error extracting data: ", error)
        toast({
            variant: "destructive",
            title: "Extraction Failed",
            description: "Could not extract data from the ID. Please try again or enter manually."
        })
    } finally {
        setIsProcessing(false);
    }
  }

  const clearImage = (side: IdSide) => {
    if (side === 'front') setFrontIdImage(null);
    else setBackIdImage(null);
  }

  const IdImagePreview = ({ side, image, onClear }: { side: IdSide, image: string | null, onClear: (side: IdSide) => void }) => {
    if (!image) return null;
    return (
        <div className="relative">
            <Image src={image} alt={`${side} of ID`} width={150} height={95} className="rounded-md object-cover"/>
            <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => onClear(side)}>
                <X size={14}/>
            </Button>
        </div>
    )
  }


  return (
    <main className="flex justify-center items-start pt-12 md:pt-24 min-h-screen p-4">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Add New Patient</CardTitle>
          <CardDescription>
            Scan an ID or enter the patient's details below to create a new account.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full" onClick={() => openCamera('front')}>
                        <Camera className="mr-2 h-4 w-4" /> Scan Front of ID
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => openCamera('back')}>
                        <Camera className="mr-2 h-4 w-4" /> Scan Back of ID
                    </Button>
                </div>
                <div className="flex justify-center gap-4 my-4 min-h-[100px]">
                    <IdImagePreview side="front" image={frontIdImage} onClear={clearImage} />
                    <IdImagePreview side="back" image={backIdImage} onClear={clearImage} />
                </div>
                {(frontIdImage || backIdImage) && (
                    <Button className="w-full" onClick={handleExtractData} disabled={isProcessing}>
                        {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</> : 'Extract Data from ID'}
                    </Button>
                )}
            </div>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                    Or enter manually
                    </span>
                </div>
            </div>
          
            <form className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter patient's full name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter patient's email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="Enter patient's phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter patient's address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Patient Account
                </Button>
            </form>
        </CardContent>
      </Card>

      <AlertDialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <AlertDialogContent className="max-w-2xl w-[90vw] md:w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>Scan {capturingSide === 'front' ? 'Front' : 'Back'} of National ID</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="relative">
            <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="hidden" />
            
            {hasCameraPermission === false && (
                <Alert variant="destructive">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access to use this feature. You may need to change permissions in your browser settings.
                    </AlertDescription>
                </Alert>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCapture} disabled={hasCameraPermission !== true}>
              Capture
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
