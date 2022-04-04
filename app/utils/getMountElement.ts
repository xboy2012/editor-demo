let mountElement: HTMLElement | undefined;

export const getMountElement = (): HTMLElement => {
  if (!mountElement) {
    mountElement = document.getElementById('app');
  }
  return mountElement;
};
