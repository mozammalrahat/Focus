import { Router, useRouter } from "next/router";
import nprogress from "nprogress";
import React, { createRef } from "react";
import {
  Container,
  Grid,
  Ref,
  Segment,
  Sticky,
  Visibility,
} from "semantic-ui-react";
import HeadTags from "./HeadTags";
import Navbar from "./Navbar";
import Search from "./Search";
import SideMenu from "./SideMenu";

function Layout({ children, user }) {
  const contextRef = createRef();
  const router = useRouter();

  Router.onRouteChangeStart = () => nprogress.start();
  Router.onRouteChangeComplete = () => nprogress.done();
  Router.onRouteChangeError = () => nprogress.done();

  return (
    <>
      <HeadTags />
      {user ? (
        router.pathname === "/" ? (
          <>
            <Container text style={{ paddingTop: "1rem" }}>
              {children}
            </Container>
          </>
        ) : (
          <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
            <Ref innerRef={contextRef}>
              <Grid>
                <Grid.Column floated="left" width={2}>
                  <Sticky context={contextRef}>
                    <SideMenu user={user} />
                  </Sticky>
                </Grid.Column>

                <Grid.Column width={10}>
                  <Visibility context={contextRef}>{children}</Visibility>
                </Grid.Column>

                <Grid.Column floated="left" width={4}>
                  <Sticky context={contextRef}>
                    <Segment basic>
                      <Search />
                    </Segment>
                  </Sticky>
                </Grid.Column>
              </Grid>
            </Ref>
          </div>
        )
      ) : (
        <>
          <Navbar />
          <Container text style={{ paddingTop: "1rem" }}>
            {children}
          </Container>
        </>
      )}
    </>
  );
}

export default Layout;
