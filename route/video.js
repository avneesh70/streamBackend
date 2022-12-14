// const router = require('express').Router();
// const videoController = require("../controllers/video");

// router.get("/",  videoController.getVideo);
// module.exports = router;

let fs      = require('fs')
let path    = require('path');
let express = require('express');

let router  = express.Router();
let metadata = require('../metadata')
//
//	Stream the video
//
router.get('/', function(req, res, next) {
    const range = req.headers.range;
    const id = req.query.id;
    // console.log(id);
    // console.log(metadata.id)
    console.log(metadata[1].name)
    if (!range) {
      res.status(400).send("Requires Range header");
    }
  
    let videoPath = metadata[0].location;
    let videoSize = fs.statSync(metadata[0].location).size;
    if (metadata[id]) {
      videoPath = metadata[id].location;
      videoSize = fs.statSync(metadata[id].location).size;
    }
    console.log(id)
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

module.exports = router;
