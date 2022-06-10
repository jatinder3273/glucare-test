import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "bootstrap/dist/css/bootstrap.min.css";
import "../scss/style.scss";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import CommonContext from "Context/CommonContext";
import { Provider } from "react-redux";
import store from "redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <title>GluCare</title>
      <CommonContext>
        <ToastContainer />
        <Component {...pageProps} />
      </CommonContext>
    </Provider>
  );
}

export default appWithTranslation(MyApp);
