import { useSelector } from "react-redux";
const useAppSelector = () => useSelector((/** @type {import("./appStore").RootState}*/ store) => store.appStore);

export const useUserSelector = () => {
  const { user } = useAppSelector();
  return user;
};

export const useMessageReceiver = () => {
  const { messageReceiver, } = useAppSelector()
  return messageReceiver;
}

export default useAppSelector;
