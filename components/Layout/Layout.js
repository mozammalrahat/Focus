import { createMedia } from "@artsy/fresnel";
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
import MobileHeader from "./MobileHeader";
import Navbar from "./Navbar";
import Search from "./Search";
import SideMenu from "./SideMenu";

const AppMedia = createMedia({
  breakpoints: {
    zero: 0,
    mobile: 550,
    tablet: 850,
    computer: 1080,
  },
});
const mediaStyles = AppMedia.createMediaStyle();
const { Media, MediaContextProvider } = AppMedia;

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
          <>
            <style>{mediaStyles}</style>
            <MediaContextProvider>
              <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
                <Media greaterThanOrEqual="computer">
                  <Ref innerRef={contextRef}>
                    <Grid>
                      <Grid.Column floated="left" width={3}>
                        <Sticky context={contextRef}>
                          <SideMenu user={user} pc />
                        </Sticky>
                      </Grid.Column>

                      <Grid.Column width={10}>
                        <div
                          className="newfeed"
                          style={{ marginLeft: "45px", marginTop: "12px" }}
                        >
                          <Visibility context={contextRef}>
                            {children}
                          </Visibility>
                        </div>
                      </Grid.Column>

                      <Grid.Column floated="left" width={3}>
                        <Sticky context={contextRef}>
                          <Segment basic>
                            <Search />
                          </Segment>
                        </Sticky>
                      </Grid.Column>
                    </Grid>
                  </Ref>
                </Media>

                <Media between={["tablet", "computer"]}>
                  <Ref innerRef={contextRef}>
                    <Grid>
                      <Grid.Column floated="left" width={1}>
                        <Sticky context={contextRef}>
                          <SideMenu user={user} pc={false} />
                        </Sticky>
                      </Grid.Column>

                      <Grid.Column width={15}>
                        <div
                          className="newfeed"
                          style={{ marginLeft: "45px", marginTop: "12px" }}
                        >
                          <Visibility context={contextRef}>
                            {children}
                          </Visibility>
                        </div>
                      </Grid.Column>

                      <Grid.Column floated="left" width={1}>
                        <Sticky context={contextRef}>
                          <Segment basic>
                            <Search />
                          </Segment>
                        </Sticky>
                      </Grid.Column>
                    </Grid>
                  </Ref>
                </Media>

                <Media between={["mobile", "tablet"]}>
                  <Ref innerRef={contextRef}>
                    <Grid>
                      <Grid.Column floated="left" width={2}>
                        <Sticky context={contextRef}>
                          <SideMenu user={user} pc={false} />
                        </Sticky>
                      </Grid.Column>

                      <Grid.Column width={14}>
                        <div
                          className="newfeed"
                          style={{ marginLeft: "45px", marginTop: "12px" }}
                        >
                          <Visibility context={contextRef}>
                            {children}
                          </Visibility>
                        </div>
                      </Grid.Column>

                      <Grid.Column floated="left" width={1}>
                        <Sticky context={contextRef}>
                          <Segment basic>
                            <Search />
                          </Segment>
                        </Sticky>
                      </Grid.Column>
                    </Grid>
                  </Ref>
                </Media>

                <Media between={["zero", "mobile"]}>
                  <MobileHeader user={user} />
                  <Grid>
                    <Grid.Column>{children}</Grid.Column>
                  </Grid>
                </Media>
              </div>
            </MediaContextProvider>
          </>
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
