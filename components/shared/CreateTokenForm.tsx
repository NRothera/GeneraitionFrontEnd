"use client"

import { races,weapons,armors,classes, hairLength, creditFee } from '../../constants/index'; // Adjust the path as necessary to correctly import the races array
import { TransformSelect } from '../ui/transformSelect';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Button } from "@/components/ui/button"
import { startTransition, useState } from 'react';
import { raceToPrompt } from '@/constants/racePrompts';
import { weaponToPrompt } from '@/constants/weaponPrompts';
import { hairToPrompt } from '@/constants/hairPrompts';
import { armorToPrompt } from '@/constants/armorPrompts';
import { classToPrompt } from '@/constants/classPrompts';
import { addImage } from '@/lib/actions/image.actions';
import { InsufficientCreditsModal } from './InsufficientCreditsModal';
import { updateCredits } from '@/lib/actions/user.actions';

interface ImageRequest {
    title: string;
    prompt: string;
    userId: string;
}

const CreateTokenForm = ({ userId, creditBalance }: TokenFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [race, setRace] = useState('');
  const [weapon, setWeapon] = useState('');
  const [classType, setClassType] = useState('');
  const [armor, setArmor] = useState('');
  const [hair, setHair] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [formVisible, setFormVisible] = useState(true);
  const [addedImageUrl, setAddedImageUrl] = useState(null);
  const [addedImageUrlTwo, setAddedImageUrlTwo] = useState(null);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    setIsSubmitting(true);
    await updateCredits(userId, creditFee)
    
    e.preventDefault(); // Prevent the form from refreshing the page
    const chosenRace  = raceToPrompt[race];
    const chosenWeapon = weaponToPrompt[weapon];
    const chosenArmor = armorToPrompt[armor];
    const chosenHair = hairToPrompt[hair];
    const chosenClass = classToPrompt[classType];

    //write some code that calls the stable diffusion create image api 
    const titleOfImage = imageTitle ? imageTitle : "Image_Title";
    const prompt = `${chosenRace}, ${chosenWeapon}, ${chosenArmor}, ${chosenHair}, ${chosenClass}, (background color = #66FF00)`;

    const imageRequest = {
        title: titleOfImage.replace(/\s/g, '_'),
        prompt: prompt,
        userId: userId,
    }

    await createImage(imageRequest);
};


const createImage = async (imageRequest: ImageRequest) => {
    try {
        const response = await fetch('/api/generateImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(imageRequest),
        });

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
    }
};


  return (
    //add styling to the form
    <div className='flex h-screen'>
        <div className="flex flex-col justify-between w-1/2 max-w-xl p-4">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}
                <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="imageTitle" className='text-white'>Choose your features</Label>
                    <Input type="text" id="imageTitle" placeholder="Image Title" value={imageTitle} onChange={(e) => setImageTitle(e.target.value)}/>
                </div>
                <TransformSelect 
                    onValueChange={setRace} 
                    placeholder="Select a race" 
                    label="Races" 
                    items={races} 
                />
                <TransformSelect 
                    onValueChange={setWeapon} 
                    placeholder="Select a weapon" 
                    label="Weapons" 
                    items={weapons} 
                />
                <TransformSelect 
                    onValueChange={setHair} 
                    placeholder="Select hair length" 
                    label="Hair Length" 
                    items={hairLength} 
                />
                <TransformSelect 
                    onValueChange={setClassType} 
                    placeholder="Select a class" 
                    label="Class" 
                    items={classes} 
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
        <div>
      </div>
    </div>
    <div style={{width:'25%'}}></div>
    <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ display: 'contents', flexDirection: 'row', alignItems: 'center', width: '100%', border: '1px solid white' }}>
            <div className={`image-box ${isSubmitting ? 'loading' : ''}`} style={{ backgroundColor: 'gray', width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {addedImageUrl && <img src={addedImageUrl} alt="Generated Image" />}
            </div>
            <div style={{width:'25%'}}></div>

            <div className={`image-box ${isSubmitting ? 'loading' : ''}`} style={{ backgroundColor: 'gray', width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {addedImageUrlTwo && <img src={addedImageUrlTwo} alt="Generated Image with Background" />}
            </div>
        </div>
        </div>
    </div>
  );
}

export default CreateTokenForm;