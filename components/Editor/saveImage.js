export const save = async function (data) {
  const fileCompressionOptions = {
    maxSizeMB: 1, // (default: Number.POSITIVE_INFINITY),
    maxWidthOrHeight: 1280,
  };
  const compressedFile = await imageCompression(data, fileCompressionOptions);
  const storagePath = firebaseStorage.ref().child(`/img/${uuidv4()}.jpg`);

  try {
    await storagePath.put(compressedFile);
  } catch (error) {
    console.error(error);
    // TODO: handle errors
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  }

  let imgUrl = '';
  try {
    imgUrl = await storagePath.getDownloadURL();
  } catch (error) {
    console.error(error);
    // TODO: handle errors
    switch (error.code) {
      case 'storage/object-not-found':
        // File doesn't exist
        break;
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        break;
    }
  }
  return imgUrl;
};
