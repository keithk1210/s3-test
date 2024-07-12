const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

var recordedChunks = []

    function stop() {
        mediaRecorder.stop()
        uploadVideo(bucketName,recordedChunks)
    }


    function handleDataAvailable(event) {
    console.log("Attempting to handle data with size: " + event.data.size);
      if (event.data.size > 0) {
          
          recordedChunks.push(event.data);
      }
    }

  function handleStop() {
      // Combine recorded chunks into a single video file
      
      const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(recordedBlob);

      // Create a link to download the video
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = videoUrl;
      console.log("Downloading this video... " + videoUrl)
      var subjID = jsPsych.data.get().last(1).values()[0]['participantID'];
      a.download = 'recorded-video' + subjID + '.webm';
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(videoUrl);
      recordedChunks = [];
      console.log("STOP HANDLED!")
    }

    async function initializeCameraStream() {
        try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { min: 320, ideal: 320 },
                height: { min: 240, ideal: 240 },
                facingMode: { ideal: "user" }
            },
            audio: false
        });

        // Setup MediaRecorder to record video
        mediaRecorder = new MediaRecorder(cameraStream);
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.onstop = handleStop;

        document.getElementById("myVideo").srcObject = cameraStream

        // Start recording when user allows access
        mediaRecorder.start();
        console.log("Created new mediaRecorder:")
        console.log(mediaRecorder)
        } catch (error) {
        console.error('Error accessing camera: ', error);
        }
  }

// Initialize the S3 client
const s3 = new S3Client({
  region: 'us-east-2' // Specify your region

});

// Function to upload a video to S3
const uploadVideo = async (bucketName, binaryData,fileName) => {
  try {

    // Set up S3 upload parameters
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: binaryData,
      ContentType: 'video/mp4', // Change this if your video is in a different format
    };

    // Upload the file
    const data = await s3.send(new PutObjectCommand(params));
    console.log('Video uploaded successfully:', data);
  } catch (err) {
    console.error('Error uploading video:', err);
  }
};

// Call the function
const bucketName = 'cheesebucketlehighu';

initializeCameraStream();

