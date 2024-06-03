// Format to human readable date
export function formatDate (dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en')
};
