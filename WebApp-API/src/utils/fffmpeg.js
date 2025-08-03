// ffmpeg-static returns executable path directly
const ffmpegPath = require('ffmpeg-static');
// ffprobe-static will be object containing path
const ffprobePath = require('ffprobe-static').path;
const fluentFFMPEG = require('fluent-ffmpeg');

fluentFFMPEG.setFfmpegPath(ffmpegPath);
fluentFFMPEG.setFfprobePath(ffprobePath);


module.exports = fluentFFMPEG;

