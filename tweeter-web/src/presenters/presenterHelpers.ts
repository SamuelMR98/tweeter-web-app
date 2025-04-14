export async function executeWithErrorHandling(
    operation: () => Promise<void>,
    errorMessage: string,
    errorHandler: (msg: string) => void
) {
    try {
        await operation();
    } catch (error) {
        errorHandler(`${errorMessage}: ${error}`);
    }
}
