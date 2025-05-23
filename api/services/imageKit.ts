import ImageKit from "imagekit";

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

function _imageKitGetAuth(_: any, res: any) {
  var result = imagekit.getAuthenticationParameters();
  res.send(result);
}

async function _deleteFile(req: any, res: any, next: any) {
  const ids = req.body;

  let promises = ids?.map(async (id: string) => {
    return await new Promise((resolve, reject) => {
      imagekit.deleteFile(id, (error) => {
        if (error) reject(error)
        else resolve(true)
      })
    })
  });

  Promise.all(promises)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => console.log(err))
}

export { _imageKitGetAuth, _deleteFile };
