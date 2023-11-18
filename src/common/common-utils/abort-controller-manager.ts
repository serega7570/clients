let abortController = new AbortController();

export const getAbortController = () => abortController;

export const resetAbortController = () => {
  abortController.abort();
  abortController = new AbortController();
};
