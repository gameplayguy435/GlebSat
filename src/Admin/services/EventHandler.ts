const eventHandler = {
    on(event: string, callback: Function) {
        document.addEventListener(event, (e: CustomEvent) => callback(e.detail));
    },
    
    dispatch(event: string, data?: any) {
        document.dispatchEvent(new CustomEvent(event, { detail: data }));
    },
    
    remove(event: string, callback: Function) {
        document.removeEventListener(event, callback as EventListener);
    }
};
  
export default eventHandler;