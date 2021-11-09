import axios from "axios";
import App from "next/app";
import { destroyCookie, parseCookies } from "nookies";
import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout/Layout";
import { redirectUser } from "../utils/authUser";
import baseUrl from "../utils/baseUrl";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { token } = parseCookies(ctx);
    let pageProps = {};

    const protectedRoutes =
      // ctx.pathname === "/" ||
      ctx.pathname === "/studentshub" ||
      ctx.pathname === "/[username]" ||
      ctx.pathname === "/notifications" ||
      ctx.pathname === "/post/[postId]";
    if (!token) {
      protectedRoutes && redirectUser(ctx, "/");
    }
    //
    else {
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
      }

      try {
        const res = await axios.get(`${baseUrl}/api/auth`, {
          headers: { Authorization: token },
        });

        const { user, userFollowStats } = res.data;
        console.log("User is :", user);

        if (user && ctx.pathname !== "/" && !protectedRoutes) {
          redirectUser(ctx, "/");
        }

        // if (user) redirectUser(ctx, "/");

        pageProps.user = user;
        pageProps.userFollowStats = userFollowStats;
      } catch (error) {
        destroyCookie(ctx, "token");
        redirectUser(ctx, "/");
      }
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
