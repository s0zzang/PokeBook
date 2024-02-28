function delay(time) {
  const shouldReject = false;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!shouldReject) {
        resolve();
      } else {
        reject();
      }
    }, time);
  });
}

export default delay;
