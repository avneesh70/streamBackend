const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// app.use()

// app.get('/video', (req, res) => {
//     res.sendFile('assets/sample.mp4', { root: __dirname });
// });

app.get("/video", function (req, res) {
    // Ensure there is a range given for the video
    const range = req.headers.range;
    const id = req.query.id;
    console.log(id);
    if (!range) {
      res.status(400).send("Requires Range header");
    }
  
    const videoPath = "assets/sample.mp4";
    const videoSize = fs.statSync("assets/sample.mp4").size;
  
    const CHUNK_SIZE = (10 ** 6) / 2; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  
    // Create headers
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
  
    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);
  
    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });
  
    // Stream the video chunk to the client
    videoStream.pipe(res);
  });

app.listen(4000, () => {
    console.log('Listening on port 4000!')
});