const fs = require("fs");
// const 
exports.getVideo = (req, res, next) => {
    //Ensure there is a range given for the video
    // const range = req.headers.range;
    const id = req.query.id;
    console.log(id);
    // if (!range) {
    //   res.status(400).send("Requires Range header");
    // }
    const videoRange = req.headers.range;

    if (videoRange) {
    
    const parts = videoRange.replace(/bytes=/, "").split("-");
    
    const start = parseInt(parts[0], 10);
    
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;  
    const videoPath = "./assets/sample.mp4";
    const videoSize = fs.statSync(videoPath).size;
    // const CHUNK_SIZE = (10 ** 6) / 2; // 1MB
    // const start = Number(range.replace(/\D/g, ""));
    // const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  
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
  }else {
    const videoSize = fs.statSync(videoPath).size;

    const head = {
    
    'Content-Length': videoSize,
    
    'Content-Type': 'video/mp4',
    
    };
    
    res.writeHead(200, head);
    
    fs.createReadStream(videoPath).pipe(res);
    
    }
  }