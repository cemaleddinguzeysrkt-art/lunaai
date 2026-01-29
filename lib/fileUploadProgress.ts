// export const simulateFileUpload = (
//   file: File,
//   onProgress: (progress: number) => void
// ): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += Math.random() * 30;
//       if (progress >= 100) {
//         progress = 100;
//         onProgress(progress);
//         clearInterval(interval);
        
//         resolve();
//       } else {
//         onProgress(Math.floor(progress));
//       }
//     }, 400);
//   });
// };


export const simulateFileUpload = (
  file: File,
  onProgress: (progress: number) => void
): Promise<void> => {
  return new Promise((resolve) => {
    const BYTES_PER_SECOND = 1024 * 1024; 
    const UPDATE_INTERVAL_MS = 100;

    const totalTimeMs = Math.max((file.size / BYTES_PER_SECOND) * 1000, 500);

    const incrementPerTick = (UPDATE_INTERVAL_MS / totalTimeMs) * 100;

    let progress = 0;

    const interval = setInterval(() => {
      const jitter = Math.random() * 0.4 + 0.8;
      progress += incrementPerTick * jitter;

      if (progress >= 100) {
        progress = 100;
        onProgress(progress);
        clearInterval(interval);
        resolve();
      } else {
        onProgress(Math.floor(progress));
      }
    }, UPDATE_INTERVAL_MS);
  });
};