var s3 = require('s3-upload-dir');
 
var params = {
    localDir: 'build',
    s3Params: {
        Bucket: 'agibbons.com'
    }
};
 
var uploader = s3.uploadDir(params);
 
uploader.on('error', function (err) {
    console.error("unable to upload:", err.stack);
});
 
uploader.on('progress', function () {
    console.log("progress", uploader.progressMd5Amount,
            uploader.progressAmount, uploader.progressTotal);
});
 
uploader.on('end', function () {
    console.log('ended:')
});