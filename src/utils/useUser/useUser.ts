export default function useUser() {
  /** For now, assumption is that Remote User will be on 
   mobile device and Agent will be on desktop **/

  const checkIsUser = () => {
    let isUser: boolean;
    window.navigator.appVersion.includes('Mobile') ? (isUser = true) : (isUser = false);
    return isUser;
  };

  return checkIsUser;
}
