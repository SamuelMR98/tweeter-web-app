export interface BaseView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage?: (message: string, duration?: number) => void;
}
