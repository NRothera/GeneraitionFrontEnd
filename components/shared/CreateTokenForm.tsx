"use client"

import { races,weapons,armors,classes, hairLength, creditFee, genders } from '../../constants/index'; // Adjust the path as necessary to correctly import the races array
import { TransformSelect } from '../ui/transformSelect';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"


import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { startTransition, useEffect, useState } from 'react';
import { raceToPrompt } from '@/constants/racePrompts';
import { genderToPrompt } from '@/constants/genderPrompts';
import { weaponToPrompt } from '@/constants/weaponPrompts';
import { hairToPrompt } from '@/constants/hairPrompts';
import { armorToPrompt } from '@/constants/armorPrompts';
import { classToPrompt } from '@/constants/classPrompts';
import { addImage, doesUserHaveImageWithTitle, getNextImageTitle } from '@/lib/actions/image.actions';
import { InsufficientCreditsModal } from './InsufficientCreditsModal';
import { updateCredits } from '@/lib/actions/user.actions';
import DownloadButton from './DownloadButton';
import ClipLoader from 'react-spinners/ClipLoader';
import LoadingOverlay from './LoadingOverlay';

interface ImageRequest {
    title: string;
    prompt: string;
    userId: string;
}

const CreateTokenForm = ({ userId, creditBalance }: TokenFormProps) => {
  const {toast} = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [race, setRace] = useState('');
  const [weapon, setWeapon] = useState('');
  const [gender, setGender] = useState('');
  const [classType, setClassType] = useState('');
  const [armor, setArmor] = useState('');
  const [hair, setHair] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [formVisible, setFormVisible] = useState(true);
  const [addedImageUrl, setAddedImageUrl] = useState(null);
  const [addedImageUrlTwo, setAddedImageUrlTwo] = useState(null);
  const [titleError, setTitleError] = useState(''); // State for title error message
  const [showInsufficientCreditsModal, setShowInsufficientCreditsModal] = useState(false);
  const [promptText, setPromptText] = useState<string>(''); 
  const [negativePromptText, setNegativePromptText] = useState<string>(''); 

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAddedImageUrl(null);
    setAddedImageUrlTwo(null);
    setTitleError('');

    try {
      const response = await updateCredits(userId, creditFee)
    
        // Handle insufficient credits error
      if  (response.message === "Insufficient credits") {
        setShowInsufficientCreditsModal(true);

        setIsSubmitting(false);
        return;
      }
    }
    catch(error) {
      console.error("Error updating credits:", error);
      setIsSubmitting(false);
      return;
    }
    
    const chosenGender = genderToPrompt[gender]
    const chosenRace  = raceToPrompt[race];
    const chosenWeapon = weaponToPrompt[weapon];
    const chosenArmor = armorToPrompt[armor];
    const chosenHair = hairToPrompt[hair];
    const chosenClass = classToPrompt[classType];

    //write some code that calls the stable diffusion create image api 
    const titleOfImage = imageTitle ? imageTitle : await getNextImageTitle(userId);
    const titleExists = await doesUserHaveImageWithTitle({ userId, title: titleOfImage.replace(/\s/g, '_') });

    if (titleExists) {
      setTitleError('An image with this title already exists. Please choose a different title.');
      setIsSubmitting(false);
      return;
    }

    const parameters = [
      "masterpiece",
      "disney style",
      "white background",
      "view from above",
      chosenGender,
      chosenRace,
      chosenWeapon,
      chosenArmor,
      chosenHair,
      chosenClass,
      "facing forwards",
      "head tilted down",
      "<lora:TopDownTokenNAI:0.5>"
    ];

    
    // const prompt = parameters.filter(param => param !== undefined).join(", ");
    const prompt = promptText;
    console.log(prompt)
    // const prompt = `${chosenRace}, ${chosenWeapon}, ${chosenArmor}, ${chosenHair}, ${chosenClass}, white background, topdown, <lora:TopDownTokenNAI:0.6>`;

    const imageRequest = {
        title: titleOfImage.replace(/\s/g, '_'),
        prompt: prompt,
        negativePrompt: negativePromptText,
        userId: userId,
    }

    await createImage(imageRequest);
};

