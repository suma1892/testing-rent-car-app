import { useDispatch } from "react-redux"
import { toggleToast } from "redux/features/utils/utilsSlice";
import store from "redux/store";

interface IToast {
    title: string;
    message: string;
    type: 'success' | 'warning' | 'error';
}
export const showToast = ({
    title,
    message,
    type,
}: IToast) => {
    const dispatch = store.dispatch;
    const showToast = store.getState().utils.isShowToast;
    dispatch(toggleToast({
        title,
        message,
        type,
        show: !showToast
    }));
}