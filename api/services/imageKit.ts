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

async function _deleteFile(req: any, res: any, next: any) {
  const fileId = req.params.id;

  imagekit.deleteFile(fileId, (error) => {
    if (error) res.status(404).send(error);
    else res.json("file removed");
  });
}

export { _imageKit, _deleteFile };