const createImage = async (imageRequest: ImageRequest) => {
    console.log(imageRequest);
    try {
        const response = await fetch('/api/generateImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(imageRequest),
        });

        console.log("Fetch response status:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("first url" + data.url)
        console.log("second url" + data.urlTwo)
        setAddedImageUrl(data.url);
        setAddedImageUrlTwo(data.urlTwo);
        setIsSubmitting(false);

        setFormVisible(false);

        const imageData = {
            title: imageRequest.title.replace(/\s/g, '_'),
            blobUrl: data.url,
            withBackgroundUrl: data.urlTwo,
          }

        await addImage({ image: imageData, userId: userId })
                .then((newImageResponse) => {
                    console.log("Image added successfully", newImageResponse);
                })
                .catch((error) => {
                    console.error("Error adding image", error);
                });
    } catch (error) {
        console.error("Error creating image:", error);
        setIsSubmitting(false);
    }
};


  return (
    //add styling to the form
    <div className='flex h-screen'>
        <div className="flex flex-col justify-between w-1/2 max-w-xl p-4">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {showInsufficientCreditsModal && <InsufficientCreditsModal />}
              <div className="grid w-full items-center gap-1.5 mb-4">
                      <Label htmlFor="imageTitle" className='text-white'>Choose your features</Label>
                      <Input type="text" id="imageTitle" placeholder="Image Title (Optional)" value={imageTitle} onChange={(e) => setImageTitle(e.target.value)}
                      style={{borderColor: titleError ? 'red' : 'inital'}}/>
                      {titleError && <p style={{ color: 'red', fontSize: '0.75rem'  }}>{titleError}</p>}
              
              </div>
              <div>
                <label htmlFor="promptText">Prompt</label>
                <textarea
                  id="promptText"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Enter additional prompt text"
                  rows={4}
                  cols={50}
                />
              </div>
              <div>
                <label htmlFor="negativePromptText">Negative Prompt</label>
                <textarea
                  id="negativePromptText"
                  value={negativePromptText}
                  onChange={(e) => setNegativePromptText(e.target.value)}
                  placeholder="Enter negative prompt text"
                  rows={4}
                  cols={50}
                />
              </div>
                <TransformSelect 
                    onValueChange={setGender} 
                    placeholder="Select a gender" 
                    label="Gender" 
                    items={genders} 
                />
                <TransformSelect 
                    onValueChange={setWeapon} 
                    placeholder="Select a weapon" 
                    label="Weapons" 
                    items={weapons} 
                />
                <TransformSelect 
                    onValueChange={setRace} 
                    placeholder="Select a race" 
                    label="Race" 
                    items={races} 
                />
                <TransformSelect 
                    onValueChange={setHair} 
                    placeholder="Select hair length" 
                    label="Hair Length" 
                    items={hairLength} 
                />
                <TransformSelect 
                    onValueChange={setArmor} 
                    placeholder="Select your armor" 
                    label="Armor" 
                    items={armors} 
                />
                <br />
                <div style={{width: '100%'}}>
                    <Button type="submit" className="button h-[44px] w-full md:h-[54px]">Create</Button>
                </div>
            </form>
            {/* <LoadingOverlay loading={isSubmitting} /> Add the loading overlay */}

        <div>
      </div>
    </div>
    <div style={{width:'25%'}}></div>
  <Carousel className="w-full max-w-xs">
  <CarouselContent>
    <CarouselItem>
      <div className="p-1">
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
          {!isSubmitting && !addedImageUrl && <span className="text-4xl font-semibold">1</span>}
          <div className={`${isSubmitting ? 'loading' : ''}`}>
              {isSubmitting && !addedImageUrl ? (
                  <ClipLoader size={50} color={"#123abc"} loading={isSubmitting} />
              ) : (
                  addedImageUrl && <img src={addedImageUrl} alt="Generated Image" />
              )}
          </div>
          </CardContent>
        </Card>
        <div className="flex justify-center mt-2">
          <p>Image without a background</p>
        </div>        
        { addedImageUrl && (
           <div className="flex justify-center mt-2">
            <DownloadButton url={addedImageUrl} filename="image_without_background.png" />
          </div>      
          )}
      </div>
    </CarouselItem>
    <CarouselItem>
      <div className="p-1">
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
          {!isSubmitting && !addedImageUrlTwo && <span className="text-4xl font-semibold">2</span>}
          <div className={`${isSubmitting ? 'loading' : ''}`}>
          {isSubmitting && !addedImageUrl ? (
                  <ClipLoader size={50} color={"#123abc"} loading={isSubmitting} />
              ) : (
                addedImageUrlTwo && <img src={addedImageUrlTwo} alt="Generated Image with background" />
              )}
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-center mt-2">
          <p>Image with a background</p>
        </div>
        {addedImageUrlTwo && (
          <div className="flex justify-center mt-2">
          <DownloadButton url={addedImageUrlTwo} filename="image_with_background.png" />
          </div>      
        )}
      </div>
    </CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
    
    </div> 
  );
}

export default CreateTokenForm;