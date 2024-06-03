// Format to human readable date
export function formatDate (timecode: number) {
  const date = new Date(timecode * 1000);
  return date.toLocaleDateString('en')
};
