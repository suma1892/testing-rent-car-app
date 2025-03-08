import RNFetchBlob from 'rn-fetch-blob';
const fs = RNFetchBlob.fs;
let imagePath: string | null = null;

export async function convertUrlImageToBase64(url: any) {
  try {
    const resp = await RNFetchBlob.config({
      fileCache: true,
    }).fetch('GET', url);
    imagePath = resp.path();
    return resp.readFile('base64');
  } catch (error) {
    console.log('error', error);
  }
  // .then(resp => {
  //   imagePath = resp.path();
  //   return resp.readFile('base64');
  // })
  // .then(base64Data => {
  //   // here's base64 encoded image
  //   console.log(base64Data);
  //   // remove the file from storage
  //   //   return fs.unlink(imagePath);
  // });
}
