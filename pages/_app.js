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
      ctx.pathname === "/studentshub/[username]" ||
      ctx.pathname === "/studentshub/notifications" ||
      ctx.pathname === "/studentshub/post/[postId]" ||
      ctx.pathname === "/qa" ||
      ctx.pathname === "/qa/jobpostIndex" ||
      ctx.pathname === "/qa/[username]" ||
      ctx.pathname === "/qa/notifications" ||
      ctx.pathname === "/qa/post/[postId]" ||
      ctx.pathname === "/resource" ||
      ctx.pathname === "/resource/universityIndex" ||
      ctx.pathname === "/resource/university" ||
      ctx.pathname === "/resource/files" ||
      ctx.pathname === "/search" ||
      ctx.pathname === "/messages";

    // console.log("Path name is :");
    // console.log(ctx.pathname);
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
        // console.log("User is :", user);

        if (user && ctx.pathname !== "/" && !protectedRoutes) {
          // console.log("this is from _app.js");
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
