import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { StableDiffusionModel } from '@/types/stableDiffusion';

class StableDiffusionApiCaller {
    async CreateImage(imageRequest: { title: string; prompt: string; userId: string }): Promise<any> {
        try {
            console.log("Received image request:", imageRequest);

            const modelData = new StableDiffusionModel();
            modelData.prompt = imageRequest.prompt;
            modelData.override_settings = {};
            modelData.override_settings["sd_model_checkpoint"] = "dDTopDownToken_v10.ckpt";

            const url = `${process.env.NEXT_PUBLIC_STABLE_DIFFUSION_API_URL}/sdapi/v1/txt2img`;
            console.log("Stable Diffusion API URL:", url);
            const imageResponse = await axios({
                method: 'post',
                url: '/sdapi/v1/txt2img',
                baseURL: `${process.env.NEXT_PUBLIC_STABLE_DIFFUSION_API_URL}`,
                data: modelData,
            });

            const imageData = imageResponse.data.images[2];
            const imageDataTwo = imageResponse.data.images[1];

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageData, imageDataTwo, title: imageRequest.title, userId: imageRequest.userId }),
            });
            return await response.json();
        } catch (error: any) {
            console.error('Error making POST request:', error);
            throw new Error('Internal server error');
        }
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { title, prompt, userId } = req.body;

    const apiCaller = new StableDiffusionApiCaller();
    try {
        console.log("about to create and upload image")
        const response = await apiCaller.CreateImage({ title, prompt, userId });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}