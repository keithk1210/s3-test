const express = require('express');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Initialize the S3 client
const s3 = new S3Client({
    region: 'us-east-2' // Specify your region
});

// Body parser middleware
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '256gb' }));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle video upload
app.post('/upload', async (req, res) => {
    const bucketName = 'cheesebucketlehighu';
    const fileName = `recorded-video-${Date.now()}.webm`; // Generate a unique file name

    try {
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: req.body,
            ContentType: 'video/webm', // Change this if your video is in a different format
        };

        const data = await s3.send(new PutObjectCommand(params));
        res.json({ message: 'Video uploaded successfully', data });
    } catch (err) {
        console.error('Error uploading video:', err);
        res.status(500).json({ error: 'Error uploading video', details: err });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
