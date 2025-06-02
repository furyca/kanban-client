// const taskQueue: (() => Promise<void>)[] = [];
// let isProcessing = false;

// export const enqueueTask = (task: () => Promise<void>) => {
//   taskQueue.push(task);
//   if (!isProcessing) {
//     processQueue();
//   }
// };

// const processQueue = async () => {
//   isProcessing = true;
//   while (taskQueue.length > 0) {
//     const nextTask = taskQueue.shift();
//     if (nextTask) {
//       await nextTask();
//     }
//   }
//   isProcessing = false;
// };