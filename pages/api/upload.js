import { BlobServiceClient } from '@azure/storage-blob';

export default async function AzureStorageUpload(req, res) {

    if (req.method !== 'POST') {

        return res.status(405).end();
    }

    // Get your connection string from env variables or other secure sources

    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

    const containerName = 'tokenimagestest';

    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create a blob (file) name
    const {imageData, imageDataTwo, title, userId } = req.body;
    const blobName = userId + "/" + title + ".png";
    const blobNameTwo = userId + "/" + title + "two.png";

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const blockBlobClientTwo = containerClient.getBlockBlobClient(blobNameTwo);

    const uploadOptions = { blobHTTPHeaders: { blobContentType: 'image/png' } };

    const data = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64'); // Assuming you're sending the data as a buffer or string
    const dataTwo = Buffer.from(imageDataTwo.replace(/^data:image\/\w+;base64,/, ''), 'base64'); // Assuming you're sending the data as a buffer or string
    const uploadBlobResponse = await blockBlobClient.uploadData(data, uploadOptions);
    const uploadBlobResponseTwo = await blockBlobClientTwo.uploadData(dataTwo, uploadOptions);
    console.log("first url: ", uploadBlobResponse._response.request.url);
    console.log("second url: ", uploadBlobResponseTwo._response.request.url);
    res.status(200).send(res.json({url: uploadBlobResponse._response.request.url, urlTwo: uploadBlobResponseTwo._response.request.url}));

}