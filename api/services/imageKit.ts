import ImageKit from "imagekit";

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

function _imageKit(_: any, res: any) {
  var result = imagekit.getAuthenticationParameters();
  res.send(result);
}

function _deleteFile(req: any) {
  const fileId = req.params;
  imagekit.deleteFile(fileId, function (error, result) {
    if (error) console.log(error);
    else console.log(result);
  });
}

export { _imageKit, _deleteFile };
