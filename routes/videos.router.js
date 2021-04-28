const express = require("express");
const router = express.Router();
const Video = require("../models/video.model");
const {extend} = require("lodash");


router.route("/")
.get(async(req,res)=>{
    const videos = await Video.find({});
    res.status(200).json({response: videos, success: true});
})
.post(async(req,res)=>{
    try {
        const videoDetails = req.body;
        let videoIfExists = await Video.findById(videoDetails._id);
        if(videoIfExists) {
            videoIfExists = extend(videoIfExists, videoDetails);
            videoIfExists = await videoIfExists.save();
            res.status(200).json({response: videoIfExists, success: true});
        } else {
            let NewVideo = new Video(videoDetails);
            NewVideo = await NewVideo.save();
            res.status(201).json({response: NewVideo, success: true});
        }

    } catch(error) {
        res.status(500).json({ success: false, message: "Something went wrong", errorMessage: error.message})
    }
    
})

module.exports = router;