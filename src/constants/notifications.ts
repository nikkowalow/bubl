export const notification = (title: string, message: string, type: string): any => {
    return {
        title,
        message,
        type,
        insert: "top",
        container: "bottom-left",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true
        }
    }
}

export const ERROR_TITLE = "Error";
export const SUCCESS_TITLE = "Success";

export const DANGER_TYPE = "danger";
export const SUCCESS_TYPE = "success";

export const WARNING_TYPE = "warning";
export const WARNING_TITLE = "Warning";