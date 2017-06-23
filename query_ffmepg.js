/**
 * Created by wikeLi on 2017/6/16.
 */

const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
  //开始转码
ffmpeg.setFfmpegPath(path.join(__dirname, './ffmpeg/ffmpeg.exe'))
ffmpeg.setFfprobePath(path.join(__dirname, './ffmpeg/ffprobe.exe'))

//ffmpeg.getAvailableFormats(function(err, formats) {
//  console.log('Available formats:');
//  console.dir(formats)
//});

ffmpeg.getAvailableCodecs(function(err, codecs) {
  console.log('Available codecs:');
  console.dir(codecs)
});
//
//ffmpeg.getAvailableEncoders(function(err, encoders) {
//  console.log('Available encoders:');
//  console.dir(encoders)
//});